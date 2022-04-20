import { h, ref } from '../../lib/mini-vue3.esm.js'

const prev = [
  h('span', { key: 'A' }, 'A'),
  h('span', { key: 'B' }, 'B'),
  h('span', { key: 'C' }, 'C'),
  h('span', { key: 'D', class: 'deleted' }, 'D'),
  h('span', { key: 'E', class: 'deleted' }, 'E')
]

const next = [
  h('span', { key: 'A' }, 'A'),
  h('span', { key: 'B' }, 'B'),
  h('span', { key: 'C' }, 'C')
]

export default {
  name: 'DelTail',
  setup() {
    const isDelTail = ref(false)
    window.isDelTail = isDelTail

    return {
      isDelTail
    }
  },
  render() {
    const self = this

    return h('div', {}, self.isDelTail ? next : prev)
  }
}
