import { isProxy, isReactive, isReadonly, readonly } from '../src/reactive'

describe('reactivity/readonly', () => {
  it('should make values readonly', () => {
    const original = { foo: 1 }
    // 创建 readonly 响应式对象
    const wrapped = readonly(original)
    console.warn = jest.fn()
    // readonly 响应式对象与原始对象不相等
    expect(wrapped).not.toBe(original)
    // 对 readonly 响应式对象调用 isReactive 返回 false
    expect(isReactive(wrapped)).toBe(false)
    // 对 readonly 响应式对象调用 isReadonly 返回 true
    expect(isReadonly(wrapped)).toBe(true)
    // 对普通对象调用 isReactive 返回 false
    expect(isReactive(original)).toBe(false)
    // 对普通对象调用 isReadonly 返回 false
    expect(isReadonly(original)).toBe(false)
    // 对 readonly 响应式对象调用 isProxy 返回 true
    expect(isProxy(wrapped)).toBe(true)
    // 对普通对象调用 isProxy 返回 false
    expect(isProxy(original)).toBe(false)
    expect(wrapped.foo).toBe(1)
    // readonly 响应式对象的 property 是只读的
    wrapped.foo = 2
    expect(wrapped.foo).toBe(1)
    // 修改 readonly 响应式对象的 property 的值时会调用 console.warn 发出警告
    expect(console.warn).toBeCalled()
  })

  it('should make nested values readonly', () => {
    const original = { foo: { bar: 1 } }
    const wrapped = readonly(original)
    // 嵌套对象是响应式的
    expect(isReadonly(wrapped.foo)).toBe(true)
  })
})
