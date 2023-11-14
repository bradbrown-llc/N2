import { keccak256 } from './B0.mjs'

export default async (_abi, _name, ...args) => {

    let [proxies] = args
    
    // coerce proxy 0's address property to array, then get its length
    let g = [proxies[0].address].flat().length
    
    // payload will be an array of the same length
    let payload = Array(g).fill('0x0000000000000000000000000000000000000000000000000000000000000000')
    
    // SETFACET op selector
    payload = payload.map(p => p+'00')
    
    // add proxy length byte
    payload = payload.map(p => p+proxies.length.toString(16).padStart(2, '0'))
    
    // add reversed proxy function length bytes
    payload = await Promise.all(payload.map(async p => p+(await Promise.all(proxies.map(async proxy => (await proxy.abi).filter(cu => cu.type == 'function').length.toString(16).padStart(2, '0')))).reverse().join('')))
    
    // add addresses and selectors
    payload = await Promise.all(payload.map(async (p, i) => p+(await Promise.all(proxies.map(async proxy => `${proxy.address[i].slice(2)}${(await proxy.abi).filter(cu => cu.type == 'function').map(cu => keccak256(`${cu.name}(${cu.inputs.map(input => input.type).join()})`).slice(0, 8)).join('')}`)))))
    
    return payload
    
}