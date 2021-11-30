import { render } from './renderer'
import { createVNode } from './vnode'

/**
 * 用于创建应用实例
 * 接受根组件选项对象作为参数
 * 返回一个包含 component、directive、use 和 mount 等方法的对象
 */
export function createApp(rootComponent) {
	return {
		component() {},
		directive() {},
		use() {},
		/**
		 * 用于将应用挂载到根容器中
		 * 接受根容器 selector 作为参数
		 * 返回根组件实例
		 */
		mount(rootContainer) {
			// 将根组件转换为 vnode 对象
			const vnode = createVNode(rootComponent)

			render(vnode, rootContainer)
		}
	}
}
