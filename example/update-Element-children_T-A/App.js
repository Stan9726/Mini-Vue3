import { h } from '../../lib/mini-vue3.esm.js'

import Array2Text from './Array2Text.js'
import Text2Text from './Text2Text.js'
import Text2Array from './Text2Array.js'

export const App = {
  name: 'App',
  setup() {
    const onUpdateA2T = () => {
      // 触发 Array2Text 组件中 Element 的更新
      window.isUpdateA2T.value = true
    }

    const onUpdateT2T = () => {
      // 触发 Text2Text 组件中 Element 的更新
      window.isUpdateT2T.value = true
    }

    const onUpdateT2A = () => {
      // 触发 Text2Array 组件中 Element 的更新
      window.isUpdateT2A.value = true
    }

    return { onUpdateA2T, onUpdateT2T, onUpdateT2A }
  },
  render() {
    return h('div', { class: 'container' }, [
      // Array2Text 的测试
      h('div', { class: 'demo demo-array2text' }, [
        // Array2Text 组件
        h(Array2Text),
        h(
          'button',
          {
            onCLick: this.onUpdateA2T
          },
          'Array2Text'
        )
      ]),
      // Text2Text 的测试
      h('div', { class: 'demo demo-text2text' }, [
        // Text2Text 组件
        h(Text2Text),
        h(
          'button',
          {
            onCLick: this.onUpdateT2T
          },
          'Text2Text'
        )
      ]),
      // Text2Array 的测试
      h('div', { class: 'demo demo-text2array' }, [
        // Text2Array 组件
        h(Text2Array),
        h(
          'button',
          {
            onCLick: this.onUpdateT2A
          },
          'Text2Array'
        )
      ])
    ])
  }
}
