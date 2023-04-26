<!-- TO DO 
- fix the XML parsing error when avatar image gets uploaded
- age refreshes automaticaly when avatarfix that p image gets uploaded
- Stats (such as: wins and losses, ladder level, achievements, and so forth) have to
be displayed on the user profile -->
<!-- - Make a friend list and possible to click on a friend username to show their profile Page
- Need to implement that the username cannot be similar to another user
- If so, say: "Username already exists, please choose another one" -->

<template>
    <div>
        <header></header>
        <main>
            <div v-if="user" class="flex flex-col items-center">
                <h1 class="h1">Profile Page</h1>
                <img 
                    v-if="user && user.id" 
                    :src="`/api/user/${user.id}/avatar`" 
                    alt="Avatar" 
                    class="w-60 h-60 rounded-full object-cover mb-8"/>
                <h2 class="h2" >Welcome, {{ user.login }}</h2>
                <h2 class="h2">id: {{ user.id }}</h2>
                <h2 class="h2">Email: {{ user.email }}</h2>
                <button v-if="user.id != undefined" @click="handleUploadAvatar" class="btn">Upload New Avatar Image</button>
                <button @click="changeUsername" class="btn">Change Username</button>
            </div>
        </main>
    </div>
</template>

<script lang="ts">
import axios from "axios";
import Vue from "vue";

export default {
    data() {
        return {
            // user: {
            //     id: 0,
            //     login: String,
            //     email: String,
            //     isTwoFactorAuthenticationEnabled: Boolean,
            //     accessToken: String,
            //     refreshToken: String,
            //     newPic: false,
            // }
            user: {
                id: 0,
                login: ' ',
                email: ' ',
                isTwoFactorAuthenticationEnabled: false,
                accessToken: ' ',
                refreshToken: ' ',
                newPic: false,
            }
        }
    },
    // setup() {
    //     const user = useUserStore()
    //     return { user }
    // }
    async mounted() {
        try {
            const response = await axios.get('http://localhost:8080/api/auth/profile');
            this.user = response.data;
        } catch (error) {
            console.log(error);
        }
    },
    methods: {
        async handleUploadAvatar() {
            this.user.newPic = true;
            const fileInput = document.createElement('input');
            fileInput.type = 'file';

            fileInput.addEventListener('change', async () => {
                const file = fileInput.files?.[0];
                if (file) {
                    const formData = new FormData();
                    formData.append('file', file);
                    const config = {
                        headers: { 'content-type': 'multipart/form-data' }
                    }
                    try {
                        const response = await axios.put(`http://localhost:8080/api/user/${this.user.id}/avatar`, formData, config);
                        this.user = { ...this.user };
                        console.log(response);
                    } catch (error) {
                       if (axios.isAxiosError(error)) {
                           console.log(error.response?.data);
                       } else {
                           console.log(error);
                        }
                    }
                }
            });
            fileInput.click();
        },
        async changeUsername() {
            const newUsername = prompt('Enter new username');
            if (newUsername) {
                try {
                    const response = await axios.put(`http://localhost:8080/api/user/${this.user.id}/username`, { username: newUsername });
                    const updatedUser = response.data;
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    this.user = updatedUser;
                    console.log(response);
                } catch (error) {
                    console.log(error);
                }
            }
        }
    },
}
</script>
