import { ston } from './B0.mjs'

// 999,999,998.765432110
console.log(ston('999.999998765432110M', { decimals: 9 }))
console.log(ston('999.999998765432110M', { decimals: 9 }))
// 0.000001234
console.log(ston('0.000001234', { decimals: 9 }))
// 100u
console.log(ston('100u', { decimals: 9 }))
// 1m
console.log(ston('1m', { decimals: 9 }))
// 10m
console.log(ston('10m', { decimals: 9 }))
// 100m
console.log(ston('100m', { decimals: 9 }))
// 1
console.log(ston('1', { decimals: 9 }))
// 10
console.log(ston('10', { decimals: 9 }))
// 100
console.log(ston('100', { decimals: 9 }))
// 1k
console.log(ston('1k', { decimals: 9 }))
// 1
console.log(ston('1', { decimals: 30 }))
// 1 -30 (0)
console.log(ston('1q', { decimals: 30 }))
// 1 -29 (1)
console.log(ston('10q', { decimals: 30 }))
// 1 -28 (2)
console.log(ston('100q', { decimals: 30 }))
// 1 -27 (3)
console.log(ston('1000q', { decimals: 30 }))
// 1 28
console.log(ston('1Q', { decimals: 9 }))

console.log(ston('1234.9876M', { decimals: 9 }))

console.log(ston('abcdefg', { decimals: 9 }))

console.log(ston('1234.567.890', { decimals: 9 }))

console.log(ston('100p', { decimals: 9 }))

console.log(ston('123456p', { decimals: 9 }))

console.log(ston('1w', { decimals: 9 }))