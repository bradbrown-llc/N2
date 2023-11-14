import { mkn1, Signer, config, Pact, sleep } from './B0.mjs'
import { assemble } from './B1.mjs'
let n = await mkn1({ bin: 'geth-linux-amd64-1.10.26-e5eb32ac' });
let s = new Signer(config.roots[0].secret)
n.signers.add(s);

(async () => { while (true) { await n.order(); await sleep(100) } })();

(async () => {
    while (true) {
        let [n0, blockNumber] = await n.script(async function() { return [this, await this.blockNumber] })
        console.log(n.n0s.indexOf(n0), blockNumber)
        await sleep(100)
    }
})()

while (true) await sleep(1000)