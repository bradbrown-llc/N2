import { mkn1, Signer, config, Pact, sleep } from './B0.mjs'
import { assemble } from './B1.mjs'
let n = await mkn1({ bin: 'geth-linux-amd64-1.10.26-e5eb32ac' })
await sleep(5000)
let s0 = new Signer(config.roots[0].secret), s1 = new Signer(process.env.GTMN_Test_secret)
let Upgradeable = new Pact({ n, ...await assemble({ name: 'UPGRADEABLE', options: { NOPUSH0: true } }) })
n.signers.add(s0)
let startGas = await Upgradeable.estimateGas.deploy.catch(e => { throw e })
let gasPrice = await n.gasPrice.catch(e => { throw e })
console.log(await n.order({ to: s1.address, value: startGas * gasPrice * 110n / 100n }).catch(e => { throw e }))
n.signers.delete(s0)
n.signers.add(s1);
(await n.script(async function() {
    let contract = new Pact({ ...Upgradeable, n: this })
    let receipt = await contract.deploy.catch(e => { throw e })
    var word = await contract.slot(0n).catch(e => { throw e })
    return [receipt, word]
})).map(x => console.dir(x, { depth: Infinity }))
process.exit()

/*import { mkn2, Signer, config, Pact, sleep } from './B0.mjs'
import { assemble } from './B1.mjs'
let n = await mkn2({ bin: 'geth-linux-amd64-1.10.26-e5eb32ac' })
let s = new Signer(config.roots[0].secret)
n.signers.add(s)
let Upgradeable = new Pact({ n, ...await assemble({ name: 'UPGRADEABLE', options: { NOPUSH0: true } }) })
await n.n1s[0].order(); await n.n1s[0].order(); await n.n1s[1].order()
console.log(await Upgradeable.data.deploy)
console.log(await Upgradeable.estimateGas.deploy)
console.dir(await Upgradeable.deploy, { depth: Infinity })
while ((await Promise.all(n.n1s.map(async (n1, i) => await Promise.all(n1.n0s.map(n0 => n0.getCode(Upgradeable.address[i])))))).flat().includes('0x')) await sleep(100)
console.log(await n.getStorageAt(Upgradeable.address, 0n))
process.exit()*/


