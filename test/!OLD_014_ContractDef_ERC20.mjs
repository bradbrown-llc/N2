import compile from '../com/compile.mjs'
import def from '../com/def.mjs'

let { abi, bytecode } = await compile('ERC20')
let def = def(abi, bytecode)
// console.log(def.transfer('0x1111111111111111111111111111111111111111', 1234567890n))
// console.log(def.name())
console.log(def)