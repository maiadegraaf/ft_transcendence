import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Auth from '../views/Authenticated.vue'
import Chat from '../views/Chat.vue'
import viewfour from '../views/404.vue'
import PongGame from '../views/PongGame.vue'
import axios from 'axios'
import LeaderboardView from '@/views/LeaderboardView.vue'
import PracticeMatchView from "@/views/PracticeMatchView.vue";

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
        // {
        //   path: '/:catchAll(.*)',
        //   name: '404Name',
        //   component: viewfour
        // },
        {
            path: '/Pong',
            name: 'Pong',
            component: PongGame
        },
        {
            path: '/Leaderboard',
            name: 'Leaderboard',
            component: LeaderboardView
        },
        {
            path: '/PracticeMatch',
            name: 'PracticeMatch',
            component: PracticeMatchView
        }
    ]
})

// router.beforeEach((to, from, next) => {
//   axios.get('https://api.intra.42.fr/v2/me', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       })
//       .then((response) => {
//         console.log(response.status)
//         if (response.status == 200 && to.path == '/')
//           next('/Home')
//         if (response.status == 200)
//           next()
//       })
//       .catch((error) => {
//         console.log(error)
//         if (to.path != '/')
//           next('/')
//         else
//           next()
//       })
// });

export default router
