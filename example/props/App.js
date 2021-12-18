import { h } from '../../lib/mini-vue3.esm.js'
import { Foo } from './Foo.js'

export const App = {
  render() {
    return h(
      'div',
      {
        id: 'root'
      },
      [
        h('div', {}, 'hello, ' + this.name),
        // 创建 Foo 组件，向其中传入 count prop
        h(Foo, { count: 1 })
      ]
    )
  },
  setup() {
    return {
      name: 'mini-vue3'
    }
  }
}
