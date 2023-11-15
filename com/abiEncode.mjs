import { keccak256 } from './B0.mjs'

export default (abi, name, ...args) => {
    let v
    let [cu] = name == 'deploy' ? abi.filter(cu => cu.type == 'constructor') : abi.filter(cu => cu.name == name)
    let types = cu.inputs.map(input => input.type)
    let encodedArgs = args.map((arg, i) => {
        let type = types[i]
        if (type.match('uint')) {
            return `${arg.toString(16).padStart(64, '0')}`
        } else if (type.match('address')) {
            if (arg instanceof Array) {
                v = Array(arg.length).fill(0)
                return arg.map(a => `${a.slice(2).padStart(64, '0')}`)
            }
            return `${arg.slice(2).padStart(64, '0')}`
        } else throw new Error(`${type} not supported yet`)
    })
    let signature = `${name}(${types.join()})`
    let selector = keccak256(signature).slice(0, 8)
    if (v?.length) {
        encodedArgs = encodedArgs.map(a => [a].flat())
        return v.map((_, i) => `0x${name == 'deploy' ? '' : selector}${encodedArgs.map(a => a[i % a.length]).join('')}`)
    } else return `0x${name == 'deploy' ? '' : selector}${encodedArgs.join('')}`
}