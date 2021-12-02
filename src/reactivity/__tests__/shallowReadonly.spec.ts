import { isReactive, shallowReadonly } from '../src/reactive'

describe('reactivity/shallowReadonly', () => {
  test('should not make non-reactive properties reactive', () => {
    const props = shallowReadonly({ n: { foo: 1 } })
    expect(isReactive(props.n)).toBe(false)
  })
})
