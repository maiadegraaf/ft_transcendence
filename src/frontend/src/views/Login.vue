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
      >Login with 42</button
    >
    <button
        @click="fake_user(1)"
      class="text-l mt-14 p-2 uppercase font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl"
      >User 1</button
    >
    <button
        @click="fake_user(2)"
      class="text-l mt-2 p-2 uppercase font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl"
      >User 2</button
    >
    <button
        @click="fake_user(3)"
      class="text-l mt-2 p-2 uppercase font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl"
      >User 3</button
    >
    <button
        @click="fake_user(4)"
        class="text-l mt-2 p-2 uppercase font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl"
    >User 4</button
    >
    <button
        @click="fake_user(5)"
        class="text-l mt-2 p-2 uppercase font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl"
    >User 5</button
    >
    <button
        @click="fake_user(6)"
        class="text-l mt-2 p-2 uppercase font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl"
    >User 6</button
    >
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
        axios
            .get('https://api.intra.42.fr/v2/me', {
              headers: {
                Authorization: `Bearer ${response.data.access_token}`
              }
            })
            .then((response_auth) => {
              this.$storage.setStorageSync('user_id', response_auth.data.id)
            })
        this.$router.push('/Home')
      })
      .catch((error) => console.log(error))

  },
  methods: {
    login42() {
      window.location.href = 'http://localhost:8080/api/auth/42';
    },
    fake_user(i: number) {
      this.$storage.setStorageSync('user_id', i)
      this.$router.push('/Home')
    }
  }
}
</script>
