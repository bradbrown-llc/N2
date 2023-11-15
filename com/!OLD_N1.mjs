import { Mon, encode, txHashReceipt, bytesToHex, keccak256 } from './B0.mjs'

let B = BigInt, S = String, O = Object, l = 'latest'
// o = tx object, a = address, b => bigint, h => hash, d => data

// N1 instance, contains N0s and signers and bindings to json rpc calls
// for now, calls are sent to first N0 only (does not use multiple N0s, but can be updated to, later)
export default class N1 {
    constructor(n0s) {
        this.n0s = n0s
        this.signers = new Set()
        this.mon = new Mon(this)
    }
    async send(tx={}) {
        try {
            let signer = [...this.signers][0]
            if (signer === undefined) throw new Error('cannot send: no signers assigned to this N1')
            tx.from = signer.address
            // console.log(JSON.stringify(tx))
            let { to, value, data } = tx
            let startGas = await this.estimateGas(tx).catch(e => {})
            let nonce = await this.getTransactionCount(signer.address)
            let gasPrice = await this.gasPrice
            console.log(startGas)
            let chainId = await this.chainId
            let rawTxArray = [nonce, gasPrice, startGas, to, value, data, chainId, 0, 0]
            let rawTxEncode = encode(rawTxArray)
            let rawTxHash = keccak256(rawTxEncode)
            let { r, s, recovery: v } = await signer.sign(rawTxHash)
            v = chainId * 2n + 35n + BigInt(v)
            let signedTxArray = [...rawTxArray.slice(0, 6), v, r, s]
            let signedTxEthHex = `0x${bytesToHex(encode(signedTxArray))}`
            let signedTxEthHash = `0x${keccak256(encode(signedTxArray))}`
            this.sendRawTransaction(signedTxEthHex)
            return signedTxEthHash
        } catch(e) { console.log('foo') }
    }
    async order(tx) {
        let hash = await this.send(tx)
        let receipt = await txHashReceipt(this, hash)
        return receipt
    }
    async deploy(bytecode) { return this.order({ data: bytecode }) }
    async #call(...args) { return await this.n0s[0].call(...args) }
    get blockNumber() { return this.#call('eth_blockNumber', [], B) }
    get chainId() { return this.#call('eth_chainId', [], B) }
    get gasPrice() { return this.#call('eth_gasPrice', [], B) }
    call(o, t=l) { console.log(JSON.stringify(o)); return this.#call('eth_call', [o, t], S) }
    estimateGas(o, t=l) { return this.#call('eth_estimateGas', [o, t], B) }
    getBalance(a, t=l) { return this.#call('eth_getBalance', [a, t], B) }
    getCode(a, t=l) { return this.#call('eth_getCode', [a, t], S) }
    getLogs(o) { return this.#call('eth_getLogs', [o], O)}
    getStorageAt(a, s, t=l) { return this.#call('eth_getStorageAt', [a, s, t], S) }
    getTransactionCount (a, t=l) { return this.#call('eth_getTransactionCount', [a, t], B) }
    getTransactionReceipt(h) { return this.#call('eth_getTransactionReceipt', [h], O) }
    sendRawTransaction (d) { return this.#call('eth_sendRawTransaction' , [d], S) }
}