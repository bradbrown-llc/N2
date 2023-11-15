import { N0 } from 'N2'
let n = new N0('https://rpcapi.fantom.network')
console.log(await n.chainId)