// 用于保存组件实例对象 property 及对应的 getter
const publicPropertiesMap = {
  $el: i => i.vnode.el
}

// 组件实例对象 proxy property 对应的 handlers
export const PublicInstanceHandlers = {
  get({ _: instance }, key) {
    const { setupState } = instance

    // 若组件实例对象的 setupState property 上有该 property 则返回其中该 property 的值
    if (key in setupState) {
      return setupState[key]
    }

    // 若获取指定 property 则调用对应 getter 并返回其返回值
    const publicGetter = publicPropertiesMap[key]
    if (publicGetter) {
      return publicGetter(instance)
    }
  }
}
