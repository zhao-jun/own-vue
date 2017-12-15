export const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]'

// forEach封装，判断是否为空，对对象遍历
export const foreach = (obj = {}, fn) => {
    Object.keys(obj).forEach(key => fn && fn (key))
}