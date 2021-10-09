import { effect } from '../src/effect'
import { ref } from '../src/ref'

describe('reactivity/ref', () => {
	it('should hold a value', () => {
		// 创建 ref 对象
		const a = ref(1)
		// ref 对象的 value property 的值等于传入的值
		expect(a.value).toBe(1)
		// ref 对象的 value property 的值是可变的
		a.value = 2
		expect(a.value).toBe(2)
	})

	it('should be reactive', () => {
		const a = ref(1)
		let dummy
		let calls = 0
		effect(() => {
			calls++
			dummy = a.value
		})
		expect(calls).toBe(1)
		expect(dummy).toBe(1)
		// ref 对象是响应式的
		a.value = 2
		expect(calls).toBe(2)
		expect(dummy).toBe(2)
		// ref 对象的 value property 的 set 具有缓存，不会重复触发依赖
		a.value = 2
		expect(calls).toBe(2)
		expect(dummy).toBe(2)
	})

	it('should make nested properties reactive', () => {
		const a = ref({
			count: 1
		})
		let dummy
		effect(() => {
			dummy = a.value.count
		})
		expect(dummy).toBe(1)
    // ref 对象的 value property 的是一个响应式对象
		a.value.count = 2
		expect(dummy).toBe(2)
	})
})
