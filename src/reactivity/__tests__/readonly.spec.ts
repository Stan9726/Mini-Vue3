import { readonly } from "../src/reactive"

describe('reactivity/readonly', () => {
	it('should make values readonly', () => {
		const original = { foo: 1 }
    // 创建 readonly 响应式对象
		const wrapped = readonly(original)
    console.warn = jest.fn()
    // readonly 响应式对象与原始对象不相等
		expect(wrapped).not.toBe(original)
		expect(wrapped.foo).toBe(1)
    // readonly 响应式对象的 property 是只读的
    wrapped.foo = 2
    expect(wrapped.foo).toBe(1)
    // 修改 readonly 响应式对象的 property 的值时会调用 console.warn 发出警告
    expect(console.warn).toBeCalled()
	})
})
