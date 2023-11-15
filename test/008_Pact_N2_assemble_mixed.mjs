import { mkn1, N2, Signer, config, Pact, sleep } from './B0.mjs'
let n2 = new N2([
    await mkn1({ bin: 'geth-linux-amd64-1.11.0-18b641b0' }), 
    await mkn1({ bin: 'geth-linux-amd64-1.11.0-18b641b0' }), 
    await mkn1({ bin: 'geth-linux-amd64-1.10.26-e5eb32ac' })
])
await sleep(1000)
let s0 = new Signer(config.roots[0].secret), s1 = new Signer(process.env.GTMN_Test_secret)
let Upgradeable = new Pact({ n: n2, name: 'UPGRADEABLE', coderType: 'assemble' })
n2.signers.add(s0)
console.log(await n2.PUSH0)
console.log(await Upgradeable.estimateGas.deploy)
console.log(await Upgradeable.data.deploy)
console.log(await Upgradeable.deploy)

// console.log(await Upgradeable.estimateGas.deploy)
// console.dir(await Upgradeable.estimateGas.deploy, { depth: Infinity })
// let gasPrice = await n.gasPrice.catch(e => { throw e })
// console.log(startGas, gasPrice)
// console.dir(await n.order({ to: s1.address, value: startGas * gasPrice * 110n / 100n }).catch(e => { throw e }), { depth: Infinity })
// n.signers.delete(s0)
// n.signers.add(s1)
// console.dir(await Upgradeable.deploy.catch(e => { throw e }), { depth: Infinity })
// let word = await Upgradeable.slot(0n).catch(e => { throw e })
// console.log(word)
// process.exit()

// import { N0, N1, N2, Signer, config, Pact } from './B0.mjs'
// let n2_urls = [
//     ["https://polygon-mumbai.blockpi.network/v1/rpc/public", "https://rpc.ankr.com/polygon_mumbai", "https://gateway.tenderly.co/public/polygon-mumbai", "https://polygon-testnet.public.blastapi.io", "https://polygon-mumbai-pokt.nodies.app", "https://endpoints.omniatech.io/v1/matic/mumbai/public", "https://rpc-mumbai.maticvigil.com", "https://api.zan.top/node/v1/polygon/mumbai/public", "https://polygon-mumbai-bor.publicnode.com", "https://polygon-mumbai.gateway.tenderly.co", "https://polygon-mumbai.g.alchemy.com/v2/demo", "https://polygontestapi.terminet.io/rpc"],
//     ["https://fantom-testnet.publicnode.com", "https://rpc.testnet.fantom.network", "https://fantom-testnet.public.blastapi.io", "https://endpoints.omniatech.io/v1/fantom/testnet/public", "https://rpc.ankr.com/fantom_testnet", "https://fantom.api.onfinality.io/public"],
// ]
// let n2 = new N2(n2_urls.map(n1_urls => new N1(n1_urls.map(url => new N0({ url })))))
// let s0 = new Signer(config.roots[0].secret)
// let Upgradeable = new Pact({ n: n2, name: 'UPGRADEABLE', coderType: 'assemble' })
// n2.signers.add(s0)
// console.log(await n2.n1s[0].PUSH0)

// console.log(await Upgradeable.estimateGas.deploy)
/*, s1 = new Signer(process.env.GTMN_Test_secret)*/
// console.dir(await Upgradeable.estimateGas.deploy, { depth: Infinity })
// let gasPrice = await n.gasPrice.catch(e => { throw e })
// console.log(startGas, gasPrice)
// console.dir(await n.order({ to: s1.address, value: startGas * gasPrice * 110n / 100n }).catch(e => { throw e }), { depth: Infinity })
// n.signers.delete(s0)
// n.signers.add(s1)
// console.dir(await Upgradeable.deploy.catch(e => { throw e }), { depth: Infinity })
// let word = await Upgradeable.slot(0n).catch(e => { throw e })
// console.log(word)
// process.exit()