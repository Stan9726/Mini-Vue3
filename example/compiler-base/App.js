import { ref } from '../../lib/mini-vue3.esm.js'

export const App = {
  name: 'App',
  template: `<div>{{greeting}}, mini-vue3</div>`,
  setup() {
    const greeting = ref('hi')

    window.sayGoodBye = () => {
      greeting.value = 'bye'
    }

    return { greeting }
  }
}
