// An N1 instance, commonly known as a 'EVM', 'Chain', or 'Network'. Many N1's comprise an N2. Call it a 'supernetwork' or 'superchain'.
// Sending commands to an N1 consumes more bandwidth than to an N0, but provides increased decentralization. In order to prevent your command from being evaluated,
// one must control all N0s comprising the N1.

// import { Mon } from './B0.mjs'

let l = 'latest'

export default class N1 {

    constructor(n0s) {
        this.n0s = n0s
        this.signers = {
            add: signer => this.n0s.forEach(n0 => n0.signers.add(signer)),
            delete: signer => this.n0s.forEach(n0 => n0.signers.delete(signer))
        }
    }
    
    order(tx) { return Promise.any(this.n0s.map(async n0 => n0.order(tx))) }
    script(fn) { return Promise.any(this.n0s.map(n0 => n0.script(fn))) }
    deploy(bytecode) { return Promise.any(this.n0s.map(n0 => n0.deploy(bytecode))) }
    get blockNumber() { return Promise.any(this.n0s.map(n0 => n0.blockNumber)) }
    get chainId() { return Promise.any(this.n0s.map(n0 => n0.chainId)) }
    get PUSH0() { return Promise.any(this.n0s.map(n0 => n0.PUSH0)) }
    get gasPrice() { return Promise.any(this.n0s.map(n0 => n0.gasPrice)) }
    get clientVersion() { return Promise.any(this.n0s.map(n0 => n0.clientVersion)) }
    call(o, t=l) { return Promise.any(this.n0s.map(n0 => n0.call(o, t))) }
    estimateGas(o, t=l) { return Promise.any(this.n0s.map(n0 => n0.estimateGas(o, t))) }
    getBalance(a, t=l) { return Promise.any(this.n0s.map(n0 => n0.getBalance(a, t))) }
    getCode(a, t=l) { return Promise.any(this.n0s.map(n0 => n0.getCode(a, t))) }
    getLogs(o) { return Promise.any(this.n0s.map(n0 => n0.getLogs(o))) }
    getStorageAt(a, s, t=l) { return Promise.any(this.n0s.map(n0 => n0.getStorageAt(a, s, t))) }
    getTransactionCount(a, t=l) { return Promise.any(this.n0s.map(n0 => n0.getTransactionCount(a, t))) }
    getTransactionReceipt(h) { return Promise.any(this.n0s.map(n0 => n0.getTransactionReceipt(h))) }
    sendRawTransaction(d) { return Promise.any(this.n0s.map(n0 => n0.sendRawTransaction(d))) }
    send(tx={}) { return Promise.any(this.n0s.map(n0 => n0.send(tx))) }

}