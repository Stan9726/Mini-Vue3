import { reactive } from "../src/reactive"

describe('reactivity/reactive', () => {
  it('Object', () => {
    const original = { foo: 1 }
    // 创建响应式对象
    const observed = reactive(original)
    // 响应式对象与原始对象不相等
    expect(observed).not.toBe(original)
    // 响应式对象的 property 的值与原始对象的相等
    expect(observed.foo).toBe(1)
  })
})