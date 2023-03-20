import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/index.css'

const app = createApp(App)

// use router
app.use(router)
app.mount('#app')
