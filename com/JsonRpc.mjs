import { appendFile, writeFile } from './B1.mjs'

// can't JSON.stringify BigInts (for some dumb reason), this converts them to hex
function replacer(_, value) {
    if (typeof value === 'bigint') { return `0x${value.toString(16)}` } else return value
}

// static class for interacting with a JSON RPC endpoint
export default class JsonRpc {

    static async post(url, method, params) {
        // console.log(url, method, params)
        // appendFile(`${process.env.N2_PATH}/log/postlog`, `${new Date()}|${url}|${method}\n`, 'utf8')
        let body = JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }, replacer)
        let headers = { 'Content-Type': 'application/json' }
        let options = { method: 'POST', headers, body }
        let response = await fetch(url, options).catch(error => ({ error: { code: -32050, message: `error ${error}, executing method ${method}, at url ${url}; cause: ${error?.cause}` }}))
        if (response.json) response = await response.json().catch(error => ({ error: { code: 32051, message: `error ${error} reading json for metho ${method} at url ${url}; cause: ${error?.cause}` }}))
        try { await writeFile(`${process.env.N2_PATH}/log/${process.hrtime.bigint()}-${method}-${url.replace(/[^0-9a-z]/ig, '')}`, `${url}|${method}\n${JSON.stringify(response)}`, 'utf8') }
        catch(e) { await writeFile(`${process.env.N2_PATH}/log/${process.hrtime.bigint()}-${method}-${url.replace(/[^0-9a-z]/ig, '')}`, `${url}|${method}\n${''+response}`, 'utf8') }
        let { result, error } = response
        if (error) throw new Error(JSON.stringify(error))
        return result
    }

}