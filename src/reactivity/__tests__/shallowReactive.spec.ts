import { isReactive, shallowReactive } from '../src/reactive'

describe('shallowReactive', () => {
  test('should not make non-reactive properties reactive', () => {
    const props = shallowReactive({ n: { foo: 1 } })
    expect(isReactive(props.n)).toBe(false)
  })
})
