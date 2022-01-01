import { getCurrentInstance } from './component'

// 用于注入依赖
export function provide(key, value) {
  // 获取当前组件实例对象
  const currentInstance: any = getCurrentInstance()

  if (currentInstance) {
    // 通过解构赋值获取当前组件实例对象的 provides property
    let { provides } = currentInstance

    // 获取父组件实例对象的 provides property
    const parentProvides = currentInstance.parent.provides

    // 若判断当前组件实例对象和父组件实例对象的 provides property 相等，则是在当前组件 setup 中第一次调用 provide 函数
    if (provides === parentProvides) {
      // 利用 Object.create() 创建一个以父组件实例对象的 provides property 为原型的空对象，将其赋值给当前组件实例对象的 provides property
      provides = currentInstance.provides = Object.create(parentProvides)
    }

    // 将依赖挂载到当前组件实例对象的 provides property 上
    provides[key] = value
  }
}

// 用于引入依赖
export function inject(key, defaultValue) {
  // 获取当前组件实例对象
  const currentInstance: any = getCurrentInstance()

  if (currentInstance) {
    // 获取父组件实例对象的 parent property
    const parentProvides = currentInstance.parent.provides

    // 若父组件实例对象的 provides property 上有相应的 property 则直接返回
    if (key in parentProvides) {
      return parentProvides[key]
    }
    // 否则，若传入了默认值或默认值函数则返回默认值或默认值函数的返回值
    else if (defaultValue) {
      if (typeof defaultValue === 'function') {
        return defaultValue()
      }

      return defaultValue
    }
  }
}
