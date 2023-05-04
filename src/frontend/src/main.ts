import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/index.css'

export default {
    name: 'app',
    components: {
        App
    }
}

import {createPinia} from "pinia";

const store = createPinia()

const app = createApp(App)

app
  .use(router)
  .use(store)
  .mount('#app')
