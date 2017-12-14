import Dep from './dep'

// 订阅者，Observer和Compile之间通信的桥梁
export default class Watcher {
    constructor (vm, exp, cb) {
        this.vm = vm
        this.exp = exp
        this.cb = cb
        this.value = this.get()
    }
    // 实例化的时候往消息订阅器添加
    get () {
        const fn = this.exp
        Dep.target = this;
        return fn.call(this.vm)
    }
    update () {

    }
}