import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Auth from '../views/Authenticated.vue'
import Chat from '../views/Chat.vue'
import viewfour from '../views/404.vue'
import PongGame from '../views/PongGame.vue'
import TwoFA from '../views/2fa.vue'
import TwoFACreate from '../views/2fa.create.vue'
import axios from 'axios'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/Home',
            name: 'Home',
            component: Home
        },
        {
            path: '/Authenticated',
            name: 'Authenticated',
            component: Auth
        },
        {
            path: '/',
            name: 'Login',
            component: Login
        },
        {
            path: '/Chat',
            name: 'Chat',
            component: Chat
        },
        {
            path: '/2fa',
            name: '2fa',
            component: TwoFA
        },
        {
            path: '/2fa/create',
            name: '2fa_create',
            component: TwoFACreate
        },
        {
            path: '/:catchAll(.*)',
            name: '404Name',
            component: viewfour
        },
        {
            path: '/Pong',
            name: 'Pong',
            component: PongGame
        }
    ]
})

router.beforeEach((to, from, next) => {
  axios.get('/api/auth/profile')
      .then((response) => {
            if (response.status == 200 && to.path == '/')
              next('/Home')
            if (response.status == 200)
              next()
      })
      .catch((error) => {
        console.log(error)
        if (to.path != '/' && to.path != '/2fa/create')
          next('/')
        else
          next()
      })
});

export default router
