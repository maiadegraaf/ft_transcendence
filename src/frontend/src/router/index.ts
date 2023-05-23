import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'
import Login from '../views/Login.vue'
import ChatView from '../views/ChatView.vue'
import viewfour from '../views/404.vue'
import PongGame from '../views/PongGame.vue'
import TwoFA from '../views/2fa.vue'
import TwoFACreate from '../views/2fa.create.vue'
import LeaderboardView from '@/views/LeaderboardView.vue'
import Username from '@/views/Username.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/Home',
            name: 'Home',
            component: Home
        },
        {
            path: '/',
            name: 'Login',
            component: Login
        },
        {
            path: '/Chat',
            name: 'Chat',
            component: ChatView
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
            path: '/Pong/:matchid',
            name: 'Pong',
            component: PongGame,
            props: true
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
