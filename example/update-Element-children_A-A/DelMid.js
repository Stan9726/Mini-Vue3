import { h, ref } from '../../lib/mini-vue3.esm.js'

const prev = [
  h('span', { key: 'A' }, 'A'),
  h('span', { key: 'B' }, 'B'),
  h('span', { key: 'C', class: 'deleted' }, 'C'),
  h('span', { key: 'D', class: 'deleted' }, 'D'),
  h('span', { key: 'E' }, 'E'),
  h('span', { key: 'F' }, 'F')
]

const next = [
  h('span', { key: 'A' }, 'A'),
  h('span', { key: 'B' }, 'B'),
  h('span', { key: 'E' }, 'E'),
  h('span', { key: 'F' }, 'F')
]

export default {
  name: 'DelMid',
  setup() {
    const isDelMid = ref(false)
    window.isDelMid = isDelMid

    return {
      isDelMid
    }
  },
  render() {
    const self = this

    return h('div', {}, self.isDelMid ? next : prev)
  }
}
