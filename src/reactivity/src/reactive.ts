import {
	mutableHandlers,
	ReactiveFlags,
	readonlyHandlers,
	shallowHandlers,
	shallowReadonlyHandlers
} from './baseHandlers'

export function reactive(raw) {
	return createReactiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
	return createReactiveObject(raw, readonlyHandlers)
}

export function shallowReactive(raw) {
	return createReactiveObject(raw, shallowHandlers)
}

export function shallowReadonly(raw) {
	return createReactiveObject(raw, shallowReadonlyHandlers)
}

// 用于创建 Proxy 实例的工具函数
function createReactiveObject(raw, baseHandlers) {
	// 返回 Proxy 的实例
	return new Proxy(raw, baseHandlers)
}

// 用于检查对象是否是由 reactive 创建的响应式对象
export function isReactive(value): boolean {
	// 获取对象的某个特殊 property 的值，从而触发 get，property 名为 __v_isReactive
	return !!value[ReactiveFlags.IS_REACTIVE]
}

// 用于检查对象是否是由 readonly 创建的 readonly 响应式对象
export function isReadonly(value): boolean {
	// 获取对象的某个特殊 property 的值，从而触发 get，property 名为 __v_isReactive
	return !!value[ReactiveFlags.IS_READONLY]
}

// 用于检查对象是否是由 reactive 或 readonly 创建的响应式对象
export function isProxy(value): boolean {
	// 利用 isReactive 和 isReadonly 进行判断
	return isReactive(value) || isReadonly(value)
}
