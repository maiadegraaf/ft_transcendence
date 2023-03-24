<template>
  <div class="flex flex-col h-screen justify-center items-center">
    <h1 class="text-4xl uppercase font-semibold tracking-wider text-blush drop-shadow-2xl">Welcome to Ping-Pong Master</h1>
    <p class="uppercase font-semibold opacity-60 tracking-wider text-blush  drop-shadow-2xl">To start playing, login with 42</p>
    <a
      class="text-3xl mt-14 p-2 border rounded-md uppercase border-blush font-semibold hover:border-amaranth-purple  hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl"
      href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-39cfad1d6f73c8c527bed1273cb6689ff7a806f4fae38fc551c6c2f3aa6cfa44&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F&response_type=code"
      >Login with 42</a
    >
    <a class="text-l mt-14 p-2 uppercase font-semibold hover:border-amaranth-purple  hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl">User 1</a>
    <a class="text-l mt-2 p-2 uppercase font-semibold hover:border-amaranth-purple  hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl">User 2</a>
    <a class="text-l mt-2 p-2 uppercase font-semibold hover:border-amaranth-purple  hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl">User 3</a>
  </div>
</template>

<script lang="ts">
import axios from 'axios'

export default {
  data() {
    return {
      formdata: {
        grant_type: 'authorization_code',
        client_id: 'u-s4t2ud-39cfad1d6f73c8c527bed1273cb6689ff7a806f4fae38fc551c6c2f3aa6cfa44',
        client_secret: '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',
        code: this.$route.query.code,
        redirect_uri: 'http://localhost:8080/'
      }
    }
  },
  created() {
    axios
      .post('https://api.intra.42.fr/oauth/token', this.formdata)
      .then((response) => {
        localStorage.setItem('token', response.data.access_token)
        this.$router.push('/Home')
      })
      .catch((error) => console.log(error))
  }
}
</script>
