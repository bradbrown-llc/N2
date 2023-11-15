import { N0, sleep } from './B0.mjs'
let n0 = new N0({ url: 'https://rpc.ankr.com/polygon' })
while (true) { console.log(await n0.blockNumber); await sleep(1000) }