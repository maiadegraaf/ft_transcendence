<script lang="ts">
import Nav from '../components/Nav.vue'
import axios from "axios";

export default {
    data() {
        return {
            user: {
                id: Number,
                login: String,
                email: String,
                isTwoFactorAuthenticationEnabled: Boolean,
                accessToken: String,
                refreshToken: String,
            }
        }
    },
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
            const fileInput = document.createElement('input');
            fileInput.type = 'file';

            fileInput.addEventListener('change', async () => {
                const file = fileInput.files?.[0];
                if (file) {
                    const formData = new FormData();
                    formData.append('file', file);

                    // if (this.user.avatar) {
                        // await axios.delete(`http://localhost:8080/api/user/${this.user.id}/avatar`);
                    // }
                    const config = {
                        headers: { 'content-type': 'multipart/form-data' }
                    }
                    try {
                        const response = await axios.put(`http://localhost:8080/api/user/${this.user.id}/avatar`, formData, config);
                        this.user = { ...this.user };
                        console.log(response);
                    } catch (error) {
                        console.log(error);
                    }
                }
            });
            fileInput.click();
        },
    },
    components: {
        Nav
    }
}
</script>

<template>
    <div>
        <Nav />
        <header></header>
        <main>
            <div v-if="user">
                <h1>Welcome, {{ user.login }}</h1>
                <h1>id: {{ user.id }}</h1>
                <p>Email: {{ user.email }}</p>
                <img v-if="user.id" :src="`/api/user/${user.id}/avatar`" alt="Avatar" />
                <button v-if="user.id != undefined" @click="handleUploadAvatar">Upload Avatar Image</button>
            </div>
        </main>
    </div>
</template>