// GOAL: change the owner of an upgradeable pact
// GOAL: verify new owner is logged on deployment and on CHGOWN
// GOAL: log storage at slot 0 of new pact, verify it is new owner
// GOAL: verify that non-owners get a revert when trying to CHGOWN

import { readFile } from './B1.mjs'
import { mkn1, Signer, config, deploy, txHashReceipt } from './B0.mjs'

let bytecode = await readFile(`${process.env.N2_PATH}/pact/UPGRADEABLE/UPGRADEABLE.byt`, 'utf8')
let signer = new Signer(config.root.secret)

let n1 = await mkn1(/*true*/)
n1.signers.add(signer)
let deployHash = await deploy(n1, bytecode)
let deployReceipt = await txHashReceipt(n1, deployHash)
console.dir(deployReceipt, { depth: Infinity })
let { contractAddress: address } = deployReceipt
console.log(await n1.getCode(address))
let newOwner = '1111111111111111111111111111111111111111'
let chgownHash = await n1.send({ to: address, data: `0x000000000000000000000000000000000000000000000000000000000000000001${newOwner}` })
let chgownReceipt = await txHashReceipt(n1, chgownHash)
console.dir(chgownReceipt, { depth: Infinity })
console.log(await n1.getStorageAt(address, 0n))
let newOwner2 = '2222222222222222222222222222222222222222'
let chgownHash2 = await n1.send({ to: address, data: `0x000000000000000000000000000000000000000000000000000000000000000001${newOwner2}` })
let chgownReceipt2 = await txHashReceipt(n1, chgownHash2)
console.log(chgownReceipt2)
console.log(await n1.getStorageAt(address, 0n))

process.exit()