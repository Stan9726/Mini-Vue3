import { h } from '../../lib/mini-vue3.esm.js'

window.self = null
// 根组件选项对象
export const App = {
  // render 函数
  render() {
    window.self = this
    // 在 render 函数中通过 this 获取 setup 返回对象的 property
    return h('div', {}, 'hello, ' + this.name)
    // return h('div', { id: 'root', class: 'root' }, [
    // 	h('p', { id: 'p1', class: 'p1' }, 'hello, mini-vue3'),
    // 	h('p', { id: 'p2', class: 'p2' }, 'this is mini-vue3')
    // ])
  },
  // composition API
  setup() {
    // 返回一个对象
    return {
      name: 'mini-vue3'
    }
  }
}
