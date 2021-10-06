import { track, trigger } from './effect'

// 接受一个对象作为参数
export function reactive(raw) {
	// 返回 Proxy 的实例
	return new Proxy(raw, {
		// 对原始对象的 get 进行代理
		get(target, key) {
			const res = Reflect.get(target, key)
			// 收集依赖
			track(target, key)
			return res
		},
		// 对原始对象的 set 进行代理
		set(target, key, value) {
			const res = Reflect.set(target, key, value)
			// 触发依赖
			trigger(target, key)
			return res
		}
	})
}
