import { ShapeFlags } from '../shared'

// 用于将插槽挂载到组件实例对象的 slots property 上
export function initSlots(instance, children) {
  // 通过解构赋值获得组件对应的 VNode
  const { vnode } = instance

  // 若 children 是插槽则进行处理
  if (vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    normalizeObjectSlots(children, instance.slots)
  }
}

// 用于遍历 children，将创建插槽对应的 VNode 数组的函数挂载到组件实例对象的 slots property 上
function normalizeObjectSlots(children, slots) {
  for (const key in children) {
    const value = children[key]

    slots[key] = props => normalizeSlotValue(value(props))
  }
}

// 用于将一个 VNode 转为数组
function normalizeSlotValue(value) {
  return Array.isArray(value) ? value : [value]
}
