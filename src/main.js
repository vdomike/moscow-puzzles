import 'vue-universal-modal/dist/index.css'
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import VueKonva from 'vue-konva'
import VueUniversalModal from 'vue-universal-modal'

const app = createApp(App)
app.use(VueKonva)
app.use(VueUniversalModal, {
  teleportTarget: '#modal'
})
app.mount('#app')
