import mkn1 from '../com/mkn1.mjs'
import Signer from '../com/Signer.mjs'
import config from '../com/config.mjs'
import compile from '../com/compile.mjs'
import cdef from '../com/cdef.mjs'
import Pact from '../com/Pact.mjs'

let n1 = await mkn1()
let signer = new Signer(config.root.secret)
n1.signers.add(signer)
let { abi, bytecode } = await compile('ERC20')
let cdef = await cdef(abi, bytecode)
let ERC20 = await n1.deploy(cdef)
