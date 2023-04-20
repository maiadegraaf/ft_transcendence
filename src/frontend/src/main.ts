import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/index.css'
import { VueCookieNext } from 'vue-cookie-next'

export default {
    name: 'app',
    components: {
        App
    }
}

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import {createPinia} from "pinia";

const store = createPinia()

const app = createApp(App)

app
  .use(router)
  .use(VueCookieNext)
  .use(store)
  .mount('#app')

VueCookieNext.config({ expire: '7d' })
