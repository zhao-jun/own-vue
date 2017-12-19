import MVVM from './mvvm'
import {observe} from './observer'

const vm = new MVVM({
    el: 'body',
    data () {
        return {
            msg: '外层div',
            text: '内层p',
            value: 'hello'
        }
    },
    // 计算属性是基于它们的依赖进行缓存的，所以不会根据new Date更新
    // 简单来说就是未对computed属性做监听处理
    // 动态计算尚未实现
    computed: {
        changeMsg () {
            return this.msg + new Date()
        }
    },
    render (createElement) {
        // 文本节点放在外面，这样可以和dom节点排序
        return createElement.div({
                class: 'container',
            }, () => this.changeMsg, createElement.p({
                class: 'inner'
            }, () => this.msg, createElement.input({
                '-model': 'msg'
            }))
        )
    }
})

// setTimeout(_ => {
//   vm.msg = 'hello world' + new Date()
// }, 1000)

// let obj = observe({a: 1})
// obj.a = 2

// console.log('one');

// function defineReactive (data, key, val) {
//     Object.defineProperty(data, key, {
//         enumerable: true,
//         configurable: false,
//         get: function () {
//             console.log(val, 'val')
//             return val
//         },
//         set: function (newVal) {
//             console.log(newVal, 'newVal')
//             val = newVal
//         }
//     })
// }
// let obj = { a: 1, b: 2 }

// Object.keys(obj).forEach(key => {
//     defineReactive(obj, key, obj[key])
// })

// obj.a = 3

const Observer = (target = {}, fn) => new Proxy(target, {
    get: function (target, key, receiver) {
        return Reflect.get(target, key, receiver);
    },
    // 该过程每次都会触发
    set: function (target, key, value, receiver) {
        // 获取原来的值
        const oldValue = Reflect.get(target, key, receiver);
        fn && fn(value, oldValue);
        return Reflect.set(target, key, value, receiver);
    }
});

let obj = Observer([{a: 1},2,4,5], (newValue, oldValue) => console.log(`new ${newValue}  old ${oldValue}`))
obj[0].a = 2
// obj.a = 3
console.log(obj)
