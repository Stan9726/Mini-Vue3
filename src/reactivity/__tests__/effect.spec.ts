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
		// 在传入的方法中使用了响应式对象的 property
		effect(() => (dummy = counter.num))

		expect(dummy).toBe(0)
		// 当该 property 的值更新时，会再次执行传入的方法
		counter.num = 7
		expect(dummy).toBe(7)
	})
})
