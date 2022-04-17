import { h, ref } from '../../lib/mini-vue3.esm.js'

const prev = 'prevChild'
const next = 'nextChild'

export default {
  name: 'Text2Text',
  setup() {
    const isUpdateT2T = ref(false)
    window.isUpdateT2T = isUpdateT2T

    return {
      isUpdateT2T
    }
  },
  render() {
    const self = this

    return h('div', {}, self.isUpdateT2T ? next : prev)
  }
}
