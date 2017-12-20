import Dep from './dep'
import {isObject} from './util'

// 数据监听器Observer，对对象的所有属性进行监听，有变动通知订阅者Dep
const Observer = (obj, fn) => {
    const dep = new Dep()
    return new Proxy(obj, {
        get: function (target, key, receiver) {
            // 如果订阅者存在，为属性订阅
            // 引用data中属性的时候触发
            if (Dep.target) {
                dep.addSub(key, Dep.target)
            }
            return Reflect.get(target, key, receiver);
        },
        set: function (target, key, value, receiver) {
            // !important 因为先保证改变，然后再触发订阅
            const res = Reflect.set(target, key, observe(value), receiver)
            // 触发订阅
            dep.notify(key)
            return res;
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