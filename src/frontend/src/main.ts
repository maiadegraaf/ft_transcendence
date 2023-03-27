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

const app = createApp(App)
app
  .use(router)
  .use(Vue3Storage, { namespace: 'session_', storage: StorageType.Session })
  .mount('#app')
