import { EventEmitter, sleep } from './B0.mjs'

// Mon instance, monitors an N0's height and emits a 'block' event when this height changes
export default class Mon extends EventEmitter {
    constructor({ n0, period }) {
        super();
        this.n0 = n0
        this.period = period ?? 1000
        this.loop = false
    }
    async poll(guid) {
        // loop forever, get height, if height isn't what N1 instance has, emit 'block' event and update N1's height, wait on a delay
        while (this.loop === guid) {
            let height = await this.n0.blockNumber
            if (!(height instanceof Error) && height !== this.n0.height) {
                let oldHeight = this.n0.height
                this.n0.height = height
                await this.emit('block', { old: oldHeight, new: height })
            }
            await sleep(this.period)
        }
    }
    on(event, fn) {
        if (!this.map.get(event)) { this.map.set(event, new Set()) }
        let set = this.map.get(event)
        set.add(fn)
        if (!this.loop) this.poll(this.loop = {})
    }
    off(event, fn) {
        let set = this.map.get(event)
        set.delete(fn)
        if (!set.size) this.map.delete(event)
        if (!this.map.size) this.loop = null
    }
}