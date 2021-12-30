import { h, renderSlots } from '../../lib/mini-vue3.esm.js'

// Baz 组件选项对象
export const Baz = {
  name: 'Baz',
  setup() {
    return {}
  },
  render() {
    const msg = 'this is a slot'

    // 通过在调用 renderSlots 函数时传入第三个参数指定传入插槽函数的参数
    return h(
      'div',
      {},
      this.$slots.content({
        msg
      })
    )
  }
}
