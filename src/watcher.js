import Dep from './dep'

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
        // 当前订阅者指向自己，Dep.target即为一个订阅者watcher
        Dep.target = this;      
        // 更新value的值
        if (typeof exp === 'function') {
            return exp.call(this.vm)
        } else if (typeof exp === 'string') {
            return this.vm[exp]
        }

    }
    // 收到通知，更新
    update () {
        this.run()
    }
    run () {
        const val =this.get()
        console.log('回调', val, this.exp, this.vm.changeMsg)
        this.cb.call(this.vm, val, this.value)
        this.value = val
    }
}