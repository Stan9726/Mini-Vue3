import { createVNode } from './vnode'

// 用于调用 createVNode 返回一个 VNode
export function h(type, props?, children?) {
	return createVNode(type, props, children)
}
