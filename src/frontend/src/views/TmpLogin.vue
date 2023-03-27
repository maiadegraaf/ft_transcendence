<template>
    <div>
        <form @submit.prevent="login">
            <input type="text" v-model="username" placeholder="Username" required />
            <input type="password" v-model="password" placeholder="Password" required />
            <button type="submit" class="bg-buff text-yinmn-blue">Login</button>
        </form>
    </div>
</template>

<script lang="ts">
import io from 'socket.io-client';

export default {
    data() {
        return {
            username: '',
            password: '',
            socket: io('http://localhost:8080')
        };
    },
    mounted() {
    },
    created() {
        this.socket.on('redirect', (route) => {
            window.location.href = route;
        });
    },
    methods: {
        login() {
            this.socket.emit('login', { username: this.username });
            console.log('login');
        },
    },
};
</script>
