class N0 {

    url: string

    constructor({ url }: { url: string }) {
        this.url = url
    }
    
    get chainId() { return new Promise(r => setTimeout(r, 1000)) }

    static spawn() {
        return new N0({ url: 'http://foo.bar/baz' })
    }
    
}

export { N0 }