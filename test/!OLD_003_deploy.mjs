// GOAL: wait for user input, then deploy UPGRADEABLE
// GOAL: log storage at slot 0 of new pact
// GOAL: log code of new pact
// we can go into N1.send and log the tx if it fails
// then use that tx in a geth attach to debug it
// like debug.traceCall(tx, 'latest')

import { readFile } from './B1.mjs'
import { mkn1, Signer, config, txHashReceipt } from './B0.mjs'

let bytecode = await readFile(`${process.env.N2_PATH}/pact/UPGRADEABLE/UPGRADEABLE.byt`, 'utf8')
let n1 = await mkn1(/*true*/)
let signer = new Signer(config.root.secret)
n1.signers.add(signer)
// let hash = await deploy(n1, bytecode)
// let receipt = await txHashReceipt(n1, hash)
// let { contractAddress: address } = receipt
// console.dir(receipt, { depth: Infinity })
console.log(await n1.deploy(bytecode))
// console.log(await n1.getCode(address))
// console.log(await n1.getStorageAt(address, 0n))

process.exit()