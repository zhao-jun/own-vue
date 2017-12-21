import Watcher from "./watcher";

// 指令解析器Compile，根据数据来渲染视图
export default class Compile {
    constructor (vm) {
        // 获取vm实例
        this._vm = vm
        return new Proxy({}, {
            // 箭头函数的话要注意传入参数
            get: this._getElement.bind(this)
        })
    }

    _getElement (target, tagName) {
        return (attrs = {}, ...childrens) => {
            // 创建节点
            this._elem = document.createElement(tagName)
            
            this._attrs = attrs
            this._childrens = childrens

            // 将标签和属性分开添加
            this._bindAttrs()
            this._addChildrens()

            return this._elem
        }
    }

    // 绑定属性
    _bindAttrs () {
        const {_attrs, _elem} = this
        Object.keys(_attrs).forEach(attr =>{
            if (attr.includes('@')) {
            } else if (attr.includes('-')) {
                this._bindDirectives(attr, _elem)                
            } else {
                _elem.setAttribute(attr, _attrs[attr])                
            }
        })
    }

    // 添加子节点
    _addChildrens () {
        const {_childrens, _elem, _vm} = this
        _childrens.forEach(children => {
            let child
            switch(typeof children) {
                case 'string':
                    // 添加文本，使用createTextNode而不是innerHTML避免注入
                    // 文本可以是变量或者是字符串，此处应该增加区分
                    child = document.createTextNode('')
                    compileUtil.text(child, _vm, children)
                    // child = document.createTextNode(children)
                    break
                case 'function':
                    child = document.createTextNode('')
                    compileUtil.text(child, _vm, children)
                    break
                default:
                    child = children
            }
            _elem.appendChild(child)
        })
    }

    // 绑定指令
    _bindDirectives (attr, _elem) {
        const {_attrs, _vm} = this
        const exp = _attrs[attr]
        const type = attr.slice(1)
        compileUtil[type](_elem, _vm, exp)
    }
}


// 绑定watcher
const compileUtil = {
    bind (node, vm, exp, type) {
        const update = updater[type]
        update && update(node, this.getVal(vm, exp))

        // dom要和computed关联，在于new Watcher的时候计算属性要订阅相关的data
        new Watcher(vm, exp, value => {
            console.log('更新了', value)
            update && update(node, value)
        })
    },
    text (node, vm, exp) {
        this.bind(node, vm, exp, 'text')
    },
    html (node, vm, exp) {
        this.bind(node, vm, exp, 'html')            
    },
    model (node, vm, exp) {
        this.bind(node, vm, exp, 'model')  

        // 此处不能用change
        // change触发的频率少于input，它只会在用户提交更改时触发。 -- 摘自MDN
        // 换句话说如果value不变化，change就不会生效
        node.addEventListener('input', e => {
            let value = e.target.value
            this.setVal(vm, exp, value)
        })
    },
    getVal (vm, exp) {
        if (typeof exp === 'function') {
            return exp.call(vm)
        } else if (typeof exp === 'string') {
            return vm[exp]
        }
    },
    setVal (vm, exp, value) {
        vm[exp] = value
    }
}

const updater = {
    text (node, value = '') {
        node.textContent = value
    },
    model (node, value = '') {
        node.value = value
    },
    html (node, value = '') {
        node.innerHTML = value
    }
}