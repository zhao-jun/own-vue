// 消息订阅器，存放订阅者
// 需要对每个订阅者有唯一标识，可以使用id + 数组， 或者才用对象/Map的数据结构
// vue中采用的是id + 数组，这里采用Map的数据结构

export default class Dep {
    constructor () {
        this.subs = []
    }
    // 订阅，存入Dep.target
    addSub (sub) {
        this.subs.push(sub)
    }
    // 通知所有订阅者
    notify () {
        this.subs.forEach(sub => sub.update())
    }
}