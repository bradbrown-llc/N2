import { abiEncode as defaultEncoder, abiDecode as defaultDecoder } from './B0.mjs'
export default class Pact {
    constructor(options={}) {
        Object.assign(this, options)
        if (this.name && this.coderType) {
            let getCode = async ({ PUSH0 }={}) => (await import(`${process.env.N2_PATH}/com/B1.mjs`))[this.coderType]({ name: this.name, PUSH0 })
            this.abi = getCode().then(({ abi }) => abi)
            this.bytecode = x => getCode(x).then(({ bytecode }) => bytecode)
        }
        this.slot = x => this.n.getStorageAt(this.address, x)
        let handler = { get(target, property, receiver) {
            let v = Array(target.n?.n1s?.length ?? 1).fill(0)
            let w = target.n?.n1s ? 'slice' : 'pop'
            if (Object.keys(target).includes(property)) return target[property]
            if (['data', 'estimateGas'].includes(property)) return new Proxy(receiver, { get(target, property2) { return target[`${property2}|${property}`] } })
            var [property, modifier] = property.split('|')
            let fn = async (...args) => {
                let [cu] = (await target.abi)?.filter(cu => property == 'deploy' ? (cu.type == 'constructor') : (cu.type == 'function' && cu.name == property)) ?? []
                if (!cu) return
                let { stateMutability: type, encoder, decoder } = cu
                let overrideKeys = ['nonce']
                let isOverride = o => o instanceof Object && Object.keys(o).length && Object.keys(o).every(k => overrideKeys.includes(k))
                let override = args.at(-1) && [args.at(-1)].flat().every(isOverride) ? args.splice(-1).flat() : undefined
                encoder = encoder ? (await import(encoder)).default : defaultEncoder
                decoder = decoder ? (await import(decoder)).default : defaultDecoder
                let data = encoder(await target.abi, property, ...args)
                if (property == 'deploy') data = await Promise.all(v.map(async (_, i) => `${(await Promise.all([await target.n.PUSH0].flat().map(x => x?.value ?? x).map(PUSH0 => target.bytecode({ PUSH0 }))))[i]}${data.slice(2)}`))
                if (modifier == 'data') return [...data][w]()
                let address = [target.address].flat()
                let tx = v.map((_, i) => ({ to: address[i], data: data[i], ...override?.[i] }))
                if (modifier == 'estimateGas') return target.n.estimateGas([...tx][w]())
                let result = [await target.n[type == 'view' ? 'call' : 'order']([...tx][w]()).catch(e => { throw e })].flat().map(r => r?.value ?? r?.reason ?? r)
                if (property == 'deploy') { target.receipt = [...result][w](); target.address = [...result.map(r => r?.contractAddress ?? r)][w]() }
                if (type == 'view') result = Promise.all(result.map(async r => r instanceof Error ? r : decoder(await target.abi, property, r)))
                return [...result][w]()
            }
            fn.then = r => r(fn())
            return fn
        }}
        return new Proxy(this, handler)
    }
}