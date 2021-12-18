import { hasOwn } from '../shared'

// 用于保存组件实例对象 property 及对应的 getter
const publicPropertiesMap = {
  $el: i => i.vnode.el
}

// 组件实例对象 proxy property 对应的 handlers
export const PublicInstanceHandlers = {
  get({ _: instance }, key) {
    // 通过解构赋值获取组件实例对象的 setupState property 和 props property
    const { setupState, props } = instance

    // 若 setupState property 或 props property 上有该 property 则返回其值
    if (hasOwn(setupState, key)) {
      return setupState[key]
    } else if (hasOwn(props, key)) {
      return props[key]
    }

    // 若获取指定 property 则调用对应 getter 并返回其返回值
    const publicGetter = publicPropertiesMap[key]
    if (publicGetter) {
      return publicGetter(instance)
    }
  }
}
