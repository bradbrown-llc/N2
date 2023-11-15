/// <reference types="./chainlistTypes.d.ts" />

const N2_CHAINLISTDATA = Deno.env.get('N2_CHAINLISTDATA') ?? new URL('./chainlistdata', import.meta.url).pathname

const chainlistImport = async ({ method, at, target }: ChainlistOptions) => {
    switch (method) {
        case 'fetch': {
            const response = await fetch('https://chainlist.org/')
            const text = await response.text()
            const match = text.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/)
            if (!match || !match[1]) throw new Error('chainlist data not found')
            const rawTextData = match[1]
            const rawJsonData = JSON.parse(rawTextData)
            const chains: ChainlistChain[] = rawJsonData?.props?.pageProps?.chains
            if (!chains) throw new Error('could not extract chains from chainlist rawJsonData')
            const encoder = new TextEncoder()
            const data = encoder.encode(JSON.stringify(chains, undefined, 4))
            await Deno.writeFile(`${N2_CHAINLISTDATA}/${Date.now()}`, data)
            return chains
        }
        case 'read': {
            const filenames: string[] = []
            for await (const dirEntry of Deno.readDir(N2_CHAINLISTDATA)) filenames.push(dirEntry.name)
            filenames.sort((a, b) => b < a ? -1 : 1)
            if (at === undefined && target === undefined) return filenames
            else {
                const filename = at !== undefined
                    ? filenames.at(at)
                    : filenames.find(name => name == target)
                if (filename === undefined)
                    throw new Error(
                        at !== undefined 
                            ? `chainlistdata at ${at} is undefined`
                            : `chainlistdata ${target} is undefined`)
                const decoder = new TextDecoder()
                const data = decoder.decode(await Deno.readFile(`${N2_CHAINLISTDATA}/${filename}`))
                return JSON.parse(data)
            }
        }
    }
    
}

export { chainlistImport }