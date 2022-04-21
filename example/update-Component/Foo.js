import { h } from '../../lib/mini-vue3.esm.js'

// Foo 组件选项对象
export const Foo = {
  name: 'Foo',
  setup() {
    return {}
  },
  render() {
    // 通过 this.$props 获取 props 对象
    return h('div', {}, `Foo Component count: ${this.$props.count}`)
  }
}
