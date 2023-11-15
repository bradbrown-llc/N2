export default (abi, name, data) => {
    let cu = abi.filter(cu => cu.name == name)[0]
    let types = cu.outputs.map(output => output.type)
    if (types.length > 1) throw new Error('multiple return values not supported')
    let type = types[0]
    if (type.match('uint')) return BigInt(data)
    else if (type.match('string')) {
        data = data.slice(2).match(/.{64}/g)
        let offset = BigInt(`0x${data[0]}`) / 32n
        let length = BigInt(`0x${data[offset]}`)
        if (length > 32n) throw new Error(`string lengths (${length}) >32 not supported`)
        else return String.fromCharCode(...data[offset + 1n].slice(0, parseInt(length) * 2).match(/.{2}/g).map(hex => parseInt(`0x${hex}`)))
    } else if (type.match('address')) return `0x${data.slice(-40)}`
    else throw new Error(`return type ${type} not supported`)
}