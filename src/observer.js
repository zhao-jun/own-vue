import Dep from './dep'
import {isObject} from './util'

// 数据监听器Observer，对对象的所有属性进行监听，有变动通知订阅者Dep
const Observer = (obj, fn) => {
    const dep = new Dep()
    return new Proxy(obj, {
        get: function (target, key, receiver) {
            // 如果订阅者存在，为属性订阅
            // dom渲染时候触发
            if (Dep.target) {
                dep.addSub(Dep.target)
            }
            return Reflect.get(target, key, receiver);
        },
        set: function (target, key, value, receiver) {
            console.log(target)
            console.log(dep)
            // 触发订阅
            dep.notify()
            return Reflect.set(target, key, observe(value), receiver);
        }
    });
}

// 深度监听
export const observe = (obj) => {
    if (!isObject(obj)) {
        return obj
    }
    Object.keys(obj).forEach(key => {
        obj[key] = observe(obj[key])
    })
    return Observer(obj)
}

