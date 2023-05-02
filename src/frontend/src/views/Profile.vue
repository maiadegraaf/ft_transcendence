<!-- TO DO 
- fix the XML parsing error when avatar image gets uploaded
- age refreshes automaticaly when avatarfix that p image gets uploaded
- Stats (such as: wins and losses, ladder level, achievements, and so forth) have to
be displayed on the user profile -->
<!-- - Make a friend list and possible to click on a friend username to show their profile Page
- Need to implement that the username cannot be similar to another user
- If so, say: "Username already exists, please choose another one" -->

<template>
    <Nav />
    <main v-if="doesProfileExist">
        <div class="flex flex-col mt-16 items-center w-screen">
            <div class="w-60 h-60 text-right relative">
                <img
                    :src="`/api/user/${user.id}/avatar`"
                    alt="Avatar"
                    class="w-full h-full rounded-full object-cover mb-8"
                />
                <button
                    v-if="isProfileSession"
                    @click="handleUploadAvatar"
                    class="w-[30px] bottom-0 opacity-60 transition-opacity hover:opacity-50 right-0 absolute"
                >
                    <img class="invert" src="../../public/edit.svg" alt="edit" />
                </button>
            </div>
            <div class="flex flex-col">
                <div class="flex justify-center items-center mt-5">
                    <h2 class="text-blush font-semibold text-5xl text-center">{{ user.login }}</h2>
                    <svg class="ml-3" height="20" width="20">
                        <circle
                            cx="10"
                            cy="10"
                            r="4"
                            :stroke="isOnline ? 'green' : 'red'"
                            stroke-width="3"
                            :fill="isOnline ? 'green' : 'red'"
                        />
                    </svg>
                </div>
                <button
                    v-if="isProfileSession"
                    @click="changeUsername"
                    class="text-sm opacity-60 transition-opacity hover:opacity-50 text-white"
                >
                    change username
                </button>
            </div>
        </div>
        <WinLosses />
        <MatchHistory />
    </main>
    <main v-else class="flex h-screen justify-center items-center">
        <h1 class="text-5xl text-blush font-bold">Profile doesn't exist</h1>
    </main>
</template>

<script lang="ts">
import axios from 'axios'
import Nav from '../components/Nav.vue'
import WinLosses from '@/components/profile/WinLosses.vue'
import { useChatStore } from '@/store/channel.store'
import {defineComponent} from "vue";
import MatchHistory from '@/components/profile/MatchHistory.vue'


export default defineComponent({
    setup() {
        const chatStore = useChatStore()
        return { chatStore }
    },
    data() {
        return {
            isOnline: false,
            currentUserId: 0,
            doesProfileExist: false,
            isProfileSession: false,
            user: {
                id: 0,
                login: ' ',
                email: ' ',
                isTwoFactorAuthenticationEnabled: false,
                accessToken: ' ',
                refreshToken: ' ',
                newPic: false
            }
        }
    },
    components: {
        MatchHistory,
        WinLosses,
        Nav
    },
    async mounted() {
        try {
            await axios.get('http://localhost:8080/api/auth/profile').then((response) => {
                this.currentUserId = response.data.id
            })
            await axios
                .get('http://localhost:8080/api/user/' + this.$route.params.id)
                .then((response) => {
                    this.user = response.data
                    this.doesProfileExist = true
                    if (this.currentUserId === Number(this.$route.params.id))
                        this.isProfileSession = true
                })
        } catch (error) {
            console.log(error)
        }
        this.chatStore.socket.emit('checkUserOnline', {
            userId: this.$route.params.id
        })
        this.chatStore.socket.on('userOnline', () => {
            this.isOnline = true
        })
        this.chatStore.socket.on('userOffline', () => {
            this.isOnline = false
        })
        console.log(this.isOnline)
    },
    methods: {
        async handleUploadAvatar() {
            this.user.newPic = true
            const fileInput = document.createElement('input')
            fileInput.type = 'file'

            fileInput.addEventListener('change', async () => {
                const file = fileInput.files?.[0]
                if (file) {
                    const formData = new FormData()
                    formData.append('file', file)
                    const config = {
                        headers: { 'content-type': 'multipart/form-data' }
                    }
                    try {
                        await axios.put(
                            `http://localhost:8080/api/user/${this.user.id}/avatar`,
                            formData,
                            config
                        )
                        this.user = { ...this.user }
                        window.location.reload()
                    } catch (error) {
                        console.log(error)
                    }
                }
            })
            fileInput.click()
        },
        async changeUsername() {
            const newUsername = prompt('Enter new username')
            if (newUsername?.trim().length === 0) alert("The username can't be empty !")
            else {
                await axios.post('/api/user/username', {
                    username: newUsername
                })
                window.location.reload()
            }
        }
    }
})
</script>
