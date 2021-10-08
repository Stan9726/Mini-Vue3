import { isProxy, isReactive, reactive } from '../src/reactive'

describe('reactivity/reactive', () => {
	it('Object', () => {
		const original = { foo: 1 }
		// 创建响应式对象
		const observed = reactive(original)
		// 响应式对象与原始对象不相等
		expect(observed).not.toBe(original)
		// 对响应式对象调用 isReactive 返回 true
		expect(isReactive(observed)).toBe(true)
		// 对普通对象调用 isReactive 返回 false
		expect(isReactive(original)).toBe(false)
		// 对响应式对象调用 isProxy 返回 true
		expect(isProxy(observed)).toBe(true)
		// 对普通对象调用 isProxy 返回 false
		expect(isProxy(original)).toBe(false)
		// 响应式对象的 property 的值与原始对象的相等
		expect(observed.foo).toBe(1)
	})

	it('nested reactives', () => {
		const original = { foo: { bar: 1 } }
		const observed = reactive(original)
    // 嵌套对象是响应式的
		expect(isReactive(observed.foo)).toBe(true)
	})
})
