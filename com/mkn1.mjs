import { mkn0, N1, sleep } from './B0.mjs'

let batchSize = 4
let batchInterval = 250

export default async ({ bin, verbosity, nodes=4, env, monper }) => {
    let n0s = []
    n0s.push(await mkn0({ id: 0, bin, verbosity, mining: true, maxpeers: nodes > 1 ? (nodes - 1) * 2 : 0, env, monper }))
    let nodeCount = 1
    while (nodeCount < nodes) {
        n0s.push(...await Promise.all(Array(Math.min(nodes - nodeCount, batchSize)).fill(0).map((_, i) => mkn0({ id: nodeCount + i, bin, verbosity, maxpeers: 2 * 2, genesispath: `${n0s[0].datadir}/genesis.json`, bootnode: n0s[0].enode, env, monper }))))
        nodeCount += batchSize
        await sleep(batchInterval)
    }
    return new N1(n0s)
}