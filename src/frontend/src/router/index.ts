import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'
import Login from '../views/Login.vue'
import Auth from '../views/Authenticated.vue'
import Chat from '../views/Chat.vue'
import viewfour from '../views/404.vue'
import PongGame from '../views/PongGame.vue'
import TwoFA from '../views/2fa.vue'
import TwoFACreate from '../views/2fa.create.vue'
import axios from 'axios'
import LeaderboardView from '@/views/LeaderboardView.vue'
import Username from '@/views/Username.vue'
import WaitingOpponent from '@/views/WaitingOpponent.vue'

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
            path: '/wait/:senderId/:opponentId',
            name: 'wait',
            component: WaitingOpponent,
            props: true
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
        },
        {
            path: '/Leaderboard',
            name: 'Leaderboard',
            component: LeaderboardView
        },
        {
            path: '/ChooseUsername',
            name: 'ChooseUsername',
            component: Username
        },
        {
            path: '/Profile/:id',
            name: 'Profile',
            component: Profile,
            props: true
        }
    ]
})

export default router
