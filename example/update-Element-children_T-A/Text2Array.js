import { h, ref } from '../../lib/mini-vue3.esm.js'

const prev = 'prevChild'
const next = [h('div', {}, 'nextChild1'), h('div', {}, 'nextChild2')]

export default {
  name: 'Text2Array',
  setup() {
    const isUpdateT2A = ref(false)
    window.isUpdateT2A = isUpdateT2A

    return {
      isUpdateT2A
    }
  },
  render() {
    const self = this

    return h('div', {}, self.isUpdateT2A ? next : prev)
  }
}
