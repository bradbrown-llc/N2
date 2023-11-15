// GOAL: wait for user input, then deploy UPGRADEABLE
// GOAL: log storage at slot 0 of new pact
// GOAL: log code of new pact
// we can go into N1.send and log the tx if it fails
// then use that tx in a geth attach to debug it
// like debug.traceCall(tx, 'latest')

import { assemble, compile } from './B1.mjs'
import { mkn0, Signer, config } from './B0.mjs'

let n0 = await mkn0({ verbose: false })
let owner = new Signer(config.root.secret)
n0.signers.add(owner)

let { bytecode: proxyErc20Bytecode, abi: proxyErc20Abi } = await compile({ cname: 'ProxyERC20', options: { NOPUSH0: true }})
let proxyErc20 = await n0.deploy({ bytecode: proxyErc20Bytecode, abi: proxyErc20Abi }).catch(e => { throw e instanceof Error ? e : JSON.stringify(e) })
let { bytecode: upgradeableBytecode, abi: upgradeableAbi } = await assemble({ cname: 'UPGRADEABLE', options: { NOPUSH0: true }})
let upgradeable = await n0.deploy({ bytecode: upgradeableBytecode, abi: upgradeableAbi }).catch(e => { throw e instanceof Error ? e : JSON.stringify(e) })

let nonowner = new Signer('0000000000000000000000000000000000000000000000000000000000000002')

console.log(await upgradeable.estimateGas.CHGOWN(nonowner.address))
console.log(await upgradeable.estimateGas.SETFACET([proxyErc20]))

n0.signers.delete(owner)
n0.signers.add(nonowner)

console.log(await upgradeable.estimateGas.CHGOWN(nonowner.address).catch(console.log))
console.log(await upgradeable.estimateGas.SETFACET([proxyErc20]).catch(console.log))

// console.log(await upgradeable.data.SETFACET([proxyErc20]))
// console.log(await upgradeable.estimateGas.SETFACET([proxyErc20]))
// console.log(await upgradeable.SETFACET([proxyErc20]))

process.exit()