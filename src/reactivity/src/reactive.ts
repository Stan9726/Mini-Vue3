export function reactive(raw) {
	// 返回 Proxy 的实例
	return new Proxy(raw, {
		// 对原始对象的 get 和 set 进行代理
		get(target, key) {
			// TODO 收集依赖
			return Reflect.get(target, key)
		},
		set(target, key, value) {
			// TODO 触发依赖
			return Reflect.set(target, key, value)
		}
	})
}
