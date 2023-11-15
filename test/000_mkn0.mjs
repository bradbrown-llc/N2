// GOAL: start a chain, wait 5 seconds, stop the process (should stop the chain)

import { mkn0, sleep, Signer, config } from './B0.mjs'

let s0 = new Signer(config.roots[0].secret)

let n1_0 = await mkn0({ id: 0, bin: 'geth-linux-amd64-1.10.26-e5eb32ac', verbosity: 5, mining: true, maxpeers: 2 })
let n1_1 = await mkn0({ id: 1, bin: 'geth-linux-amd64-1.10.26-e5eb32ac', verbosity: 5, mining: false, genesispath: `${n1_0.datadir}/genesis.json`, bootnode: n1_0.enode, maxpeers: 1 })

n1_0.signers.add(s0)

console.log(n1_0)


// await n1_0.order()

// console.log(await n1_0.getBlockByNumber(0n))
// console.log(await n1_1.getBlockByNumber(0n))

// (async () => {
//     while (true) {
//         console.log(`n1_0 block number`, await n1_0.blockNumber)
//         console.log(`n1_1 block number`, await n1_1.blockNumber)
//         await new Promise(r => setTimeout(r, 100))
//     }
// })()

// console.log('###', await n1_0.getBalance(s0.address), s0.address)

for (let i = 0; i < 5; i++) {
    await n1_0.order()
    // with geth version 1.10.26, sleep can be below 1000, or we can even omit sleep altogether
    await sleep(1000)
}

await sleep(5000)

process.exit()