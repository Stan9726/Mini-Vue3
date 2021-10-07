import { readonly } from "../src/reactive"

describe('reactivity/readonly', () => {
	it('should make values readonly', () => {
		const original = { foo: 1 }
		const wrapped = readonly(original)
		expect(wrapped).not.toBe(original)
		expect(wrapped.foo).toBe(1)
    wrapped.foo = 2
    expect(wrapped.foo).toBe(1)
	})
})
