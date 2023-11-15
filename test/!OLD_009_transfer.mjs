// GOAL: deploy ERC20 and transfer
// GOAL: use abiEncode for transfer payload
// GOAL: use library compile for ERC20 bytecode
// validate using logs from txReceipts

import { compile } from './B1.mjs'
import { mkn1, Signer, config, deploy, txHashReceipt, abiEncode } from './B0.mjs'

let { bytecode, abi } = await compile('ERC20', { retBytecode: true, retAbi: true })
let n1 = await mkn1()
let signer = new Signer(config.root.secret)
n1.signers.add(signer)
let deployHash = await deploy(n1, bytecode)
let deployReceipt = await txHashReceipt(n1, deployHash)
let { contractAddress: erc20Address } = deployReceipt
console.dir(deployReceipt, { depth: Infinity })
let tx = { to: erc20Address, data: abiEncode(abi, 'transfer', '0x1111111111111111111111111111111111111111', 1234567890n) }
let transferHash = await n1.send(tx)
let transferReceipt = await txHashReceipt(n1, transferHash)
console.dir(transferReceipt, { depth: Infinity })

process.exit()