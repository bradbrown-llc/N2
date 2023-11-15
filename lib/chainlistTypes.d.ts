type ChainlistBridge = {
    url: string
}

type ChainlistParent = {
    bridges: ChainlistBridge[]
    chain: string
    type: string
}

type ChainlistFeature = {
    name: string
}

type ChainlistEns = {
    registry: string
}

type ChainlistRpc = {
    url: string
    tracking?: string
    trackingDetails?: string
    isOpenSource?: boolean
}

type ChainlistCoin = {
    name: string
    symbol: string
    decimals: number
}

type ChainlistExplorer = {
    name: string
    url: string
    standard: string
    icon?:  string
}

type ChainlistChain = {
    chain: string
    chainId: number
    chainSlug: string
    ens?: ChainlistEns
    explorers: ChainlistExplorer[]
    faucets: string[]
    features?: ChainlistFeature[]
    icon: string
    name: string
    infoURL: string
    nativeCurrency: ChainlistCoin
    networkId: number
    parent?: ChainlistParent
    rpc: ChainlistRpc[]
    shortName: string
    title?: string
    slip44: number
    tvl?: number
}

type ChainlistDatum = {
    chains: ChainlistChain[]
}

type ChainlistData = ChainlistData[]

type ChainlistOptions = 
    { method: 'fetch', save?: boolean, at?: never, target?: never} |
    { method: 'read', save?: never, at?: never, target?: never} |
    { method: 'read', save?: never, at: number, target?: never} |
    { method: 'read', save?: never, at?: never, target: string}