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
      await axios.get('http://localhost:8080/api/auth/profile').then((response) => {
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
