<template>
    <NavBar />
    <main v-if="doesProfileExist" class="pb-16">
        <div class="flex flex-col mt-16 items-center">
            <div class="w-60 h-60 text-right relative">
                <img
                    :src="`/api/user/${isProfileSession ? user.id : userData.id}/avatar`"
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
                    <h2 class="text-blush font-semibold text-5xl text-center">
                        {{ isProfileSession ? user.name : userData.login }}
                    </h2>
                    <div
                        v-if="isOnline == true"
                        class="ml-4 w-3 h-3 bg-green-500 rounded-full"
                    ></div>
                    <div v-else class="ml-4 w-3 h-3 bg-red-500 rounded-full"></div>
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
        <Friends :is-profile-session="isProfileSession" />
        <Blocked v-if="isProfileSession" :is-profile-session="isProfileSession" />
    </main>
    <main v-else class="flex h-screen justify-center items-center">
        <h1 class="text-5xl text-blush font-bold">Profile doesn't exist</h1>
    </main>
</template>

<script lang="ts">
import axios from 'axios'
import NavBar from '../components/NavBar.vue'
import Friends from '../components/profile/friends.vue'
import WinLosses from '@/components/profile/WinLosses.vue'
import { useChatStore } from '@/store/channel.store'
import { defineComponent } from 'vue'
import MatchHistory from '@/components/profile/MatchHistory.vue'
import { useUserStore } from '@/store/user.store'
import Blocked from '@/components/profile/blocked.vue'

export default defineComponent({
    setup() {
        const chatStore = useChatStore()
        const user = useUserStore()
        return { chatStore, user }
    },
    data() {
        return {
            isOnline: false,
            doesProfileExist: false,
            isProfileSession: false,
            userData: {
                id: 0,
                login: '',
                email: ''
            }
        }
    },
    components: {
        Blocked,
        MatchHistory,
        WinLosses,
        NavBar,
        Friends
    },
    beforeCreate() {
        axios.get('http://localhost:8080/api/user/' + this.$route.params.id).then((response) => {
            this.userData = response.data
            this.doesProfileExist = true
            if (this.user.id === Number(this.$route.params.id)) {
                this.isProfileSession = true
            }

        })
        .catch(() => {
            this.doesProfileExist = false
        })
        this.user.socket.emit('checkUserOnline', {
            userId: this.$route.params.id
        })
        this.user.socket.on('userOnline', (userId: number) => {
            if (Number(this.$route.params.id) == userId) this.isOnline = true
        })
        this.user.socket.on('userOffline', (userId: number) => {
            if (Number(this.$route.params.id) == userId) this.isOnline = false
        })
    },
    methods: {
        async handleUploadAvatar() {
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
                    } catch (error) {}
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
