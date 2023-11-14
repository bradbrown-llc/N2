// An N2 instance. Call it a 'supernetwork' or 'superchain'.
// Sending commands to an N2 consumes the most bandwidth and state desyncs are practically guaranteed. However, this is the most decentralized (currently) way to issue a command.
// For one to prevent your command from being evaluated, one would need to control all N0s that comprise the N2.

let l = 'latest'

export default class N2 {

    constructor(n1s) {
        this.n1s = n1s
        this.signers = { add: signer => this.n1s.forEach(n1 => n1.signers.add(signer)) }
    }
    
    order(o) { return Promise.allSettled(this.n1s.map((n1, i) => n1.order(o instanceof Array ? o[i] : o))) }
    script(fn) { return Promise.allSettled(this.n1s.map(n1 => n1.script(fn))) }
    deploy(bytecode) { return Promise.allSettled(this.n1s.map(n1 => n1.deploy(bytecode))) }
    get blockNumber() { return Promise.allSettled(this.n1s.map(n1 => n1.blockNumber)) }
    get chainId() { return Promise.allSettled(this.n1s.map(n1 => n1.chainId)) }
    get PUSH0() { return Promise.allSettled(this.n1s.map(n1 => n1.PUSH0)) }
    get gasPrice() { return Promise.allSettled(this.n1s.map(n1 => n1.gasPrice)) }
    get clientVersion() { return Promise.allSettled(this.n1s.map(n1 => n1.clientVersion)) }
    call(o, t=l) { return Promise.allSettled(this.n1s.map((n1, i) => n1.call(o instanceof Array ? o[i] : o, t) )) }
    estimateGas(o, t=l) { return Promise.allSettled(this.n1s.map((n1, i) => n1.estimateGas(o instanceof Array ? o[i] : o, t))) }
    getBalance(a, t=l) { return Promise.allSettled(this.n1s.map(n1 => n1.getBalance(a, t))) }
    getCode(a, t=l) { return Promise.allSettled(this.n1s.map(n1 => n1.getCode(a, t))) }
    getLogs(o) { return Promise.allSettled(this.n1s.map((n1, i) => n1.getLogs(o instanceof Array ? o[i] : o))) }
    getStorageAt(a, s, t=l) { return Promise.allSettled(this.n1s.map((n1, i) => n1.getStorageAt(a instanceof Array ? a[i] : a, s, t))) }
    getTransactionCount(a, t=l) { return Promise.allSettled(this.n1s.map(n1 => n1.getTransactionCount(a, t))) }
    getTransactionReceipt(h) { return Promise.allSettled(this.n1s.map(n1 => n1.getTransactionReceipt(h))) }
    sendRawTransaction(d) { return Promise.allSettled(this.n1s.map(n1 => n1.sendRawTransaction(d))) }
    send(o={}) { return Promise.allSettled(this.n1s.map(n1 => n1.send(o))) }
    
}