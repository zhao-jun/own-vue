import {observe} from './observer'
import Compile from './compile'
import {foreach} from './util'
import Dep from './dep'

export default class MVVM {
    constructor (config) {
        this._config = config

        this._initVM()        
        this._initData(config.data)
        this._initComputed() 
        this._bindVM()  
        this._appendDom()    
        return this._vm
    }
    // 数据深度监听
    _initData (data) {
        this._data = observe(data())
    }
    // 将_vm与data绑定，对this进行代理
    _initVM () {
        const {_config} = this;        
        // 此处要注意每次返回都是新的_vm
        this._vm = new Proxy(this, {
            get: (target, key, receiver) => {
                if (Object.keys(this).includes(key)) return this[key]
                if (Object.keys(this._data).includes(key)) return this._data[key]
                // 如果是获取computed中的计算属性，那就要重新计算，获取data中数据，将dom订阅，关联了computed和dom
                return _config.computed[key].call(target._vm)
            },  
            set: (target, key, value, receiver) => {
                if (!this[key]) {
                    // 如果data中数据发生改变，要对computed重新计算！
                    // this._initComputed ()
                    return Reflect.set(this._data, key, value)
                }
                return Reflect.set(target, key, value)
            }
        }) 
    }

    _initComputed () {
        const {_config, _vm} = this;
        this._computed = {}
        foreach(_config.computed, (key) => {
            // 将计算的值放入computed
            this._computed[key] = _config.computed[key].call(_vm)
            // 第三个参数为cb，通知时触发，触发后计算响应变化
            // new Watcher(_vm, _config.computed[key], val => {
            //     this._computed[key] = val
            // })
        })
    }

    _appendDom () {
        const {render, el} = this._config
        const targetElem = document.querySelector(el)
        // 重新render的时候要清空原来的dom
        targetElem.innerHTML = ''
        const createElement = new Compile(this._vm)
        // 传入createElement参数，替代原来的createElement，createElement已被代理
        targetElem.appendChild(render(createElement))
    }

    // 注意绑定到this._vm上，而不是this上，这个可以让实例中可以互相访问
    _bindVM () {
        const {_config} = this
        Object.keys(_config).forEach(i => {
            const val = _config[i]            
            if (typeof (_config[i]) === 'function') {
                _config[i] = _config[i].bind(this._vm)
            }
        })
    }
}