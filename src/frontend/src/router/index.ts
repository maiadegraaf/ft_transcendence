import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../components/Login.vue'
import Auth from '../views/Authenticated.vue'
import Chat from '../components/Chat_al.vue'
import viewfour from '../views/404.vue'
import PongGame from '../views/PongGame.vue'

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

export default router