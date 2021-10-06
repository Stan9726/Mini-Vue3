// 抽离出一个 ReactiveEffect 类，对操作进行封装
class ReactiveEffect {
	private _fn: any

	// 构造函数接收可选的第二个参数，保存为实例的公共变量 scheduler
	constructor(fn, public scheduler?) {
		// 将传入的函数赋值给实例的私有 property _fn
		this._fn = fn
	}

	// 执行传入的函数
	run() {
		// 调用 run 方法时，用全局变量 activeEffect 保存当前实例
		activeEffect = this

		// 返回传入的函数执行的结果
		return this._fn()
	}
}

// 接收一个函数作为第一个参数，接收一个对象作为第二个参数
export function effect(fn, options: any = {}) {
	// 利用传入的函数创建 ReactiveEffect 类的实例，并将 scheduler 方法传给 ReactiveEffect 类的构造函数
	const _effect: ReactiveEffect = new ReactiveEffect(fn, options.scheduler)

	// 调用 ReactiveEffect 实例的 run 方法，执行传入的函数
	_effect.run()

	// 返回 _effect.run，并将其 this 指向指定为 _effect
	return _effect.run.bind(_effect)
}

/**
 * 用于保存程序运行中的所有依赖
 * key 为响应式对象
 * value 为 Map 的实例，用于保存该响应式对象的所有依赖
 */
const targetsMap = new WeakMap()

// 用于保存正在执行的 ReactiveEffect 类的实例
let activeEffect: ReactiveEffect

// 用于收集依赖
export function track(target, key) {
	// 获取当前响应式对象对应的 Map 实例,若为 undefined 则进行初始化并保存到 targetsMap 中
	/**
	 * 用于保存当前响应式对象的所有依赖
	 * key 为响应式对象的 property
	 * value 为 Set 的实例，用于保存与该 property 相关的 ReactiveEffect 类的实例
	 */
	let depsMap: Map<any, Set<ReactiveEffect>> | undefined =
		targetsMap.get(target)

	if (!depsMap) {
		depsMap = new Map<any, Set<ReactiveEffect>>()
		targetsMap.set(target, depsMap)
	}

	// 获取当前 property 对应的 Set 实例，若为 undefined 则进行初始化并保存到 depsMap 中
	/**
	 * 用于保存与当前 property 相关的函数
	 * value 为与该 property 相关的 ReactiveEffect 类的实例
	 */
	let dep: Set<ReactiveEffect> | undefined = depsMap.get(key)

	if (!dep) {
		dep = new Set<ReactiveEffect>()
		depsMap.set(key, dep)
	}

	// 将当前正在执行的 ReactiveEffect 类的实例添加到 dep 中
	dep.add(activeEffect)
}

// 用于触发依赖
export function trigger(target, key) {
	// 获取当前响应式对象对应的 Map 实例
	const depsMap: Map<any, Set<ReactiveEffect>> = targetsMap.get(target)
	// 获取当前 property 对应的 Set 实例
	const dep: Set<ReactiveEffect> = depsMap.get(key)!

	/**
	 * 遍历 dep，判断每一个 ReactiveEffect 类的实例的 scheduler property 是否存在
	 * 若不为 undefined 则调用 scheduler 方法，否则调用 run 方法
	 */
	for (const reactiveEffect of dep) {
		if (reactiveEffect.scheduler) {
			reactiveEffect.scheduler()
		} else {
			reactiveEffect.run()
		}
	}
}
