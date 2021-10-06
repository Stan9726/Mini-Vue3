import { effect } from '../src/effect'
import { reactive } from '../src/reactive'

describe('effect', () => {
	it('should run the passed function once (wrapped by a effect)', () => {
		// 创建 mock 函数
		const fnSpy = jest.fn(() => {})
		effect(fnSpy)
		// 当程序执行时，传入的方法会被执行
		expect(fnSpy).toHaveBeenCalledTimes(1)
	})

	it('should observe basic properties', () => {
		let dummy
		// 创建响应式对象
		const counter = reactive({ num: 0 })
		// 在传入的函数中使用了响应式对象的 property
		effect(() => (dummy = counter.num))

		expect(dummy).toBe(0)
		// 当该 property 的值更新时，会再次执行该函数
		counter.num = 7
		expect(dummy).toBe(7)
	})

	it('should return a function to be called manually', () => {
		let foo = 0
		// 用一个变量 runner 接收 effect 执行返回的函数
		const runner = effect(() => {
			foo++
			return 'foo'
		})
		expect(foo).toBe(1)
		// 调用 runner 时会再次执行传入的函数
		const res = runner()
		expect(foo).toBe(2)
		// runner 执行返回该函数的返回值
		expect(res).toBe('foo')
	})

	it('scheduler', () => {
		let dummy
		let run: number
		// 创建 mock 函数
		const scheduler = jest.fn(() => {
			run++
		})
		const obj = reactive({ foo: 1 })
		const runner = effect(
			() => {
				dummy = obj.foo
			},
			{ scheduler }
		)
		// 程序运行时会首先执行传入的函数，而不会调用 scheduler 方法
		expect(scheduler).not.toHaveBeenCalled()
		expect(dummy).toBe(1)
		// 当传入的函数依赖的响应式对象的 property 的值更新时，会调用 scheduler 方法而不会执行传入的函数
		obj.foo++
		expect(scheduler).toHaveBeenCalledTimes(1)
		expect(dummy).toBe(1)
		// 只有当调用 runner 时才会执行传入的函数
		runner()
		expect(scheduler).toHaveBeenCalledTimes(1)
		expect(dummy).toBe(2)

		obj.foo++
		expect(scheduler).toHaveBeenCalledTimes(2)
		expect(dummy).toBe(2)
	})
})
