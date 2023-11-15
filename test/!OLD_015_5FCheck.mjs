import { N0, N1, N2 } from './B0.mjs'

let n2_urls = [
    ["https://eth-sepolia-public.unifra.io", "https://ethereum-sepolia.publicnode.com", "https://gateway.tenderly.co/public/sepolia", "https://ethereum-sepolia.blockpi.network/v1/rpc/public", "https://1rpc.io/sepolia", "https://eth-sepolia.public.blastapi.io", "https://rpc.notadegen.com/eth/sepolia", "https://endpoints.omniatech.io/v1/eth/sepolia/public", "https://api.zan.top/node/v1/eth/sepolia/public", "https://rpc.sepolia.org", "https://rpc-sepolia.rockx.com", "https://dapps.shardeum.org", "https://rpc.sepolia.ethpandaops.io", "https://rpc2.sepolia.org", "https://sphinx.shardeum.org", "https://sepolia.gateway.tenderly.co", "https://eth-sepolia.g.alchemy.com/v2/demo"],
    ["https://polygon-mumbai.blockpi.network/v1/rpc/public", "https://rpc.ankr.com/polygon_mumbai", "https://gateway.tenderly.co/public/polygon-mumbai", "https://polygon-testnet.public.blastapi.io", "https://polygon-mumbai-pokt.nodies.app", "https://endpoints.omniatech.io/v1/matic/mumbai/public", "https://rpc-mumbai.maticvigil.com", "https://api.zan.top/node/v1/polygon/mumbai/public", "https://polygon-mumbai-bor.publicnode.com", "https://polygon-mumbai.gateway.tenderly.co", "https://polygon-mumbai.g.alchemy.com/v2/demo", "https://polygontestapi.terminet.io/rpc"],
    ["https://fantom-testnet.publicnode.com", "https://rpc.testnet.fantom.network", "https://fantom-testnet.public.blastapi.io", "https://endpoints.omniatech.io/v1/fantom/testnet/public", "https://rpc.ankr.com/fantom_testnet", "https://fantom.api.onfinality.io/public"],
]
let n2 = new N2(n2_urls.map(n1_urls => new N1(n1_urls.map(url => new N0({ url })))))
console.log(await n2.PUSH0)
