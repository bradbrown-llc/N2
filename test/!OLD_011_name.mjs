// GOAL: validate balanceOf change from 009_transfer using balanceOf and abiDecode

import { compile } from './B1.mjs'
import { mkn1, Signer, config, abiEncode, abiDecode } from './B0.mjs'

let { bytecode, abi } = await compile('ERC20', { retBytecode: true, retAbi: true })
let n1 = await mkn1()
let signer = new Signer(config.root.secret)
n1.signers.add(signer)
let result = await n1.order({ data: bytecode })
console.dir(result, { depth: Infinity })
let { contractAddress: erc20Address } = result
console.log(await n1.call({ to: erc20Address, data: abiEncode(abi, 'symbol') }))
let name = abiDecode(abi, 'symbol', await n1.call({ to: erc20Address, data: abiEncode(abi, 'symbol') }))
console.log(name)

process.exit()