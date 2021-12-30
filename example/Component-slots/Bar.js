import { h, renderSlots } from '../../lib/mini-vue3.esm.js'

// Bar 组件选项对象
export const Bar = {
  name: 'Bar',
  setup() {},
  render() {
    return h('div', {}, [
      // 通过在调用 renderSlots 函数时传入第二个参数指定在此位置渲染的插槽
      renderSlots(this.$slots, 'header'),
      h('p', {}, 'Bar component'),
      renderSlots(this.$slots, 'footer')
    ])
  }
}
