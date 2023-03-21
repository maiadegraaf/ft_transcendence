import { createApp } from 'vue'
import App from "./App.vue"
import router from './router'
import './assets/index.css'

export default {
    name: "app",
    components: {
        App,
    },
};

const app = createApp(App)
app.use(router).mount('#app')