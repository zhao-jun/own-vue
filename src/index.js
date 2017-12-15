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
    computed: {
        changeMsg () {
            return this.msg + new Date()
        }
    },
    render (createElement) {
        // 文本节点放在外面，这样可以和dom节点排序
        return createElement.div({
                class: 'container',
            }, this.changeMsg, createElement.p({
                class: 'inner'
            }, this.text, createElement.input({
                value: this.value
            }))
        )
    }
})

console.log(vm)
// setInterval(_ => {
//   vm.msg = 'hello world'
// }, 5000)

// let obj = observe({a: 1})
// obj.a = 2

// setTimeout(function () {
//     console.log('three');
// }, 0);
  
// Promise.resolve().then(function () {
//     console.log('two');
// });

// console.log('one');