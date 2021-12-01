import { createComponentInstance, setupComponent } from './component'

/**
 * 用于调用 patch 方法（为了方便后续进行递归地处理）
 */
export function render(vnode, container) {
	patch(vnode, container)
}

// 用于处理组件对应的 VNode
function patch(vnode, container) {
	// 根据 VNode 类型的不同调用不同的函数

	processComponent(vnode, container)

	// TODO: 调用 processElement
}

// 用于处理 Component
function processComponent(vnode, container) {
	mountComponent(vnode, container)
}

// 用于进行 Component 的初始化
function mountComponent(vnode, container) {
	// 通过组件对应的 VNode 创建组件实例对象，用于挂载 props、slots 等
	const instance = createComponentInstance(vnode)

	setupComponent(instance)

	setupRenderEffect(instance, container)
}

// 用于获取 VNode 树并递归地处理
function setupRenderEffect(instance, container) {
	// 调用组件实例对象中 render 函数获取 VNode 树
	const subTree = instance.render()

	// 调用 patch 方法递归地处理 VNode 树
	patch(subTree, container)
}
