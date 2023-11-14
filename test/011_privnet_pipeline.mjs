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
let gasEstimate = await Upgradeable.estimateGas.deploy
console.dir(gasEstimate, { depth: Infinity })
console.dir(await Upgradeable.data.deploy, { depth: Infinity })
let gasPrice = await n2.gasPrice
console.dir(gasPrice)
let balance = await n2.getBalance(s0.address)
console.log(n2.n1s.map((_, i) => gasEstimate[i].value * gasPrice[i].value))
console.log(s0.address, balance.map(b => b.value))
console.log(s0.address, n2.n1s.map((_, i) => balance[i].value - gasEstimate[i].value * gasPrice[i].value))
console.log(s0.address, await n2.getTransactionCount(s0.address))
console.log(await Upgradeable.deploy([{ nonce: 0n }, { nonce: 0n }, { nonce: 0n }]))
let ProxyERC20 = new Pact({ n: n2, name: 'ProxyERC20', coderType: 'compile' })
console.log(await ProxyERC20.deploy())