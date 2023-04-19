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
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import {createPinia} from "pinia";

const vuetify = createVuetify({
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        }
    },
    components,
    directives,
})

const pinia = createPinia()

const app = createApp(App)

app
  .use(router)
  .use(vuetify)
  .use(VueCookieNext)
  .use(pinia)
  .mount('#app')

VueCookieNext.config({ expire: '7d' })
