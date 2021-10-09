import { extend } from './../../shared/index'
// 用于记录是否应该收集依赖，防止调用 stop 后触发响应式对象的 property 的 get 时收集依赖
let shouldTrack: boolean = false

// 抽离出一个 ReactiveEffect 类，对操作进行封装
class ReactiveEffect {
	private _fn: any
	// 用于保存与当前实例相关的响应式对象的 property 对应的 Set 实例
	deps: Array<Set<ReactiveEffect>> = []
	// 用于记录当前实例状态，为 true 时未调用 stop 方法，否则已调用，防止重复调用 stop 方法
	active: boolean = true
	// 用于保存当前实例的 onStop 方法
	onStop?: () => void

	// 构造函数接收可选的第二个参数，保存为实例的公共变量 scheduler
	constructor(fn, public scheduler?) {
		// 将传入的函数赋值给实例的私有 property _fn
		this._fn = fn
	}

	// 用于执行传入的函数
	run() {
		// 若已调用 stop 方法则直接返回传入的函数执行的结果
		if (!this.active) {
			return this._fn()
		}

		// 应该收集依赖
		shouldTrack = true
		// 调用 run 方法时，用全局变量 activeEffect 保存当前实例
		activeEffect = this

		const res = this._fn()
		// 重置
		shouldTrack = false

		// 返回传入的函数执行的结果
		return res
	}

	// 用于停止传入的函数的执行
	stop() {
		if (this.active) {
			cleanupEffect(this)
			// 在调用 stop 方法时，调用 onStop 方法
			if (this.onStop) {
				this.onStop()
			}
			this.active = false
		}
	}
}

// 用于将传入的 ReactiveEffect 类的实例从与该实例相关的响应式对象的 property 对应的 Set 实例中删除
function cleanupEffect(effect: ReactiveEffect) {
	effect.deps.forEach((dep: any) => {
		dep.delete(effect)
	})
}

// 接收一个函数作为第一个参数，接收一个对象作为第二个参数
export function effect(fn, options: any = {}) {
	// 利用传入的函数创建 ReactiveEffect 类的实例，并将 scheduler 方法传给 ReactiveEffect 类的构造函数
	const _effect: ReactiveEffect = new ReactiveEffect(fn, options.scheduler)
	// 将第二个参数即 options 对象的属性和方法赋值给 ReactiveEffect 类的实例
	extend(_effect, options)

	// 调用 ReactiveEffect 实例的 run 方法，执行传入的函数
	_effect.run()

	// 用一个变量 runner 保存将 _effect.run 的 this 指向指定为 _effect 的结果
	const runner: any = _effect.run.bind(_effect)
	// 将 _effect 赋值给 runner 的 effect property
	runner.effect = _effect

	// 返回 runner
	return runner
}

/**
 * 用于保存程序运行中的所有依赖
 * key 为响应式对象
 * value 为 Map 的实例，用于保存该响应式对象的所有依赖
 */
const targetsMap = new WeakMap()

// 用于保存正在执行的 ReactiveEffect 类的实例
let activeEffect: ReactiveEffect | undefined

// 用于收集依赖
export function track(target, key) {
	// 若不应该收集依赖则直接返回
	if (!isTracking()) {
		return
	}

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

	trackEffects(dep)
}

// 用于判断是否应该收集依赖
export function isTracking() {
	return shouldTrack && activeEffect !== undefined
}

// 用于将当前正在执行的 ReactiveEffect 类的实例添加到 dep 中， 同时将 dep 添加到当前正在执行的 ReactiveEffect 类的实例的 deps property 中
export function trackEffects(dep) {
	// 若 dep 中包括当前正在执行的 ReactiveEffect 类的实例则直接返回
	if (dep.has(activeEffect!)) {
		return
	}

	// 将当前正在执行的 ReactiveEffect 类的实例添加到 dep 中
	dep.add(activeEffect!)
	// 将 dep 添加到当前正在执行的 ReactiveEffect 类的实例的 deps property 中
	activeEffect?.deps.push(dep)
}

// 用于触发依赖
export function trigger(target, key) {
	// 获取当前响应式对象对应的 Map 实例
	const depsMap: Map<any, Set<ReactiveEffect>> = targetsMap.get(target)
	// 获取当前 property 对应的 Set 实例
	const dep: Set<ReactiveEffect> = depsMap.get(key)!

	triggerEffects(dep)
}

// 用于遍历 dep，调用每一个 ReactiveEffect 类的实例的 scheduler 方法或 run 方法
export function triggerEffects(dep) {
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

// 用于停止传入的函数的执行
export function stop(runner) {
	// 调用 runner 的 effect property 的 stop 方法
	runner.effect.stop()
}
