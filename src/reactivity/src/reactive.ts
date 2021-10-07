import { mutableHandlers, readonlyHandlers } from './baseHandlers'

// 接收一个对象作为参数
export function reactive(raw) {
	return createReactiveObject(raw, mutableHandlers)
}

// 接收一个对象作为参数
export function readonly(raw) {
	return createReactiveObject(raw, readonlyHandlers)
}

// 用于创建 Proxy 实例的工具函数
function createReactiveObject(raw, baseHandlers) {
	// 返回 Proxy 的实例
	return new Proxy(raw, baseHandlers)
}
