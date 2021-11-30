// 用于创建 vnode 对象
export function createVNode(type, props?, children?) {
	const vnode = {
		type,
		props,
		children
	}

	return vnode
}
