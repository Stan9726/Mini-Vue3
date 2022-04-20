import { h } from '../../lib/mini-vue3.esm.js'

import AddHead from './AddHead.js'
import AddTail from './AddTail.js'
import DelHead from './DelHead.js'
import DelTail from './DelTail.js'
import DelMid from './DelMid.js'
import AddMid from './AddMid.js'
import MoveMid from './MoveMid.js'
import Array2Array from './Array2Array.js'

export const App = {
  name: 'App',
  setup() {
    const onAddHead = () => {
      // 触发 AddHead 组件中 Element 的更新
      window.isAddHead.value = true
    }

    const onAddTail = () => {
      // 触发 AddTail 组件中 Element 的更新
      window.isAddTail.value = true
    }

    const onAddMid = () => {
      // 触发 AddMid 组件中 Element 的更新
      window.isAddMid.value = true
    }

    const onDelHead = () => {
      // 触发 DelHead 组件中 Element 的更新
      window.isDelHead.value = true
    }

    const onDelTail = () => {
      // 触发 DelTail 组件中 Element 的更新
      window.isDelTail.value = true
    }

    const onDelMid = () => {
      // 触发 DelMid 组件中 Element 的更新
      window.isDelMid.value = true
    }

    const onMoveMid = () => {
      // 触发 MoveMid 组件中 Element 的更新
      window.isMoveMid.value = true
    }

    const onUpdateA2A = () => {
      // 触发 Array2Array 组件中 Element 的更新
      window.isUpdateA2A.value = true
    }

    return {
      onAddHead,
      onAddTail,
      onAddMid,
      onDelHead,
      onDelTail,
      onDelMid,
      onMoveMid,
      onUpdateA2A
    }
  },
  render() {
    return h('div', { class: 'container' }, [
      // AddHead 的测试
      h('div', { class: 'demo add-head' }, [
        // AddHead 组件
        h(AddHead),
        h(
          'button',
          {
            onCLick: this.onAddHead
          },
          'AddHead'
        )
      ]),
      // AddTail 的测试
      h('div', { class: 'demo add-tail' }, [
        // AddTail 组件
        h(AddTail),
        h(
          'button',
          {
            onCLick: this.onAddTail
          },
          'AddTail'
        )
      ]),
      // AddMid 的测试
      h('div', { class: 'demo add-mid' }, [
        // AddMid 组件
        h(AddMid),
        h(
          'button',
          {
            onCLick: this.onAddMid
          },
          'AddMid'
        )
      ]),
      // DelHead 的测试
      h('div', { class: 'demo del-head' }, [
        // DelHead 组件
        h(DelHead),
        h(
          'button',
          {
            onCLick: this.onDelHead
          },
          'DelHead'
        )
      ]),
      // DelTail 的测试
      h('div', { class: 'demo del-tail' }, [
        // DelTail 组件
        h(DelTail),
        h(
          'button',
          {
            onCLick: this.onDelTail
          },
          'DelTail'
        )
      ]),
      // DelMid 的测试
      h('div', { class: 'demo del-mid' }, [
        // DelMid 组件
        h(DelMid),
        h(
          'button',
          {
            onCLick: this.onDelMid
          },
          'DelMid'
        )
      ]),
      // MoveMid 的测试
      h('div', { class: 'demo move-mid' }, [
        // MoveMid 组件
        h(MoveMid),
        h(
          'button',
          {
            onCLick: this.onMoveMid
          },
          'MoveMid'
        )
      ]),
      // Array2Array 的测试
      h('div', { class: 'demo array2array' }, [
        // Array2Array 组件
        h(Array2Array),
        h(
          'button',
          {
            onCLick: this.onUpdateA2A
          },
          'Arr2Arr'
        )
      ])
    ])
  }
}
