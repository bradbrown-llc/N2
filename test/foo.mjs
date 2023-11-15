import { Signer, N0, N1, N2 } from './B0.mjs'
import { readFile } from './B1.mjs'

let signer = new Signer('0000000000000000000000000000000000000000000000000000000000000001')
let n2_urls = JSON.parse(await readFile(`../lib/main_nodes.json`)).slice(0, 10)
let n2 = new N2(n2_urls.map(n1_urls => new N1(n1_urls.map(url => new N0({ url })))))
console.dir(await n2.getTransactionCount(signer.address), { depth: Infinity })
console.dir(await n2.getBalance(signer.address), { depth: Infinity })