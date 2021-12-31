import { createVNode, Fragment } from '../vnode'

// 用于利用 Fragment 对插槽进行包裹
export function renderSlots(slots, name, props) {
  // 通过 name 获取创建相应插槽的方法
  const slot = slots[name]

  if (slot) {
    if (typeof slot === 'function') {
      // 将创建插槽方法的执行结果作为 children 传入
      return createVNode(Fragment, {}, slot(props))
    }
  }
}
