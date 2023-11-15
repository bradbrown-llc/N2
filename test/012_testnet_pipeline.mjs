import { N0, N1, N2, Signer, config, Pact } from './B0.mjs'
let n2_urls = [
    ["https://eth-sepolia-public.unifra.io", "https://ethereum-sepolia.publicnode.com", "https://gateway.tenderly.co/public/sepolia", "https://ethereum-sepolia.blockpi.network/v1/rpc/public", "https://1rpc.io/sepolia", "https://eth-sepolia.public.blastapi.io", "https://rpc.notadegen.com/eth/sepolia", "https://endpoints.omniatech.io/v1/eth/sepolia/public", "https://api.zan.top/node/v1/eth/sepolia/public", "https://rpc.sepolia.org", "https://rpc-sepolia.rockx.com", "https://dapps.shardeum.org", "https://rpc.sepolia.ethpandaops.io", "https://rpc2.sepolia.org", "https://sphinx.shardeum.org", "https://sepolia.gateway.tenderly.co", "https://eth-sepolia.g.alchemy.com/v2/demo"],
    ["https://polygon-mumbai.blockpi.network/v1/rpc/public", "https://rpc.ankr.com/polygon_mumbai", "https://gateway.tenderly.co/public/polygon-mumbai", "https://polygon-testnet.public.blastapi.io", "https://polygon-mumbai-pokt.nodies.app", "https://endpoints.omniatech.io/v1/matic/mumbai/public", "https://rpc-mumbai.maticvigil.com", "https://api.zan.top/node/v1/polygon/mumbai/public", "https://polygon-mumbai-bor.publicnode.com", "https://polygon-mumbai.gateway.tenderly.co", "https://polygon-mumbai.g.alchemy.com/v2/demo", "https://polygontestapi.terminet.io/rpc"],
    ["https://fantom-testnet.publicnode.com", "https://rpc.testnet.fantom.network", "https://fantom-testnet.public.blastapi.io", "https://endpoints.omniatech.io/v1/fantom/testnet/public", "https://rpc.ankr.com/fantom_testnet", "https://fantom.api.onfinality.io/public"],
]
let n2 = new N2(n2_urls.map(n1_urls => new N1(n1_urls.map(url => new N0({ url })))))
let s0 = new Signer(config.roots[0].secret), s1 = new Signer(process.env.GTMN_Test_secret)
let Upgradeable = new Pact({ n: n2, name: 'UPGRADEABLE', coderType: 'assemble' })
n2.signers.add(s1)
console.dir(await n2.PUSH0, { depth: Infinity })
let gasEstimate = await Upgradeable.estimateGas.deploy
console.dir(gasEstimate, { depth: Infinity })
console.dir(await Upgradeable.data.deploy, { depth: Infinity })
let gasPrice = await n2.gasPrice
console.dir(gasPrice)
let balance = await n2.getBalance(s1.address)
console.log(n2.n1s.map((_, i) => gasEstimate[i].value * gasPrice[i].value))
console.log(s1.address, balance.map(b => b.value))
console.log(s1.address, n2.n1s.map((_, i) => balance[i].value - gasEstimate[i].value * gasPrice[i].value))
console.log(s1.address, await n2.getTransactionCount(s1.address))
console.log(await Upgradeable.deploy([{ nonce: 0n }, { nonce: 0n }, { nonce: 0n }]))
