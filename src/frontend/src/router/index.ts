import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../components/Login.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/Home',
      name: 'Home',
      component: () => Home
    },
    {
      path: '/',
      name: 'Login',
      component: () => Login
    }
  ]
})

export default router