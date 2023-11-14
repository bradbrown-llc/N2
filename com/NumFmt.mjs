let prefixes = ['q', 'r', 'y', 'z', 'a', 'f', 'p', 'n', 'μ', 'm', '', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'R', 'Q']

export let ntos = (big, options={}) => {
    let { decimals, length=4, maxExtra=Infinity } = options
    if (decimals === undefined) throw new Error('decimals undefined')
    if (length < 4) throw new Error(`ntos length ${length} invalid, must be >= 4`) 
    let s = ''+big
    // if 10^x represents our number, foo is 0 if x is -30
    let foo = s.length - decimals - 1 + 30
    // bar then represents the metric prefix to use by index, where 0 is 10^-30, or quecto (q)
    let bar = parseInt(foo / 3)
    // baz then represents the length of whole units in the mantissa, and is between 1 and 3 (ex. 100m, 1, 10, 100, 1k) => (3, 1, 2, 3, 1)
    let baz = foo % 3 + 1
    // fit extra info based on length
    // let extra = length - baz > 2 && baz < s.length ? `.${s.slice(baz, length - (bar == 10 ? 0 : 1))}` : ''
    let outputLength = baz + prefixes[bar].length
    let availableSpace = length - outputLength
    let excludedDigits = s.length - baz
    let extra = availableSpace >= 2 && excludedDigits && maxExtra ? `.${s.slice(baz, baz + Math.min(excludedDigits, availableSpace, maxExtra + 1) - 1)}` : ''
    return [`${s.slice(0, baz)}${extra}${prefixes[bar]}`, outputLength, availableSpace, excludedDigits]
}

export let ston = (txt, options={}) => {
    let { decimals=0 } = options
    txt = txt.replace(',', '')
    txt = txt.replace('u', 'μ')
    let match = txt.match(/^(\d+)(\.\d+)?([qryzafpnμmkMGTPEZYRQ])?$/i)?.slice(1)
    if (!match) { console.log(`number string ${txt} invalid`); return undefined }
    let [mantissa, extra, prefix] = match
    let index = prefixes.indexOf(prefix)
    if (index == -1) index = 10
    extra = extra?.slice(1)
    let sigs = `${mantissa}${extra ?? ''}`
    let howManyZeros = decimals - (extra?.length ?? 0) + index * 3 - 30
    console.log(sigs, howManyZeros)
    if (howManyZeros < 0) { sigs = sigs.slice(0, howManyZeros); howManyZeros = 0 }
    let zeros = Array(howManyZeros).fill(0).join('')
    return [mantissa, extra, prefix, decimals, howManyZeros, BigInt(`${sigs}${zeros}`)]
}