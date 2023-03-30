import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/index.css'
// @ts-ignore
import Vue3Storage, { StorageType } from 'vue3-storage'
import axios from 'axios'
import VueCookies from 'vue-cookies'

export default {
  name: 'app',
  components: {
    App
  }
}

const app = createApp(App)
app
  .use(router)
  .use(VueCookies)
  .use(Vue3Storage, { namespace: 'session_', storage: StorageType.Session })
  .mount('#app')

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
