import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/index.css'
import Vue3Storage, { StorageType } from 'vue3-storage'
import axios from 'axios'
import { VueCookieNext } from 'vue-cookie-next'


const app = createApp(App)
app.use(router)
  .use(VueCookieNext)
  .use(Vue3Storage, { namespace: 'session_', storage: StorageType.Session })
  .mount('#app')

VueCookieNext.config({ expire: '7d' })
