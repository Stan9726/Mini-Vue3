import { h, ref } from '../../lib/mini-vue3.esm.js'

const prev = [h('div', {}, 'prevChild1'), h('div', {}, 'prevChild2')]
const next = 'nextChild'

export default {
  name: 'Array2Text',
  setup() {
    const isUpdateA2T = ref(false)
    window.isUpdateA2T = isUpdateA2T

    return { isUpdateA2T }
  },
  render() {
    const self = this

    return h('div', {}, self.isUpdateA2T ? next : prev)
  }
}
