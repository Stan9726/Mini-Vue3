import { h, ref } from '../../lib/mini-vue3.esm.js'

const prev = [
  h('span', { key: 'A' }, 'A'),
  h('span', { key: 'B' }, 'B'),
  h('span', { key: 'C' }, 'C')
]

const next = [
  h('span', { key: 'A' }, 'A'),
  h('span', { key: 'B' }, 'B'),
  h('span', { key: 'C' }, 'C'),
  h('span', { key: 'X', class: 'added' }, 'X'),
  h('span', { key: 'Y', class: 'added' }, 'Y')
]

export default {
  name: 'AddTail',
  setup() {
    const isAddTail = ref(false)
    window.isAddTail = isAddTail

    return {
      isAddTail
    }
  },
  render() {
    const self = this

    return h('div', {}, self.isAddTail ? next : prev)
  }
}
