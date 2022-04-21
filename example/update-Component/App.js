import { h, ref } from '../../lib/mini-vue3.esm.js'
import { Foo } from './Foo.js'

export const App = {
  name: 'App',
  setup() {
    // 响应式数据
    const fooCount = ref(0)
    // 响应式数据
    const count = ref(0)

    const onChangeFooProps = () => {
      // 修改响应式数据
      fooCount.value++
    }

    const onChangeCount = () => {
      // 修改响应式数据
      count.value++
    }

    return { fooCount, count, onChangeFooProps, onChangeCount }
  },
  render() {
    return h('div', {}, [
      h(Foo, {
        // 创建 Foo 组件，向其中传入 count prop
        count: this.fooCount
      }),
      h(
        'button',
        {
          onClick: this.onChangeFooProps
        },
        'change Foo count'
      ),
      h('div', {}, 'count: ' + this.count),
      h(
        'button',
        {
          onClick: this.onChangeCount
        },
        'change count'
      )
    ])
  }
}
