import { createApp } from '../../lib/mini-vue3.esm.js'
import { App } from './App.js.js'

const rootContainer = document.querySelector('#app')
const app = createApp(App)
app.mount(rootContainer)
