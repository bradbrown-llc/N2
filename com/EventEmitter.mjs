// EventEmitter for browsers
export default class EventEmitter {
    constructor() {
        this.map = new Map()
    }
    on(event, fn) {
        if (!this.map.get(event)) { this.map.set(event, new Set()) }
        let set = this.map.get(event)
        set.add(fn)
    }
    off(event, fn) {
        let set = this.map.get(event)
        set.delete(fn)
        if (!set.size) this.map.delete(event)
    }
    async emit(event, payload) {
        let set = this.map.get(event)
        if (set === undefined) return
        await Promise.all([...set].map(fn => fn(payload)))
    }
}