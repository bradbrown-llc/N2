import { N0, N1, N2, sleep } from './B0.mjs'
let n2_urls = [
    ["https://eth.llamarpc.com", "https://core.gashawk.io/rpc", "https://rpc.ankr.com/eth", "https://mainnet.gateway.tenderly.co", "https://endpoints.omniatech.io/v1/eth/mainnet/public"],
    ["https://binance.llamarpc.com", "https://bsc-dataseed.bnbchain.org", "https://bsc-dataseed1.defibit.io", "https://bsc-dataseed3.defibit.io", "https://bsc-dataseed3.ninicoin.io"],
    ["https://arbitrum.llamarpc.com", "https://arbitrum.api.onfinality.io/public", "https://arbitrum-one.public.blastapi.io", "https://arbitrum.blockpi.network/v1/rpc/public", "https://arbitrum-one.publicnode.com"],
    ["https://polygon.llamarpc.com", "https://polygon-bor.publicnode.com", "https://polygon.rpc.blxrbdn.com", "https://rpc-mainnet.matic.quiknode.pro", "https://polygon-pokt.nodies.app"],
    ["https://optimism.llamarpc.com", "https://op-pokt.nodies.app", "https://optimism-mainnet.public.blastapi.io", "https://optimism.blockpi.network/v1/rpc/public", "https://optimism.publicnode.com"]
]
let n2 = new N2(n2_urls.map(n1_urls => new N1(n1_urls.map(url => new N0({ url })))))
while (true) { console.log(await n2.blockNumber); await sleep(5000) }