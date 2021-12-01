import { isObject } from './../shared/index'
import { createComponentInstance, setupComponent } from './component'

// 用于调用 patch 方法（为了方便后续进行递归地处理）
export function render(vnode, container) {
	patch(vnode, container)
}

// 用于处理组件对应的 VNode
function patch(vnode, container) {
	// 根据 VNode 类型的不同调用不同的函数
	// 通过 VNode 的 type 属性值的类型来判断 VNode 类型
	// 若 type 属性值的类型是 string，则 VNode 类型是 Element
	if (typeof vnode.type === 'string') {
		processElement(vnode, container)
	}
	// 若 type 属性值的类型是 object，则 VNode 类型是 Component
	else if (isObject(vnode.type)) {
		processComponent(vnode, container)
	}
}

// 用于处理 Element
function processElement(vnode, container) {
	mountElement(vnode, container)
}

// 用于进行 Element 的初始化
function mountElement(vnode, container) {
	// 根据 Element 对应 VNode 的 type 属性的值创建 DOM 元素并赋值给变量 el
	const el = document.createElement(vnode.type)

	// 通过解构赋值获取 Element 对应 VNode 的 props 和 children 属性的值
	const { props, children } = vnode

	// 遍历 props 属性的值，通过 Element.setAttribute() 将其中的属性添加到 el 上
	// 其中 key 作为 el 的属性名，value 作为 属性值
	for (const key in props) {
		const val = props[key]
		el.setAttribute(key, val)
	}

	// 若 children 属性值的类型是 string，则将其赋值给 el 的 textContent 属性
	if (typeof children === 'string') {
		el.textContent = children
	}
	// 若 children 属性值的类型是 Array，则调用 mountChildren 函数
	else if (Array.isArray(children)) {
		mountChildren(children, el)
	}

	// 通过 Element.append() 将 el 添加到根容器/其父元素中
	container.append(el)
}

// 用于遍历 children 属性的值，对其中每个 VNode 调用 patch 方法进行处理
function mountChildren(children, container) {
	children.forEach(child => {
		patch(child, container)
	})
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
