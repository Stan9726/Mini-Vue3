import { camelize, toHandlerKey } from '../shared'

// 用于调用 props 对象中的指定方法
export function emit(instance, event, ...args) {
  // 通过解构赋值获取组件实例对象的 props property
  const { props } = instance

  const handlerName = toHandlerKey(camelize(event))
  const handler = props[handlerName]
  handler && handler(...args)
}
