import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/index.css'
// @ts-ignore
import Vue3Storage, { StorageType } from 'vue3-storage'

export default {
  name: 'app',
  components: {
    App
  }
}

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
})

const app = createApp(App)
app
  .use(router)
  .use(Vue3Storage, { namespace: 'session_', storage: StorageType.Session })
  .use(vuetify)
  .mount('#app')
