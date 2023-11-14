import { abiEncode as defaultEncoder, abiDecode as defaultDecoder, N1, N2 } from './B0.mjs'

export default class Pact {
    constructor({ receipt, address, abi, bytecode, name, coderType, n }={}) {
        this.receipt = receipt
        this.address = address
        this.name = name
        this.coderType = coderType
        this.abi = abi ?? (async () => (await (await import(`${process.env.N2_PATH}/com/B1.mjs`))[coderType]({ name })).abi)()
        this.bytecode = bytecode ?? (async () => { let fn = async n => (await (await import(`${process.env.N2_PATH}/com/B1.mjs`))[coderType]({ name, PUSH0: await n.PUSH0 })).bytecode; return Promise.all(n?.n1s?.map?.(fn)) ?? fn(n) })()
        this.n = n
        this.slot = x => this.n.getStorageAt(this.address, x)
        if (receipt) this.address = receipt?.map(r => r.contractAddress) ?? receipt.contractAddress
        return new Proxy(this, {
            get(target, property, receiver) {
                if (property == 'then') return
                if (['receipt', 'address', 'abi', 'bytecode', 'n', 'name', 'coderType', 'slot'].includes(property)) return target[property]
                if (property == 'data') return new Proxy(receiver, { get(target, property) { return target['data_' + property] }})
                if (property == 'estimateGas') return new Proxy(receiver, { get(target, property) { return target['estimateGas_' + property] }})
                return (async() => {
                    let dataPrefix = !!property.match(/^data_/)
                    let estimateGasPrefix = !!property.match(/^estimateGas_/)
                    property = property.replace(/^(.+_)?/, '')
                    let [cu] = (property == 'deploy' ? (await target.abi)?.filter(cu => cu.type == 'constructor') : target.abi?.filter(cu => cu.type == 'function' && cu.name == property)) ?? []
                    if (!cu) { if (property == 'deploy') throw new Error('cannot deploy, abi doesn\'t contain constructor cu'); else return }
                    let { inputs, encoder, decoder, stateMutability: type } = cu
                    let fn = async (...args) => {
                        let isOverride = o => { let fn = o => Object.keys(o).map(k => ['nonce'].includes(k)).reduce((p, c) => p && c); return o?.map?.(fn).reduce((p, c) => p && c) ?? fn(o) }
                        let override = args.at(-1) && isOverride(args.at(-1)) ? args.splice(-1) : undefined
                        encoder = encoder ? (await import(encoder)).default : defaultEncoder
                        decoder = decoder ? (await import(decoder)).default : defaultDecoder
                        let data = encoder(await target.abi, property, ...args)
                        if (property == 'deploy') data = await (async () => { let fn = async b => `${await b}${data.slice(2)}`; return Promise.all((await target.bytecode)?.map?.(fn)) ?? fn(target.bytecode) })()
                        if (dataPrefix) return data
                        let tx = target.n.n1s?.map?.((_, i) => ({ to: target.address?.[i], data: data[i], ...override?.[i] })) ?? { to: target.address, data, override }
                        if (estimateGasPrefix) return n.estimateGas(tx)
                        let result = await n[type == 'view' ? 'call' : 'order'](tx).catch(e => { throw e })
                        if (property == 'deploy') { target.receipt = result; let fn = r => r.contractAddress; target.address = result?.map?.(fn) ?? fn(result) }
                        if (type == 'view') result = await (() => { let fn = async r => decoder(await target.abi, property, r); return result?.map?.(fn) ?? fn(result) })()
                        return result
                    }
                    return inputs.length || inputs === true ? fn : fn()
                })()
                
            }
        })
    }
}