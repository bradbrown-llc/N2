import { ntos } from '.B0.mjs'

let length = 18
let maxExtra = 0
// 999,999,998.765432110
console.log(ntos(999999998765432110n, { decimals: 9, length, maxExtra }))
// 0.000001234
console.log(ntos(1234n, { decimals: 9, length, maxExtra }))
// 100u
console.log(ntos(100000n, { decimals: 9, length, maxExtra }))
// 1m
console.log(ntos(1000000n, { decimals: 9, length, maxExtra }))
// 10m
console.log(ntos(10000000n, { decimals: 9, length, maxExtra }))
// 100m
console.log(ntos(100000000n, { decimals: 9, length, maxExtra }))
// 1
console.log(ntos(1000000000n, { decimals: 9, length, maxExtra }))
// 10
console.log(ntos(10000000000n, { decimals: 9, length, maxExtra }))
// 100
console.log(ntos(100000000000n, { decimals: 9, length, maxExtra }))
// 1k
console.log(ntos(1000000000000n, { decimals: 9, length, maxExtra }))
// 1
console.log(ntos(1000000000000000000000000000000n, { decimals: 30, length, maxExtra }))
// 1 -30 (0)
console.log(ntos(1n, { decimals: 30, length, maxExtra }))
// 1 -29 (1)
console.log(ntos(10n, { decimals: 30, length, maxExtra }))
// 1 -28 (2)
console.log(ntos(100n, { decimals: 30, length, maxExtra }))
// 1 -27 (3)
console.log(ntos(1000n, { decimals: 30, length, maxExtra }))
// 1 28
console.log(ntos(10000000000000000000000000000000000000n, { decimals: 9, length, maxExtra }))