// 消息订阅器，存放订阅者
// 需要对每个订阅者有唯一标识，可以使用id + 数组， 或者才用对象/Map的数据结构
// vue中采用的是id + 数组，这里采用Map + Set的数据结构

export default class Dep {
    constructor () {
        this.subs = new Map()
    }
    // 订阅，存入Dep.target
    addSub (key, sub) {
        // this.subs.push(sub)
        const existSub = this.subs.get(key)
        if(existSub) {
            // 引用地址相同，所以可以直接操作数组
            // 用set，避免重复订阅
            existSub.add(sub)
        } else {
            this.subs.set(key, new Set([sub]))
        }
        console.log('消息订阅器', this.subs)
    }
    // 通知所有订阅者
    notify (key) {
        this.subs.get(key).forEach(sub => sub.update())
    }
}