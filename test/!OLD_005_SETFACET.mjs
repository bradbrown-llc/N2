// GOAL: set facet of an upgradeable pact
// GOAL: verify facet setting is logged
// GOAL: log storage at selector slot of new pact, verify it is new facet address (with hopefully acceptable selector garbage)
// GOAL: verify that non-owners get a revert when trying to SETFACET

import { readFile } from './B1.mjs'
import { mkn1, Signer, config, deploy, txHashReceipt } from './B0.mjs'

let bytecode = await readFile(`${process.env.N2_PATH}/pact/UPGRADEABLE/UPGRADEABLE.byt`, 'utf8')
let signer = new Signer(config.root.secret)

let n1 = await mkn1(/*true*/)
n1.signers.add(signer)

let deployHash = await deploy(n1, bytecode)
let deployReceipt = await txHashReceipt(n1, deployHash)
let { contractAddress: address } = deployReceipt
console.log(await n1.getCode(address))

let firstword = '0000000000000000000000000000000000000000000000000000000000000000'
let nextbyte = '00'
let instructions = {
    '0x1111111111111111111111111111111111111111': ['0xaaaaaaaa', '0xbbbbbbbb'],
    '0x2222222222222222222222222222222222222222': ['0xcccccccc'],
    '0x3333333333333333333333333333333333333333': ['0xdddddddd', '0xeeeeeeee', '0xffffffff']
}
let payload =
    `${
        Object.keys(instructions).length.toString(16).padStart(2, '0')
    }${
        Object.values(instructions).map(selectors => selectors.length.toString(16).padStart(2, '0')).reverse().join('')
    }${
        Object.entries(instructions).map(([addr, selectors]) => `${addr.slice(2)}${selectors.map(selector => selector.slice(2)).join('')}`).join('')
    }`
let setfacetHash = await n1.send({ to: address, data: `0x${firstword}${nextbyte}${payload}` })
let setfacetReceipt = await txHashReceipt(n1, setfacetHash)
console.dir(setfacetReceipt, { depth: Infinity })