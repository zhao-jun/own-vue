// 异步更新队列
let queue = new Set()

export default function pushWatcher (watcher) {
    // Set队列避免重复添加watcher
    queue.add(watcher)
    // 使用promise和setTimeout都可以
    Promise.resolve().then(() => flushQueue())
    // setTimeout(() => flushQueue())
}

function flushQueue () {
    queue.forEach(watcher => {
      watcher.run()
    })
    // 清空队列
    queue = new Set()
}