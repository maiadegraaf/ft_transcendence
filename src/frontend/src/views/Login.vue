<template>
  <div class="flex flex-col h-screen justify-center items-center flex-column">
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
      @click="fake_user(1)"
      class="text-l mt-14 p-2 uppercase font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl"
    >
      User 1
    </button>
    <button
      @click="fake_user(2)"
      class="text-l mt-2 p-2 uppercase font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl"
    >
      User 2
    </button>
    <button
      @click="fake_user(3)"
      class="text-l mt-2 p-2 uppercase font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl"
    >
      User 3
    </button>
    <button
      @click="fake_user(4)"
      class="text-l mt-2 p-2 uppercase font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl"
    >
      User 4
    </button>
    <button
      @click="fake_user(5)"
      class="text-l mt-2 p-2 uppercase font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl"
    >
      User 5
    </button>
    <button
      @click="fake_user(6)"
      class="text-l mt-2 p-2 uppercase font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl"
    >
      User 6
    </button>
    <p>if user # doesn't redirect you it doesn't exist in the database</p>
  </div>
</template>

<script lang="ts">
import axios from 'axios'

export default {
  data() {
    return {
      user: {
        accessToken: String,
        user: {
          id: Number,
          login: String,
          email: String,
          createdAt: String
        }
      }
    }
  },
  methods: {
    async login42() {
      window.location.href = 'http://localhost:8080/api/auth/42'
      await axios.get('http://localhost:8080/api/auth/profile').then((response) => {
        console.log(response.data)
        sessionStorage.setItem('user', JSON.stringify(response.data))
      })
    },
    fake_user(i: number) {
      const sleep = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
      }
      axios.get('http://localhost:8080/api/user/' + i).then((response) => {
        // this.user.accessToken = 'fake_user'
        this.user.user = response.data
        sessionStorage.setItem('user', JSON.stringify(this.user))
      })
      sleep(100).then(() => {
        if (sessionStorage.getItem('user')) {
          this.$router.push('/2fa')
        }
      })
    }
  }
}
</script>
