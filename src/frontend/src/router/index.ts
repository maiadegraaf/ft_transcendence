import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../components/Login.vue'
import Auth from '../views/Authenticated.vue'



const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/Home',
      name: 'Home',
      component: () => Home
    },
    {
      path: '/Authenticated',
      name: 'Authenticated',
      component: () => Auth
    },
    {
      path: '/',
      name: 'Login',
      component: () => Login
    }
  ]
})

export default router