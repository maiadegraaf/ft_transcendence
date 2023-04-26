<script lang="ts">
import Nav from '../components/Nav.vue'
import axios from 'axios'

export default {
    data() {
        return {
            user: {
                id: Number,
                login: '',
                email: '',
                isTwoFactorAuthenticationEnabled: Boolean,
                accessToken: '',
                refreshToken: ''
            }
        }
    },
    async created() {
        await axios.get('/api/auth/profile').then((response) => {
            this.user = response.data
        })
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
            </div>
        </main>
    </div>
</template>

<style scoped></style>
