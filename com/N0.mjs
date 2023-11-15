// An N0 instance, commonly known as a 'Node'. Many N0's comprise an N1, commonly known as an 'EVM', 'Chain', or 'Network'.
// Sending commands to an N0 is fast and low-bandwidth, at the cost of being the most centralized layer. Whoever controls the target N0 controls whether or not your command is evaluated.

import { Mon, JsonRpc, encode, keccak256, bytesToHex, txHashReceipt, Pact, sleep } from './B0.mjs'

let B = BigInt, S = String, O = Object, l = 'latest'

export default class N0 {

    constructor({ url, enode, datadir, tag, monper, env }={}) {
        this.tag = tag
        this.datadir = datadir
        this.url = url
        this.enode = enode
        this.mon = new Mon({ n0: this, period: monper ?? 1000 })
        this.env = env
        this.signers = new Set()
    }
    
    async post(method, params, cast) {
        let result = await JsonRpc.post(this.url, method, params).catch(e => { throw e })
        return cast(result)
    }
    
    async order(tx) {
        let hash = await this.send(tx).catch(e => { throw e })
        let receipt = await txHashReceipt(this, hash).catch(e => { throw e })
        return receipt
    }
    
    script(fn) { return fn.bind(this)() }
    
    async deploy({ bytecode, abi }={}) {
        let receipt = await this.order({ data: bytecode }).catch(e => { throw e })
        return new Pact({ abi, bytecode, n: this, receipt })
    }
    
    get blockNumber() { return this.post('eth_blockNumber', [], B) }
    get gasPrice() { return this.post('eth_gasPrice', [], B) }
    get clientVersion() { return this.post('web3_clientVersion', [], S) }
    get chainId() { return this.post('eth_chainId', [], B) }
    get PUSH0() { return this.estimateGas({ data: '0x5F' }).then(_ => true).catch(e => { if (`${e}`.match('invalid opcode')) return false; else throw e }) }
    call(o, t=l) { o.from = this.signers.values().next().value?.address; return this.post('eth_call', [o, t], S) }
    estimateGas(o, t=l) { o.from = this.signers.values().next().value?.address; return this.post('eth_estimateGas', [o, t], B) }
    getBalance(a, t=l) { return this.post('eth_getBalance', [a, t], B) }
    getBlockByNumber(n) { return this.post('eth_getBlockByNumber', [n, true], O) }
    getCode(a, t=l) { return this.post('eth_getCode', [a, t], S) }
    getLogs(o) { return this.post('eth_getLogs', [o], O)}
    getStorageAt(a, s, t=l) { return this.post('eth_getStorageAt', [a, s, t], S) }
    getTransactionCount(a, t=l) { return this.post('eth_getTransactionCount', [a, t], B) }
    getTransactionReceipt(h) { return this.post('eth_getTransactionReceipt', [h], O) }
    sendRawTransaction (d) { return this.post('eth_sendRawTransaction', [d], S) }
    
    async send(tx={}) {
        let signer = this.signers.values().next().value
        if (signer === undefined) throw new Error('cannot send: no signers assigned to this N0')
        tx.from = signer.address
        let { to, value, data, nonce } = tx
        let startGas = await this.estimateGas(tx).catch(e => { throw e })
        if (nonce === undefined) nonce = await this.getTransactionCount(signer.address).catch(e => { throw e })
        let gasPrice = await this.gasPrice.catch(e => { throw e })
        let chainId = await this.chainId.catch(e => { throw e })
        let rawTxArray = [nonce, gasPrice, startGas, to, value, data, chainId, 0, 0]
        let rawTxEncode = encode(rawTxArray)
        let rawTxHash = keccak256(rawTxEncode)
        let { r, s, recovery: v } = await signer.sign(rawTxHash)
        v = chainId * 2n + 35n + BigInt(v)
        let signedTxArray = [...rawTxArray.slice(0, 6), v, r, s]
        let signedTxEthHex = `0x${bytesToHex(encode(signedTxArray))}`
        // let signedTxEthHash = `0x${keccak256(encode(signedTxArray))}`
        let signedTxEthHash = await this.sendRawTransaction(signedTxEthHex).catch(e => { throw e })
        return signedTxEthHash
    }
    
}