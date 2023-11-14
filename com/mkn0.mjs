import { spawn, writeFile, readFile, appendFile, mkdir, readdir, cp, copyFile } from './B1.mjs'
import { N0, config, Signer } from './B0.mjs'

let tryAcquireLock = () =>
    new Promise(r =>
        spawn('mkdir', ['/tmp/N2-lock'])
        .on('close', () => r(true))
        .stderr.on('data', () => r(false)))

let getChainId = async () => {
    while (!await tryAcquireLock()) await new Promise(r => setTimeout(r, 0))
    let chainId = BigInt(await readFile('/tmp/N2-chainid', 'utf-8').catch(() => { return '0' }))
    await writeFile('/tmp/N2-chainid', `${chainId + 1n}`)
    spawn('rmdir', ['/tmp/N2-lock'])
    return chainId
}

export default async ({ id=0, verbosity, mining=false, genesispath, bootnode, maxpeers=0, bin, env, monper }={}) => {

    // enforce minimum verbosity of 3 (haven't confirmed it's necessary, but lower didn't work and I suspect something like the enode or json rpc url aren't being logged below 3
    if (verbosity && verbosity < 3) verbosity = 3

    let args = []
    let tag = Array(4).fill(0).map(_ => parseInt(Math.random() * 256).toString(16).padStart(2, '0')).join('')
    // console.log(tag, id, bootnode)
    
    // create blank password file /tmp/N2-password
    await writeFile('/tmp/N2-password', '')
    
    // create /tmp/N2-root directory (will hold template keystore)
    await mkdir('/tmp/N2-root/keystore', { recursive: true }).catch(() => {})
    
    // create root accounts to be copied later
    await Promise.all(config.roots.map(async (root, i) => {
        await mkdir(`/tmp/N2-rdd${i}`).catch(() => {})
        await writeFile(`/tmp/N2-r${i}-key`, root.secret)
        let importproc = spawn(`${process.env.N2_PATH}/bin/${bin}`, [
            '--lightkdf',
            '--datadir', `/tmp/N2-rdd${i}`,
            'account', 'import', `/tmp/N2-r${i}-key`
        ])
        // importproc.stdout.on('data', chunk => `${chunk}`.trim().split('\n').map(line => console.log(i, `\x1b[${31 + id}m${tag}\x1b[0m\t${line}`)))
        // importproc.stderr.on('data', chunk => `${chunk}`.trim().split('\n').map(line => console.log(i, `\x1b[${31 + id}m${tag}\x1b[0m\t${line}`)))
        importproc.stdin.write('\n\n')
        let keystore; while (!(keystore = (await readdir(`/tmp/N2-rdd${i}/keystore`).catch(() => [])).filter(file => !file.match(/\.tmp/))[0]));
        await copyFile(`/tmp/N2-rdd${i}/keystore/${keystore}`, `/tmp/N2-root/keystore/${keystore}`)
    }))
    
    // create new datadir
    let datadir = await new Promise(async r => {
        let proc = spawn('mktemp', ['-dt', 'N2-chain-XXXXXXXXXXXXXXXX'])
        proc.stdout.on('data', chunk => r(`${chunk}`.trim()))
    })
    
    let chainId
    
    if (!genesispath) {
        // create and populate genesis
        let genesis = JSON.parse(await readFile('${process.env.N2_PATH}/lib/genesisTemplate.json', 'utf8'))
        genesis.config.chainId = chainId = 7306922652984242176n + await getChainId()
        genesis.config.clique.period = env == 'fprv' ? 0 : 1
        genesis.gasLimit = `0x${config.gasLimit.toString(16)}`
        genesis.extraData = `0x${''.padStart(32 * 2, '0')}${config.roots.map(root => new Signer(root.secret).address.slice(2)).join('')}${''.padStart(65 * 2, '0')}`
        genesis.alloc = config.roots.reduce((p, root) => (p[new Signer(root.secret).address] = { balance: `0x${root.alloc.toString(16)}` }, p), {})
        genesis = JSON.stringify(genesis, (_, v) => typeof v == 'bigint' ? ''+v : v).replace(/"(\d+)"/g, '$1')
        await writeFile(`${datadir}/genesis.json`, genesis, 'utf8')
    } else {
        // copy genesis from genesispath
        let genesis = await readFile(genesispath, 'utf8')
        chainId = BigInt(genesis.match(/chainId..(\d+)/)[1])
        await writeFile(`${datadir}/genesis.json`, genesis)
    }
    
    if (mining) {
    
        // copy the templated keystore into the new datadir
        await cp('/tmp/N2-root/keystore', `${datadir}/keystore`, { recursive: true })
    
        // push additional mining args to args array
        args.push(
            '--allow-insecure-unlock',
            '--password', '/tmp/N2-password',
            '--mine',
            '--miner.etherbase', new Signer(config.roots[id].secret).address,
            '--miner.gasprice', '0',
            '--unlock', new Signer(config.roots[id].secret).address
        )
        
    }
    
    // add bootnode arg
    if (bootnode) args.push('--bootnodes', bootnode)
    
    // geth init
    let initproc = spawn(`${process.env.N2_PATH}/bin/${bin}`, ['init', '--datadir', datadir, `${datadir}/genesis.json`])
    // initproc.stdout.on('data', chunk => console.log(`\x1b[${31 + id}m${tag}\x1b[0m\t${`${chunk}`.trim()}`))
    // initproc.stderr.on('data', chunk => console.log(`\x1b[${31 + id}m${tag}\x1b[0m\t${`${chunk}`.trim()}`))
    await new Promise(r => initproc.on('close', r))
    
    if (!maxpeers) args.push('--nodiscover')
    
    // default geth args
    args.push(
        '--datadir', datadir,
        '--syncmode', 'full',
        '--netrestrict', '127.0.0.1/32',
        '--authrpc.port', '0',
        '--http',
        '--http.addr', '0.0.0.0',
        '--http.api', 'eth,web3,net,debug',
        '--http.corsdomain', '*',
        '--http.port', '0',
        '--http.vhosts', '*',
        '--maxpeers', ''+maxpeers,
        '--nat', 'none',
        '--port', '0',
        '--networkid', chainId,
        '--verbosity', ''+(verbosity ?? 5)
    )
    
    // console.log(args)
    
    let proc = spawn(`${process.env.N2_PATH}/bin/${bin}`, args)
    
    let enodeResolver, enodePromise = new Promise(r => enodeResolver =  r)
    let urlResolver, urlPromise = new Promise(r => urlResolver = r)
    
    proc.stderr.on('data', chunk => {
        // log output if verbosity is not undefined
        if (verbosity) appendFile(`${process.env.N2_PATH}/log/${tag}.log`, `${chunk}`.split('\n')
            .filter(line => !line.match('not contained in netrestrict list'))
            .filter(line => !line.match('FINDNODE'))
            .filter(line => !line.match('NEIGHBORS'))
            .filter(line => !line.match('DNS discovery lookup'))
            .join('\n'), 'utf8')
            // .map(line => `${/*'\x1b[${31 + id}m${tag}\x1b[0m\t'*/''}${line}`), 'utf8')
        if (`${chunk}`.match('enode:')) enodeResolver(`${chunk}`.match(/enode:[^\n]+/)[0].replace(/\?.+/, ''))
        if (`${chunk}`.match(/auth=false/)) urlResolver(`http://localhost:${`${chunk}`.match(/(\d+) auth=false/)[1]}`)
    })
    
    let [enode, url] = await Promise.all([enodePromise, urlPromise])
    
    return new N0({ tag, url, enode, datadir, env, monper })
    
}