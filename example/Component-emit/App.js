import { h } from '../../lib/mini-vue3.esm.js'
import { Foo } from './Foo.js'

export const App = {
  render() {
    return h('div', {}, [
      h('div', {}, 'App'),
      h(
        Foo,
        // 使用 Foo 组件时在 props 对象中声明 onBar 方法和 onBarBaz 方法
        {
          onBar(a, b) {
            console.log('onBar', a, b)
          },
          onBarBaz(c, d) {
            console.log('onBarBaz', c, d)
          }
        }
      )
    ])
  },
  setup() {
    return {}
  }
}
