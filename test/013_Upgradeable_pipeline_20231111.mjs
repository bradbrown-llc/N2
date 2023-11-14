// TODO: update ProxyERC20.sol 
//      chg fn name initProxyErc20 to initializeProxyErc20
//      add transfer event in initializeProxyErc20
import { mkn1, mkn2, N0, N1, N2, Signer, config, Pact, sleep, keccak256, encode } from './B0.mjs'
import { readFile, writeFile, setGlobalDispatcher, Agent } from './B1.mjs'
setGlobalDispatcher(new Agent({ connect: { timeout: 300000 } }))
let n2, env = 'main' // fprv | sprv | test | main
switch (env) {
    case 'fprv': n2 = await mkn2({ bin: 'geth-linux-amd64-1.10.26-e5eb32ac', env, monper: 10 }); break
    case 'sprv': n2 = new N2([
        await mkn1({ bin: 'geth-linux-amd64-1.11.0-18b641b0', env }), 
        await mkn1({ bin: 'geth-linux-amd64-1.11.0-18b641b0', env }), 
        await mkn1({ bin: 'geth-linux-amd64-1.10.26-e5eb32ac', env })
    ]); break
    case 'test': 
        var n2_urls = [
            ["https://eth-sepolia-public.unifra.io", "https://ethereum-sepolia.publicnode.com", "https://gateway.tenderly.co/public/sepolia", "https://ethereum-sepolia.blockpi.network/v1/rpc/public", "https://1rpc.io/sepolia", "https://eth-sepolia.public.blastapi.io", "https://rpc.notadegen.com/eth/sepolia", "https://endpoints.omniatech.io/v1/eth/sepolia/public", "https://rpc.sepolia.org", "https://rpc-sepolia.rockx.com", "https://rpc.sepolia.ethpandaops.io", "https://rpc2.sepolia.org", "https://sepolia.gateway.tenderly.co", "https://eth-sepolia.g.alchemy.com/v2/demo"],
            ["https://polygon-mumbai.blockpi.network/v1/rpc/public", "https://rpc.ankr.com/polygon_mumbai", "https://gateway.tenderly.co/public/polygon-mumbai", "https://polygon-testnet.public.blastapi.io", "https://polygon-mumbai-pokt.nodies.app", "https://endpoints.omniatech.io/v1/matic/mumbai/public", "https://rpc-mumbai.maticvigil.com", "https://api.zan.top/node/v1/polygon/mumbai/public", "https://polygon-mumbai-bor.publicnode.com", "https://polygon-mumbai.gateway.tenderly.co", "https://polygon-mumbai.g.alchemy.com/v2/demo", "https://polygontestapi.terminet.io/rpc"],
            ["https://fantom-testnet.publicnode.com", "https://rpc.testnet.fantom.network", "https://fantom-testnet.public.blastapi.io", "https://endpoints.omniatech.io/v1/fantom/testnet/public", "https://rpc.ankr.com/fantom_testnet", "https://fantom.api.onfinality.io/public"]
        ]
        n2 = new N2(n2_urls.map(n1_urls => new N1(n1_urls.map(url => new N0({ url })))))
        break
    case 'main':
        var n2_urls = JSON.parse(await readFile(`${process.env.N2_PATH}/lib/main_nodes.json`)).slice(0, 1)
        n2 = new N2(n2_urls.map(n1_urls => new N1(n1_urls.map(url => new N0({ url })))))
        break
    default: throw new Error(`unhandled env ${env}`)
}
if (env == 'sprv') await sleep(1000)
let replacer = (_, v) => {
    if (typeof v == 'bigint') return ''+v
    else if (v instanceof AggregateError) { return JSON.stringify(v.errors.map(error => error.message)) }
    else return v
}
// console.log(n2_urls.filter(url_list => url_list.length == 1).length)
let blocks = (await n2.blockNumber).map(f => f?.value ?? f)
let logs = await n2.getLogs(blocks.map(n => typeof n != 'bigint' ? n : ({
    fromBlock: (n - 999n) < 0n ? 0n : (n - 999n),
    toBlock: n,
    topics: ['0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822']
})))
await writeFile(`${process.env.N2_PATH}/log/main_blockNumber`, JSON.stringify(logs, replacer, 4), 'utf8')

// logs = logs.map(logs => logs.value.reduce((p, c) => (c.topics.slice(1).forEach(topic => p[topic] = (p[topic] ?? 0n) + 1n), p), {}))
// logs = logs.map(logs => Object.entries(logs).sort(([aA, aC], [bA, bC]) => aC < bC ? 1 : -1 ))
// let signer = env.match('prv') ? new Signer(config.roots[0].secret) : new Signer(process.env.GTMN_Test_secret)
// n2.signers.add(signer)
// let Upgradeable = new Pact({ n: n2, name: 'UPGRADEABLE', coderType: 'assemble' })
// console.dir(await Upgradeable.deploy([{ nonce: 0n }, { nonce: 0n }, { nonce: 0n }]), { depth: Infinity })
// Upgradeable.address = Array(n2.n1s.length).fill(`0x${keccak256(encode([signer.address, 0n])).slice(-40)}`)
// let ProxyERC20 = new Pact({ n: n2, name: 'ProxyERC20', coderType: 'compile' })
// console.dir(await ProxyERC20.deploy([{ nonce: 1n }, { nonce: 1n }, { nonce: 1n }]), { depth: Infinity })
// ProxyERC20.address = Array(n2.n1s.length).fill(`0x${keccak256(encode([signer.address, 1n])).slice(-40)}`)
// console.dir(await Upgradeable.SETFACET([ProxyERC20], [{ nonce: 2n }, { nonce: 2n }, { nonce: 2n }]), { depth: Infinity })
// Upgradeable.abi = [...await Upgradeable.abi, ...await ProxyERC20.abi]
// console.dir(await Upgradeable.initProxyErc20([{ nonce: 3n }, { nonce: 3n }, { nonce: 3n }]), { depth: Infinity })
// let UniswapV2Router02 = new Pact({
//     n: n2,
//     abi: JSON.parse(await readFile(/* router02 ABI */, 'utf8')),
//     address: [
//         '0x86dcd3293C53Cf8EFd7303B57beb2a3F671dDE98',
//         '0xf986d566329E7f457ef07144187A2167B25583b7',
//         '0xeaAE37F2d1cd994Badd4E818e754a6ba29278949'
//     ]
// })
// console.dir(await Upgradeable.approve(UniswapV2Router02.address, 10000000000000n, [{ nonce: 4n }, { nonce: 4n }, { nonce: 4n }]), { depth: Infinity }) 
// console.dir(await UniswapV2Router02.addLiquidityETH(
//     Upgradeable.address, // token
//     10000000000000n, // amountTokenDesired
//     10000000000000n, // amountTokenMin
//     1000000000n, // amountETHMin
//     signer.address, // to
//     parseInt(Date.now() / 1000) + 3600, // deadline
//     [{ value: 1000000000n, nonce: 5n }, { value: 1000000000n, nonce: 5n }, { value: 1000000000n, nonce: 5n }] // overrides
// ), { depth: Infinity})
// let blocks = (await n2.blockNumber).map(f => f?.value ?? f)
// console.dir(blocks, { depth: Infinity })
// console.dir((await n2.getLogs(blocks.map(n => ({
//     fromBlock: n - 5000n,
//     toBlock: n,
//     topics: ['0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822']
// })))).map(f => f?.value?.length), { depth: Infinity })
// process.exit()

// '${process.env.N2_PATH}/pact/UniswapV2Router02/UniswapV2Router02.abi'
