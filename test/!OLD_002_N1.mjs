// GOAL: send nothing nowhere once a second for five seconds

import { mkn0, N1, Signer, config } from './B0.mjs'

let n0 = await mkn0(/*{ version: 'geth-linux-amd64-1.10.26-e5eb32ac', verbose: true }*/)
let n1 = new N1([n0])

let signer = new Signer(config.root.secret)
n1.signers.add(signer)
console.log(n1)

process.exit()