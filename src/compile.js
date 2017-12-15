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
            } else {
                _elem.setAttribute(attr, _attrs[attr])
            }
        })
    }

    // 添加子节点
    _addChildrens () {
        const {_childrens, _elem} = this
        _childrens.forEach(children => {
            let child
            switch(typeof children) {
                case 'string':
                    // 添加文本，使用createTextNode而不是innerHTML避免注入
                    child = document.createTextNode(children)
                    break
                default:
                    child = children
            }
            _elem.appendChild(child)
        })
    }

    compileUtil () {
        bind = (node, vm, exp, type) => {
            const update = updater[type]
            let val = this.getVal(vm, exp)

            update && update(node, val)

        }
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