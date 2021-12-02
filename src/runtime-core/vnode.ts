// 用于创建 VNode
export function createVNode(type, props?, children?) {
  const vnode = {
    // HTML 标签名、组件
    type,
    // 保存 attribute、prop 和事件的对象
    props,
    // 子 VNode
    children,
    // 对应组件的根元素
    el: null
  }

  return vnode
}
