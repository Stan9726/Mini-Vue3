import { ShapeFlags } from '../shared'

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')

// 用于创建 VNode
export function createVNode(type, props?, children?) {
  const vnode = {
    // HTML 标签名、组件
    type,
    // 保存 attribute、prop 和事件的对象
    props,
    // 子 VNode
    children,
    // VNode 和 children 类型的标志位
    shapeFlag: getShapeFlag(type),
    // 对应组件的 key attribute
    key: props?.key,
    // 对应组件的根元素
    el: null
  }

  // 根据 children 的类型设置 shapeFlag 对应的位
  if (typeof children === 'string') {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  } else if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  }

  // 若 VNode 类型为 Component 同时 children 类型为对象，则 children 为插槽，设置 shapeFlag 对应的位
  if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    if (typeof children === 'object') {
      vnode.shapeFlag |= ShapeFlags.SLOTS_CHILDREN
    }
  }

  return vnode
}

// 用于创建 Text 类型的 VNode
export function createTextVNode(text: string) {
  return createVNode(Text, {}, text)
}

// 用于根据 VNode 的 type property 设置 shapeFlag 对应的位
function getShapeFlag(type) {
  return typeof type === 'string'
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT
}
