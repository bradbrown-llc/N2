// GOAL: start a chain, wait 5 seconds, stop the process (should stop the chain)

import { mkn0, Signer, config, Pact } from './B0.mjs'
import { assemble } from './B1.mjs'
let n = await mkn0({ bin: 'geth-linux-amd64-1.10.26-e5eb32ac', mining: true })
let s = new Signer(config.roots[0].secret)
n.signers.add(s)
let Upgradeable = new Pact({ n, ...await assemble({ name: 'UPGRADEABLE', options: { NOPUSH0: true } }) })
console.log(await Upgradeable.data.deploy)
console.log(await Upgradeable.estimateGas.deploy)
console.dir(await n.script(async function() {
    let contract = new Pact({ ...Upgradeable, n: this })
    await contract.deploy
    return contract.slot(0n)
}))
process.exit()