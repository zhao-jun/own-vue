// 消息订阅器，存放订阅者

export default class Dep {
    constructor () {
        this.subs = []
    }
    addSub (sub) {
        this.subs.push(sub)
    }
    notify () {
        this.subs.forEach(sub => sub.update)
    }
}