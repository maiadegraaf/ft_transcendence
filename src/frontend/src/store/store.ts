import Vue, {computed, ref} from 'vue'
import { defineStore } from 'pinia'
import {VueCookieNext} from "vue-cookie-next";
import axios from "axios";
import {resolvePackageData} from "vite";

export const UserChatStore = defineStore('userChannel', {
    state: () => ({
        userId: null,
        userName: null,
        userChannels: null,
    }),

    getters: {
        getUserId: (state) => state.userId,
        getUserName: (state) => state.userName,
        getUserChannels: (state) => state.userChannels,
    },

    actions: {
        fetchUserData() {
            const userCookie = VueCookieNext.getCookie('user')
            if (userCookie == null) {
                // this.$router.push('/Login')
                return
            }
            // axios.get('http://localhost:8080/api/chat/' + this.userId)
            //     .then(response => {
            //         console.log(response)
            this.userId = userCookie.user.id
            this.userName = userCookie.user.name
            //         this.userChannels = response.data
            //     }).catch(error => {
            //         console.log(error)
            //     })
        }
    }
})