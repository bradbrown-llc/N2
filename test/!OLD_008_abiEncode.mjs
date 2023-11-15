import { readFile } from './B1.mjs'
import { abiEncode } from './B0.mjs'

let abi = JSON.parse(await readFile(`${process.env.N2_PATH}/pact/ERC20/ERC20.abi`, 'utf8'))

let address = '0x1111111111111111111111111111111111111111'
let value = 3000000000n
console.log(abiEncode(abi, 'transfer', address, value))