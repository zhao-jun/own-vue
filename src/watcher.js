import Dep from './dep'
import pushWatcher from './batcher'

// 订阅者，Observer和Compile之间通信的桥梁，不同属性就是不同的订阅者
export default class Watcher {
    constructor (vm, exp, cb) {
        this.vm = vm
        this.exp = exp
        this.cb = cb
        this.value = this.get()
    }
    // 实例化的时候修改消息订阅器的target
    get () {
        const exp = this.exp
        let value
        // 当前订阅者指向自己，Dep.target即为一个订阅者watcher
        Dep.target = this;  
        // 更新value的值
        if (typeof exp === 'function') {
            value = exp.call(this.vm)
        } else if (typeof exp === 'string') {
            value = this.vm[exp]
        }
        // 订阅结束，及时清除订阅者，避免错误订阅
        Dep.target = null
        return value
    }
    // 收到通知，更新
    // 异步更新
    update () {
        // this.run()
        pushWatcher(this)
    }
    run () {
        const val =this.get()
        this.cb.call(this.vm, val, this.value)
        this.value = val
    }
}