import { track, trigger } from './effect'

// 对 get 和 set 进行缓存，防止重复调用工具函数
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

// 用于保存 isReactive 和 isReadonly 中使用的特殊 property 的名
export const enum ReactiveFlags {
	IS_REACTIVE = '__v_isReactive',
	IS_READONLY = '__v_isReadonly'
}

// 用于生成 get 函数的工具函数
function createGetter(isReadonly = false) {
	return function (target, key) {
		// 当 property 名为 __v_isReactive 时，表明正在调用 isReactive，直接返回 !isReadonly
		if (key === ReactiveFlags.IS_REACTIVE) {
			return !isReadonly
		}
		// 当 property 名为 __v_isReadonly 时，表明正在调用 isReadonly，直接返回 isReadonly
		else if (key === ReactiveFlags.IS_READONLY) {
			return isReadonly
		}

		const res = Reflect.get(target, key)
		if (!isReadonly) {
			// 收集依赖
			track(target, key)
		}
		return res
	}
}

// 用于生成 set 函数的工具函数
function createSetter() {
	return function (target, key, value) {
		const res = Reflect.set(target, key, value)
		// 触发依赖
		trigger(target, key)
		return res
	}
}

export const mutableHandlers = {
	get,
	set
}

export const readonlyHandlers = {
	get: readonlyGet,
	set(target, key) {
		// 调用 console.warn 发出警告
		console.warn(
			`Set operation on key "${key}" failed: target is readonly.`,
			target
		)
		return true
	}
}
