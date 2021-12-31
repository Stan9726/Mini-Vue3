import { h, getCurrentInstance } from '../../lib/mini-vue3.esm.js'

// Foo 组件选型对象
export const Foo = {
  name: 'Foo',
  setup() {
    // 获取当前组件实例对象
    const instance = getCurrentInstance()
    console.log('Foo:', instance)

    return {}
  },
  render() {
    return h('p', {}, 'Foo component')
  }
}
