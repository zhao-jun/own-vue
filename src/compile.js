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
            // 遍历添加属性
            Object.keys(attrs).forEach(attr => this._elem.setAttribute(attr, attrs[attr]))
            // 添加文本，使用createTextNode而不是innerHTML避免注入
            childrens.forEach(children => {
                const child = typeof(children) === 'string' ? document.createTextNode(children) : null
                this._elem.appendChild(child)
            })
            return this._elem
        }
    }
}