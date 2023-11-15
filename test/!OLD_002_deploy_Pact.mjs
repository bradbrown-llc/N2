// GOAL: wait for user input, then deploy UPGRADEABLE
// GOAL: log storage at slot 0 of new pact
// GOAL: log code of new pact
// we can go into N1.send and log the tx if it fails
// then use that tx in a geth attach to debug it
// like debug.traceCall(tx, 'latest')

import { assemble, compile } from './B1.mjs'
import { mkn0, Signer, config } from './B0.mjs'

let n0 = await mkn0({ verbose: false })
let signer = new Signer(config.root.secret)
n0.signers.add(signer)

let { bytecode: proxyErc20Bytecode, abi: proxyErc20Abi } = await compile({ cname: 'ProxyERC20', options: { NOPUSH0: true }})
let proxyErc20 = await n0.deploy({ bytecode: proxyErc20Bytecode, abi: proxyErc20Abi }).catch(e => { throw e instanceof Error ? e : JSON.stringify(e) })
let { bytecode: upgradeableBytecode, abi: upgradeableAbi } = await assemble({ cname: 'UPGRADEABLE', options: { NOPUSH0: true }})
let upgradeable = await n0.deploy({ bytecode: upgradeableBytecode, abi: upgradeableAbi }).catch(e => { throw e instanceof Error ? e : JSON.stringify(e) })

console.log(await upgradeable.data.SETFACET([proxyErc20]))
console.log(await upgradeable.estimateGas.SETFACET([proxyErc20]))
console.log(await upgradeable.SETFACET([proxyErc20]))

// {
//     let { bytecode, abi } = await compile({ cname: 'ProxyERC20', options: { NOPUSH0: true } })
//     let pact = await n0.deploy({ bytecode, abi }).catch(e => { throw e instanceof Error ? e : JSON.stringify(e) })
//     console.log(pact.address)
//     console.log(await pact.data.totalSupply)
//     console.log(await pact.estimateGas.totalSupply)
//     console.log(await pact.totalSupply)
//     console.log(await pact.data.balanceOf(signer.address))
//     console.log(await pact.estimateGas.balanceOf(signer.address))
//     console.log(await pact.balanceOf(signer.address))
// }

// {
//     // let { bytecode, abi } = await assemble({ cname: 'UPGRADEABLE', options: { NOPUSH0: true } })
//     // console.log(bytecode)
//     // let pact = await n0.deploy({ bytecode, abi }).catch(e => { throw e instanceof Error ? e : JSON.stringify(e) })
//     // console.log(pact.address)
//     // console.log(await pact.data.CHGOWN('0x111111111111111111111111111111111111111111111111'))
//     // console.log(await pact.estimateGas.CHGOWN('0x111111111111111111111111111111111111111111111111'))
//     // console.log(await pact.CHGOWN('0x111111111111111111111111111111111111111111111111'))
//     // console.log(await pact.data.SETFACET('foo'))
// }

process.exit()