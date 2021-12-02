import { render } from './renderer'
import { createVNode } from './vnode'

// 用于创建应用实例
export function createApp(rootComponent) {
  return {
    component() {},
    directive() {},
    use() {},
    // 用于将应用挂载到根容器中
    mount(rootContainer) {
      // 将根组件转换为 VNode
      const vnode = createVNode(rootComponent)

      render(vnode, rootContainer)
    }
  }
}
