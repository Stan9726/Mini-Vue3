// 用于保存组件实例对象的 update 方法
const queue: any[] = []

const p = Promise.resolve()
// 用于标志是否将清空队列的操作放到微任务队列中
let isFlushPending = false

// 用于将回调函数推迟到下一个 DOM 更新周期之后执行
export function nextTick(fn) {
  // 若传入了回调函数则将其放到微任务队列中并返回一个 Promise，否则直接返回一个 Promise
  return fn ? p.then(fn) : p
}

// 用于将组件实例对象的 update 方法保存到队列中并将清空队列的操作放到微任务队列中
export function queueJobs(job) {
  if (!queue.includes(job)) {
    queue.push(job)
  }

  queueFlush()
}

// 用于清空队列
function queueFlush() {
  if (isFlushPending) {
    return
  }

  isFlushPending = true

  // 利用 nextTick 将 flushJobs 函数放到微任务队列中
  nextTick(flushJobs)
}

// 用于依次从队列中弹出组件实例对象的 update 方法并执行
function flushJobs() {
  isFlushPending = false

  let job
  while ((job = queue.shift())) {
    job && job()
  }
}
