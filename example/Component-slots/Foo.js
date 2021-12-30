import { h, renderSlots } from '../../lib/mini-vue3.esm.js'

// Foo 组件选项对象
export const Foo = {
  name: 'Foo',
  setup() {
    return {}
  },
  render() {
    // 通过 this.$slots 获取父组件传递的插槽
    return h('div', {}, [h('p', {}, 'Foo component'), renderSlots(this.$slots)])
  }
}
