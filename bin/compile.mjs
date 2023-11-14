import { readFile, readdir, writeFile } from 'fs/promises'
import { createWriteStream } from 'fs'
import { spawn } from 'child_process'

let verbose = true
let cname = process.argv[2]
let debug = s => { if (verbose) console.log(s) }
let code = await readFile(`${process.env.N2_PATH}/pact/${cname}/${cname}.sol`, 'utf8')
let version = code.match(/pragma solidity (.+?);/)?.[1]
let response = await fetch('https://binaries.soliditylang.org/linux-amd64/list.json')
let { latestRelease, releases } = await response.json()
let neededCompiler = releases[version]
if (version !== latestRelease) throw new Error(`version ${version} not latest release ${latestRelease}`)
let localCompilers = (await readdir('${process.env.N2_PATH}/bin')).filter(file => file.match('solc-linux-amd64'))
if (!localCompilers.includes(neededCompiler)) {
    debug(`acquiring compiler ${neededCompiler}`)
    let response = await fetch(`https://binaries.soliditylang.org/linux-amd64/${neededCompiler}`)
    let blob = await response.blob()
    let buffer = Buffer.from(await blob.arrayBuffer())
    let stream = createWriteStream(`${process.env.N2_PATH}/bin/${neededCompiler}`, { mode: 0o755 })
    let streamFinishPromise = new Promise(r => stream.on('finish', r))
    await new Promise(r => stream.write(buffer, r))
    stream.end()
    await streamFinishPromise
    debug(`compiler ${neededCompiler} acquired`)
} else debug(`using local compiler ${neededCompiler}`)
let args = ['-', '--optimize-runs=99999']
if (process.argv.includes('--bin')) args.push('--bin')
if (process.argv.includes('--abi')) args.push('--abi')
console.log(`${process.env.N2_PATH}/bin/${neededCompiler}`, args)
let solc = spawn(`${process.env.N2_PATH}/bin/${neededCompiler}`, args)
let output = ''
solc.stdout.on('data', d => {
    debug(`STDOUT ${d}`)
    output += d
})
solc.stderr.on('data', d => debug(`STDERR ${d}`))
solc.stdin.write(code)
solc.stdin.end()
await new Promise(r => solc.on('exit', r))
let bytecodeRx = new RegExp(`${cname} =+\\s*\\nBinary:\\s*\\n(.+)`)
let bytecode = `0x${output.match(bytecodeRx)?.[1]}`
let abi = output.match(/Contract JSON ABI\n(.+)/)?.[1] ?? []
if (process.argv.includes('--bin')) await writeFile(`${process.env.N2_PATH}/pact/${cname}/${cname}.byt`, bytecode)
if (process.argv.includes('--abi')) await writeFile(`${process.env.N2_PATH}/pact/${cname}/${cname}.abi`, abi)