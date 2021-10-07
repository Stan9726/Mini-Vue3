import { track, trigger } from './effect'

// 对 get 和 set 进行缓存，防止重复调用工具函数
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

// 用于生成 get 函数的工具函数
function createGetter(isReadonly = false) {
	return function (target, key) {
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
	set() {
		// TODO 警告!
		return true
	}
}
