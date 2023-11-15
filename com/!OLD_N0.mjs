import { JsonRpc, sleep } from './B0.mjs'

let allowErrors = true

// an N0 instance
export default class N0 {
    constructor(url) { this.url = url }
    async call(method, params, cast) {
        let error, result, attempts = 1
        let foo = async () => {
            ({ error, result } = await JsonRpc.post(this.url, method, params))
            if (error === undefined) return cast(result)
            else if (error.message === 'method handler crashed') {
                if (attempts < 5) {
                    console.log(`### method handler crashed on attempt ${attempts}, retrying ###`)
                    attempts++
                    await sleep(50)
                    return await foo()
                } else throw new Error('### ABORT - 5 method handler crash errors ###')
            } else if (allowErrors) console.log('### N0 ERROR ###', method, params, error)
            else throw new Error(JSON.stringify(error))
        }
        return await foo()
    }
}