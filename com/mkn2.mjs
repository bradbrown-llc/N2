import { mkn1, N2, sleep } from './B0.mjs'

let batchSize = 4
let batchInterval = 250

export default async ({ bin, verbosity, chains=3, nodes=4, env, monper }) => {
    let n1s = []
    let chainCount = 0
    while (chainCount < chains) {
        n1s.push(...await Promise.all(Array(Math.min(chains - chainCount, batchSize)).fill(0).map((_, i) => mkn1({ bin, nodes, verbosity, env, monper }))))
        chainCount += batchSize
        await sleep(batchInterval)
    }
    return new N2(n1s)
}