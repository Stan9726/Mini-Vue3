import { h } from '../../lib/mini-vue3.esm.js'
import { Bar } from './Bar.js'
import { Baz } from './Baz.js'
import { Foo } from './Foo.js'

export const App = {
  name: 'App',
  setup() {
    return {}
  },
  render() {
    // 传入一个 VNode 作为插槽
    // return h(Foo, {}, h('p', {}, 'a slot'))
    // 传入一个 VNode 数组，数组中每一项为一个插槽
    // return h(Foo, {}, [h('p', {}, 'a slot'), h('p', {}, 'another slot')])
    // 传入一个对象，对象中每个 property 为一个插槽
    // return h(
    //   Bar,
    //   {},
    //   {
    //     header: h('p', {}, 'header slot'),
    //     footer: h('p', {}, 'footer slot')
    //   }
    // )
    // 传入一个对象，对象中方法为创建插槽的函数
    return h(
      Baz,
      {},
      {
        content: props => h('p', {}, 'content: ' + props.msg)
      }
    )
  }
}
