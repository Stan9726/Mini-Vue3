// 抽离出一个 ReactiveEffect 类，对操作进行封装
class ReactiveEffect {
	private _fn: any

	constructor(fn) {
		this._fn = fn
	}

	// 执行传入的方法
	run() {
		// 调用 run 方法时，用全局变量 activeEffect 保存当前实例
		activeEffect = this
		this._fn()
	}
}

export function effect(fn) {
	const _effect: ReactiveEffect = new ReactiveEffect(fn)

	// 调用 ReactiveEffect 实例的 run 方法，执行传入的方法
	_effect.run()
}

/**
 * 用于保存程序运行中的所有依赖
 * key 为响应式对象
 * value 为 Map 的实例，用于保存该响应式对象的所有依赖
 */
const targetsMap = new WeakMap()

// 用于保存正在执行的 ReactiveEffect 类的实例
let activeEffect: ReactiveEffect

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
	 * 用于保存与当前 property 相关的方法
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

export function trigger(target, key) {
	// 获取当前响应式对象对应的 Map 实例
	const depsMap: Map<any, Set<ReactiveEffect>> = targetsMap.get(target)
	// 获取当前 property 对应的 Set 实例
	const dep: Set<ReactiveEffect> = depsMap.get(key)!

	// 遍历 dep，调用每一个 ReactiveEffect 类的实例的 run 方法
	for (const reactiveEffect of dep) {
		reactiveEffect.run()
	}
}
