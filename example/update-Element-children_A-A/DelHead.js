import { h, ref } from '../../lib/mini-vue3.esm.js'

const prev = [
  h('span', { key: 'A', class: 'deleted' }, 'A'),
  h('span', { key: 'B', class: 'deleted' }, 'B'),
  h('span', { key: 'C' }, 'C'),
  h('span', { key: 'D' }, 'D'),
  h('span', { key: 'E' }, 'E')
]

const next = [
  h('span', { key: 'C' }, 'C'),
  h('span', { key: 'D' }, 'D'),
  h('span', { key: 'E' }, 'E')
]

export default {
  name: 'DelHead',
  setup() {
    const isDelHead = ref(false)
    window.isDelHead = isDelHead

    return {
      isDelHead
    }
  },
  render() {
    const self = this

    return h('div', {}, self.isDelHead ? next : prev)
  }
}
