// 用于创建 VNode
export function createVNode(type, props?, children?) {
	const vnode = {
		type,
		props,
		children
	}

	return vnode
}
