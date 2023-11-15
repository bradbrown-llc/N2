import { readFile, readdir, createWriteStream, spawn } from './B1.mjs'

export default async ({ name, verbose, PUSH0 }={}) => {
    let debug = (...s) => { if (verbose) console.log(s) }
    let code = await readFile(`${process.env.N2_PATH}/pact/${name}/${name}.sol`, 'utf8')
    let version = code.match(/pragma solidity (.+?);/)?.[1]
    // if !PUSH0 option set, max version is 0.8.19
    if (!PUSH0 && version > '0.8.19') { code = code.replace(version, '0.8.19'); version = '0.8.19' }
    let response = await fetch('https://binaries.soliditylang.org/linux-amd64/list.json')
    let { latestRelease, releases } = await response.json()
    if (!PUSH0) latestRelease = '0.8.19'
    let neededCompiler = releases[version]
    if (version !== latestRelease) throw new Error(`version ${version} not latest release ${latestRelease}`)
    let localCompilers = (await readdir('${process.env.N2_PATH}/bin')).filter(file => file.match('solc-linux-amd64'))
    if (!localCompilers.includes(neededCompiler)) {
        debug(`acquiring compiler ${neededCompiler}`)
        let response = await fetch(`https://binaries.soliditylang.org/linux-amd64/${neededCompiler}`)
        let blob = await response.blob()
        let buffer = Buffer.from(await blob.arrayBuffer())
        let stream = createWriteStream(`${process.env.N2_PATH}/bin/${neededCompiler}`, { mode: 0o755 })
        let streamFinishPromise = new Promise(r => stream.on('finish', r))
        await new Promise(r => stream.write(buffer, r))
        stream.end()
        await streamFinishPromise
        debug(`compiler ${neededCompiler} acquired`)
    }
    let solc = spawn(`${process.env.N2_PATH}/bin/${neededCompiler}`, ['-', '--optimize-runs=99999', '--bin', '--abi'])
    let output = ''
    solc.stdout.on('data', d => {
        debug(`STDOUT ${d}`)
        output += d
    })
    solc.stderr.on('data', d => debug(`STDERR ${d}`))
    solc.stdin.write(code)
    solc.stdin.end()
    await new Promise(r => solc.on('exit', r))
    let rx = new RegExp(`${name} =+\\s*\\nBinary:\\s*\\n(.+)\nContract JSON ABI\n(.+)`)
    let [bytecode, abi] = output.match(rx).slice(1)
    bytecode = `0x${bytecode}`
    abi = JSON.parse(abi)
    return { bytecode, abi }
}