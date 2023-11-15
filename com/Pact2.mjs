import { abiEncode as defaultEncoder, abiDecode as defaultDecoder, N2 } from './B0.mjs'

export default class Pact {
    constructor(options={}/*{ receipt, address, abi, bytecode, name, coderType, n }*/) {
        // assign options from options object to this
        Object.assign(this, options)
        // if options contain name and coderType, abi and bytecode are promises, with bytecode containing both PUSH0 and non-PUSH0 bytecode
        if (this.name && this.coderType) {
            // getCode executes the specified coder
            let getCode = async ({ PUSH0 }={}) => (await import(`${process.env.N2_PATH}/com/B1.mjs`))[this.coderType]({ name: this.name, PUSH0 })
            // foo is the promise to the abi, bar is the promise to the PUSH0 bytecode, baz is the promise to the non-PUSH0 bytecode
            let foo_resolver, foo = new Promise(r => foo_resolver = r)
            let bar_resolver, bar = new Promise(r => bar_resolver = r)
            let baz_resolver, baz = new Promise(r => baz_resolver = r)
            getCode({ PUSH0: true }).then(({ abi, bytecode }) => { foo_resolver(abi); bar_resolver(bytecode) } )
            getCode().then(({ bytecode }) => baz_resolver(bytecode))
            this.abi = foo
            this.bytecode = ({ PUSH0 }) => PUSH0 ? bar : baz
        }
        // shorthand function for getting a storage slot for this Pact
        this.slot = x => this.n.getStorageAt(this.address, x)
        // proxy handler
        let handler = { get(target, property, receiver) {
            // useful later, v:  an array of length == chains, w: the de-coercer type
            let v = Array(target.n?.n1s?.length ?? 1).fill(0)
            let w = target.n?.n1s ? 'slice' : 'pop'
            // if accessing an existing property of the Pact, return it
            if (Object.keys(target).includes(property)) return target[property]
            // voodoo, allows modifiers to contract interactions
            if (['data', 'estimateGas'].includes(property)) return new Proxy(receiver, { get(target, property2) { return target[`${property2}|${property}`] } })
            // at this point, property may have a modifier, this line isolates the property and modifier into separate variables
            var [property, modifier] = property.split('|')
            // enter an async context, we'll be having a lot of awaits
            let fn = async (...args) => {
                
                // grab the cu from the abi, if it exists
                let [cu] = (await target.abi)?.filter(cu => property == 'deploy' ? (cu.type == 'constructor') : (cu.type == 'function' && cu.name == property)) ?? []
                
                // if it doesn't, return undefined, extract props from the cu
                if (!cu) return
                let { stateMutability: type, encoder, decoder } = cu
                
                // list of keys to be found in override
                let overrideKeys = ['nonce', 'value']
                
                // naive override checker - true only if every object key is in overrideKeys
                let isOverride = o => o instanceof Object && Object.keys(o).length && Object.keys(o).every(k => overrideKeys.includes(k))
                
                // get override if it exists and is valid, then coerce it into an array (or undefined) and store as override
                let override = args.at(-1) && [args.at(-1)].flat().every(isOverride) ? args.splice(-1).flat() : undefined
                
                // load encoder and decoder
                encoder = encoder ? (await import(encoder)).default : defaultEncoder
                decoder = decoder ? (await import(decoder)).default : defaultDecoder
                
                // get data from encoder
                // coerce to array
                // if length is less than v, copy data to an array of length v
                let data = [await encoder(await target.abi, property, ...args)].flat()
                if (data.length < v.length) data = [...v].fill(data[0])
                
                // # if we're deploying, preface the data with the bytecode #
                // // if N2, returns array of PUSH0 support per blockchain, else returns PUSH0 support for blockchain
                // await target.n.PUSH0
                // // for any N, returns array of PUSH0 support per blockchain
                // [await target.n.PUSH0].flat().map(x => x?.value ?? x)
                // // returns bytecode if PUSH0 is supported
                // await target.bytecode({ PUSH0: true })
                // // returns an array of promises of bytecode per blockchain
                // [await target.n.PUSH0].flat().map(x => x?.value ?? x).map(PUSH0 => target.bytecode({ PUSH0 }))
                // returns an array of bytecode per blockchain
                // await Promise.all([await target.n.PUSH0].flat().map(x => x?.value ?? x).map(PUSH0 => target.bytecode({ PUSH0 })))
                // // data
                // data
                // // data coerced into an array
                // data = [data].flat()
                // // if property is deploy, map data to be `${b[i]}${d[i].slice(2)}` where b is the bytecode array
                // if (property == 'deploy') data = v.map(async (_, i) => `${b[i]}${d}`)
                // replace b bytecode array with above definition
                if (property == 'deploy') data = await Promise.all(v.map(async (_, i) => `${(await Promise.all([await target.n.PUSH0.catch(e => { throw e })].flat().map(x => x?.value ?? x).map(PUSH0 => target.bytecode({ PUSH0 }))).catch(e => { throw e }))[i]}${data[i].slice(2)}`)).catch(e => { throw e })
                
                // if we have the data modifier, return the data, remembering to de-coerce from array if appropriate
                if (modifier == 'data') return [...data][w]()
                
                // coerce address into array
                let address = [target.address].flat()
                
                // address, data, and override are now all coerced into an array
                // create an array of txs, using overrides if they exist
                let tx = v.map((_, i) => ({ to: address[i], data: data[i], ...override?.[i] }))
                
                // if we have the estimateGas modifier, return the estimateGas for de-coerced tx
                if (modifier == 'estimateGas') return target.n.estimateGas([...tx][w]()).catch(e => { throw e })
                
                // get result from executing the interaction, coerce to array, convert to values or reasons if N2
                let result = [await target.n[type == 'view' ? 'call' : 'order']([...tx][w]()).catch(e => { throw e })].flat().map(r => r?.value ?? r?.reason ?? r)
                
                // get receipt and address if interaction was a deployment, pollute receipt and contractAddress with errors if there were any
                if (property == 'deploy') { target.receipt = [...result][w](); target.address = [...result.map(r => r?.contractAddress ?? r)][w]() }
                
                // abiDecode result if contract interaction was of type view (remember to handle results that were errors!) 
                if (type == 'view') result = await Promise.all(result.map(async r => r instanceof Error ? r : decoder(await target.abi, property, r)))
                
                // return and de-coerce
                return [...result][w]()
                
            }
            // some voodoo here, we can return a function with a modified then to allow us to await it without parentheses, which acts like there's no args
            fn.then = r => r(fn())
            return fn
        }}
        return new Proxy(this, handler)
    }
}