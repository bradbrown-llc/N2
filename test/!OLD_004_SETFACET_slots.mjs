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

let receipt = await upgradeable.SETFACET([proxyErc20])
let { data } = receipt.logs[0]
data = data.slice(2)
data = data.match(/../g)
let addressCount = parseInt(`0x${data[0]}`)
for (let i = 0, c1 = 1 + addressCount - 1, c2 = 1 + addressCount; i < addressCount; i++, c1--) {
    let selectorCount = parseInt(`0x${data[c1]}`)
    let selectors = data.slice(c2, c2 += 4 * selectorCount).join('').match(/.{8}/g)
    for (let selector of selectors) {
        console.log(selector, await n0.getStorageAt(upgradeable.address, BigInt(`0x${selector}`)))
    }
}

// 00000000000000000000010bf2e246bb76df876cef8b38ae84130f4f55de395b
// console.log(await upgradeable.slot(0n))
// versus
// console.log(await n0.getStorageAt(upgradeable.address, 32n))

process.exit()