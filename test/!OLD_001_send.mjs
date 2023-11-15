// GOAL: send nothing nowhere once a second for five seconds

import { mkn0, Signer, config, sleep } from './B0.mjs'

let n0 = await mkn0({ version: 'geth-linux-amd64-1.10.26-e5eb32ac'/*, verbose: true*/ })
let signer = new Signer(config.root.secret)
n0.signers.add(signer)

for (let i = 0; i < 100; i++) {
    console.log(await n0.send())
    // with geth version 1.10.26, sleep can be below 1000, or we can even omit sleep altogether
    // await sleep(1000)
}

process.exit()