import { h, ref } from '../../lib/mini-vue3.esm.js'

const prev = [
  h('span', { key: 'A' }, 'A'),
  h('span', { key: 'B' }, 'B'),
  h('span', { key: 'C' }, 'C'),
  h('span', { key: 'D' }, 'D')
]

const next = [
  h('span', { key: 'A' }, 'A'),
  h('span', { key: 'B' }, 'B'),
  h('span', { key: 'X', class: 'added' }, 'X'),
  h('span', { key: 'Y', class: 'added' }, 'Y'),
  h('span', { key: 'C' }, 'C'),
  h('span', { key: 'D' }, 'D')
]

export default {
  name: 'AddMid',
  setup() {
    const isAddMid = ref(false)
    window.isAddMid = isAddMid

    return {
      isAddMid
    }
  },
  render() {
    const self = this

    return h('div', {}, self.isAddMid ? next : prev)
  }
}
