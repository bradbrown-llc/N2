import { compile } from './B1.mjs'

let result = await compile('ERC20', { retBytecode: true, retAbi: true })
console.dir(result, { depth: Infinity })