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
    <main class="">
        <div v-if="user" class="flex flex-col mt-16 items-center w-screen">
            <div class="w-60 h-60 text-right relative">
                <img
                    v-if="user && user.id"
                    :src="`/api/user/${user.id}/avatar`"
                    alt="Avatar"
                    class="w-full h-full rounded-full object-cover mb-8"
                />
                <button @click="handleUploadAvatar" class="w-[30px] bottom-0 right-0 absolute">
                    <img  class="invert" src="../../public/edit.svg" alt="edit" />
                </button>
            </div>
            <div class="flex flex-col">
              <h2 class="text-blush font-semibold text-5xl mt-5 text-center">{{ user.login }}</h2>
              <button @click="changeUsername" class="text-sm opacity-60 transition-opacity hover:opacity-50 text-white">change username</button>
            </div>
        </div>
    </main>
</template>

<script lang="ts">
import axios from 'axios'
import Nav from '../components/Nav.vue'

export default {
    data() {
        return {
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
        Nav
    },
    async mounted() {
        try {
            await axios.get('http://localhost:8080/api/auth/profile').then((response) => {
                this.user = response.data
            })
        } catch (error) {
            console.log(error)
        }
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
            if (newUsername?.trim().length === 0)
                alert("The username can't be empty !")
            else {
              await axios.post('/api/user/username', {
                username: newUsername
              })
              window.location.reload()
            }
        }
    }
}
</script>
