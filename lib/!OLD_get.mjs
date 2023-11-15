#!/usr/bin/node
import { config, Signer } from './B0.mjs'
import { readFile, writeFile, spawn } from './B1.mjs'

/** @returns {Promise<true|false>} */
let tryAcquireLock = () =>
    new Promise(r =>
        spawn('mkdir', ['/tmp/N2-lock'])
        .on('close', () => r(true))
        .stderr.on('data', () => r(false)))

let getChainId = async () => {
    while (!await tryAcquireLock()) await new Promise(r => setTimeout(r, 0))
    let chainId = BigInt(await readFile('/tmp/N2-chainid', 'utf-8').catch(() => { return '0' }))
    await writeFile('/tmp/N2-chainid', `${chainId + 1n}`)
    spawn('rmdir', ['/tmp/N2-lock'])
    return chainId
}

let log = x => console.log(x)
switch (process.argv.at(-1)) {
    case 'rootSecret': log(config.root.secret); break;
    case 'rootAddress': log((new Signer(config.root.secret).address.slice(2))); break;
    case 'gasLimit': log(''+config.gasLimit); break;
    case 'rootAlloc': log(''+config.root.alloc); break;
    case 'chainId': log(''+await getChainId()); break;
}