// GOAL: start a chain, wait 5 seconds, stop the process (should stop the chain)

import { mkn1, sleep, config, Signer } from './B0.mjs'

let n1 = await mkn1({ bin: 'geth-linux-amd64-1.10.26-e5eb32ac', nodes: 4/*, verbosity: 3*/ });

(async() => {
    while (true) {
        // we want the block number from the N1
        console.log(JSON.stringify(await Promise.all(n1.n0s.map(n0 => n0.blockNumber)), (_, v) => typeof v == 'bigint' ? ''+v : v).replace(/"/g, ''))
        console.log(await n1.blockNumber)
        await sleep(100)
    }
})()

// we want to add a signer to the N1 and order on the N1
// n1.n0s[0].signers.add(signer);
let signer = new Signer(config.roots[0].secret)
n1.signers.add(signer)
for (let i = 0; i < 100; i++) console.log(i, await n1.order())
// for (let i = 0; i < 100; i++) { await n1.n0s[0].order() }
await sleep(2000)
console.log('exiting process')
process.exit()