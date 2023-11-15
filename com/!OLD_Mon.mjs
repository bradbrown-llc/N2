import { EventEmitter, sleep } from './B0.mjs'

// Mon instance, monitors an N1's height and emits a 'block' event when this height changes
export default class Mon extends EventEmitter {
    constructor(n1) {
        super();
        this.n1 = n1
        this.loop = false
        this.poll() 
    }
    async poll() {
        let { n1 } = this
        // loop forever, get height, if height isn't what N1 instance has, emit 'block' event and update N1's height, wait on a delay
        while (this.loop) {
            let height = await n1.blockNumber
            if (height !== n1.height) {
                let oldHeight = n1.height
                n1.height = height
                await this.emit('block', { old: oldHeight, new: height })
            }
            await sleep(1000)
        }
    }
    on(event, fn) {
        if (!this.map.get(event)) { this.map.set(event, new Set()) }
        let set = this.map.get(event)
        set.add(fn)
        if (!this.loop) { this.loop = true; this.poll() }
    }
    off(event, fn) {
        let set = this.map.get(event)
        set.delete(fn)
        if (!set.size) this.map.delete(event)
        if (!this.map.size) this.loop = false
    }
}