<template>
    <div class="flex flex-col h-screen justify-center items-center">
        <h1
            class="text-center text-4xl uppercase font-semibold tracking-wider text-blush drop-shadow-2xl"
        >
            Welcome to Ping-Pong Master
        </h1>
        <p
            class="text-center uppercase font-semibold opacity-60 tracking-wider text-blush drop-shadow-2xl"
        >
            To start playing, login with 42
        </p>
        <button
            class="text-center text-3xl mt-14 p-2 border rounded-md uppercase border-blush font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl"
            @click="login42"
        >
            Login with 42
        </button>
        <button
            class="text-center text-xl mt-4 p-2 border rounded-md uppercase border-blush font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl"
            @click="user(1)"
        >
            user 1
        </button>
        <button
            class="text-center text-xl mt-4 p-2 border rounded-md uppercase border-blush font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl"
            @click="user(2)"
        >
            user 2
        </button>
        <button
            class="text-center text-xl mt-4 p-2 border rounded-md uppercase border-blush font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl"
            @click="user(3)"
        >
            user 3
        </button>
        <button
            class="text-center text-xl mt-4 p-2 border rounded-md uppercase border-blush font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl"
            @click="user(4)"
        >
            user 4
        </button>
        <button
            class="text-center text-xl mt-4 p-2 border rounded-md uppercase border-blush font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl"
            @click="user(5)"
        >
            user 5
        </button>
        <button
            class="text-center text-xl mt-4 p-2 border rounded-md uppercase border-blush font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl"
            @click="user(6)"
        >
            user 6
        </button>
    </div>
</template>

<script lang="ts">
import axios from 'axios'
import {defineComponent} from "vue";

export default defineComponent({
    methods: {
        async user(id: number) {
            await axios.get(`/api/auth/profile/${id}`)
            this.$router.push('/ChooseUsername')
        },
        async login42() {
            window.location.href = '/api/auth/42'
        }
    }
})
</script>
