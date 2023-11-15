import { spawn } from './B1.mjs'
import { N0 } from './B0.mjs'

// create an N0, returns Promise<N0>
export default ({ verbose=false, version='geth-linux-amd64-1.10.26-e5eb32ac', urllog=false }={}) =>
    // returns a promise
    new Promise(resolve => {
        // spawns a mkn1 process
        let proc = spawn(`${process.env.N2_PATH}/bin/mkn0.sh`, [version])
        // kill chains before exiting
        process.on('exit', () => proc.kill())
        // if there's a proc error, log it and stop this process
        proc.on('error', e => { console.log('error starting chain: ', e); process.exit(1) })
        // if verbose, log STDOUT
        proc.stdout.on('data', chunk => { if (verbose) console.log('OUT', `${chunk}`) })
        // if verbose, log STDERR
        proc.stderr.on('data', chunk => { if (verbose) console.log('ERR', `${chunk}`)
            // all geth data passes through STDERR (?), use this to get the automatically assigned json rpc port
            // also use it to get the database and the enode
            let port = `${chunk}`.match(/HTTP.+?\[::\]:(\d+)/)?.[1]
            // once we get the port, return an N1 instance with one N0: the json rpc port
            if (port) {
                let url = `http://localhost:${port}`
                if (urllog) console.log(url)
                let n0 = new N0(url)
                n0.proc = proc
                resolve(n0)}})})