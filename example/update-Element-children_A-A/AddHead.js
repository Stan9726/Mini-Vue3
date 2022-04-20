import { h, ref } from '../../lib/mini-vue3.esm.js'

const prev = [
  h('span', { key: 'A' }, 'A'),
  h('span', { key: 'B' }, 'B'),
  h('span', { key: 'C' }, 'C')
]

const next = [
  h('span', { key: 'X', class: 'added' }, 'X'),
  h('span', { key: 'Y', class: 'added' }, 'Y'),
  h('span', { key: 'A' }, 'A'),
  h('span', { key: 'B' }, 'B'),
  h('span', { key: 'C' }, 'C')
]

export default {
  name: 'AddHead',
  setup() {
    const isAddHead = ref(false)
    window.isAddHead = isAddHead

    return {
      isAddHead
    }
  },
  render() {
    const self = this

    return h('div', {}, self.isAddHead ? next : prev)
  }
}
