import MVVM from './mvvm'
import {observe} from './observer'
import Watcher from './watcher'

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
    computed: {
        changeMsg () {
            return new Date() + this.msg
        },
        changeText () {
            return new Date() + this.text
        }
    },
    render (createElement) {
        // 文本节点放在外面，这样可以和dom节点排序
        return createElement.div({
                class: 'container',
            }, () => this.changeMsg
            // 'changeMsg'
            , createElement.p({
                class: 'inner'
            }, () => this.changeText), createElement.input({
                '-model': 'msg'
            })
        )
    }
})

// setTimeout(_ => {
//     vm.text = '123'
// }, 1000)
// setTimeout(_ => {
//     vm.msg = 'hello world' + new Date()
// }, 2000)

let obj = observe({a: 1, b: 2})
new Watcher(obj, 'a', val => console.log(val)
)

obj.a = 2
obj.a = 3
obj.a = 4

vm.text = '123'
vm.text = '1234'