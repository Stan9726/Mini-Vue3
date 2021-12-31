import { h, getCurrentInstance } from '../../lib/mini-vue3.esm.js'
import { Foo } from './Foo.js'

export const App = {
  name: 'App',
  setup() {
    // 获取当前组件实例对象
    const instance = getCurrentInstance()
    console.log('App:', instance)

    return {}
  },
  render() {
    return h(Foo)
  }
}
