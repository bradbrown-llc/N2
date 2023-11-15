export default (n0, hash) => new Promise((resolve, reject) => {
    let fn = async () => {
        let result = await n0.getTransactionReceipt(hash).catch(e => { return e })
        if (result instanceof Error) { n0.mon.off('block', fn); reject(result); return }
        let receipt = result
        if (receipt === null || receipt.status === undefined) return
        else { n0.mon.off('block', fn); resolve(receipt) }
    }
    n0.mon.on('block', fn)
})