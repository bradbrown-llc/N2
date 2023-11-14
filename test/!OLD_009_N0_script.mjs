import { mkn0, Signer, config, Pact } from './B0.mjs'
import { assemble } from './B1.mjs'
let n = await mkn0({ bin: 'geth-linux-amd64-1.10.26-e5eb32ac', mining: true })

console.log(await n.script(async function() { return this }))