const watcher = (target = {}, fn) => new Proxy(target, {
    get: function (target, key, receiver) {
      Reflect.get(target, key, receiver);
    //   return 1;      
    },
    // 该过程每次都会触发
    set: function (target, key, value, receiver) {
        // 获取原来的值
        const oldValue = Reflect.get(target, key, receiver);
        fn && fn(value, oldValue);
        Reflect.set(target, key, value, receiver);
        // return 2;
    }
});

// 类似vue的监听属性
// let obj = watcher({a: 1}, (newValue, oldValue) => console.log(`new ${newValue}  old ${oldValue}`))
// obj.a = 2
// obj.a = 3
// console.log(obj.a, 'ad')

// 生成dom，此处采取react的模式，直接根据render来进行渲染
const dom = new Proxy({}, {
    get(target, tagName) {
        // console.log(target, tagName)
        return (attrs = {}, ...childrens) => {
            // 创建节点
            const elem = document.createElement(tagName)
            // 遍历添加属性
            Object.keys(attrs).forEach(attr => elem.setAttribute(attr, attrs[attr]))
            // 添加文本，使用createTextNode而不是innerHTML避免注入
            childrens.forEach(children => {
                const child = typeof(children) === 'string' ? document.createTextNode(children) : null
                elem.appendChild(child)
            })
            return elem
        };
    }
})
// 调用get，没有value所以参数传入
// console.log(dom.div(
//     {class: 'container'},
//     'hello world'
// ))

class Vue {
    constructor (config) {
        this._config = config;
        // this绑定，vue中采取的直接将method中的方法直接绑定到this上面
        // 此处将new中参数的方法直接绑定到this上
        Object.keys(config).forEach(i => {
            const val = config[i]            
            if (typeof (config[i]) === 'function') {
                config[i] = config[i].bind(this)
            }
        })
        this.initData(config.data)
        this.appendDom()

        return this._vm
    }

    // 监听数据变化
    initData (data) {
        Object.assign(this, data())
        // 数据变化时重新执行appendDom
        this._vm = watcher(this, this.appendDom.bind(this))
    }

    // 插入dom
    appendDom () {
        const {el, render} = this._config;
        const targetElem = document.querySelector(el)
        // 重新render的时候要清空原来的dom
        targetElem.innerHTML = ''
        targetElem.appendChild(render())
    }
}

const vm = new Vue({
    el: 'body',
    data () {
        return {
            msg: 'hello world'
        }
    },
    render () {
       return dom.div(
            {class: 'container'},
            this.msg
        )
    }
})

console.log(vm)

// 测试
// setInterval(_ => {
//     vm.msg = 'hello world ' + new Date()
// }, 1000)