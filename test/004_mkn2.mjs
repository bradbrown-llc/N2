// GOAL: start a chain, wait 5 seconds, stop the process (should stop the chain)
import { mkn2, sleep, Signer, config } from './B0.mjs'
let chains = 32
let n2 = await mkn2({ bin: 'geth-linux-amd64-1.10.26-e5eb32ac', chains, verbosity: 5 })
let signer = new Signer(config.roots[0].secret)
n2.signers.add(signer);
(async () => {
    while (true) {
        console.log(await n2.blockNumber)
        await sleep(1000)
    }
})()
for (let i = 0; i < 256; i++) await Promise.all(n2.n1s.slice(0, chains - (i % chains)).map(n1 => n1.order()))
await sleep(5000)
process.exit()