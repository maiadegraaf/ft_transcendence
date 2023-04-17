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
    </div>
</template>

<script lang="ts">

export default {
    methods: {
        async login42() {
            window.location.href = 'http://localhost:8080/api/auth/42'
        },
    }
}
</script>
