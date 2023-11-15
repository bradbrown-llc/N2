import assemble from '../com/assemble.mjs'
import contractDef from '../com/contractDef.mjs'

let { abi, bytecode } = await assemble('UPGRADEABLE')
await contractDef(abi, bytecode)
// let def = await contractDef(abi, bytecode)
// console.log(def.CHGOWN)