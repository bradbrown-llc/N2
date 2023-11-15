import { getPublicKey, signAsync, keccak256 } from './B0.mjs'

// a signer instance, created by a secret
export default class Signer {

    constructor(secret) { this.secret = secret }

    // getter for the signer's address
    get address() { return `0x${keccak256(getPublicKey(this.secret, false).slice(1)).slice(-40)}` }
    
    // sign a hash, returns { r, s, recovery (v) }
    sign(hash) { return signAsync(hash, this.secret) }

}