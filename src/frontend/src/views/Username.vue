<template>
  <div class="flex flex-col justify-center align-center h-screen">
    <div class="flex flex-col align-center justify-center">
      <label class="text-5xl mb-8 font-semibold">Choose your username:</label>
      <p class="h-1 mb-4 p-2 font-bold text-blush">{{ error }}</p>
      <input type="text" v-model="newUserName" class="border rounded mt-3"/>
    </div>
    <button @click="changeUsername" class="text-xl p-2 font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl uppercase">confirm</button>
    <button @click="pushHome" class="text-sm font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl">Keep <i>{{user.login}}</i> as username</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      newUserName: '',
      error: '',
      user: {
        id: Number,
        login: '',
        email: '',
        isTwoFactorAuthenticationEnabled: Boolean,
        accessToken: '',
        refreshToken: '',
      }
    }
  },
  methods: {
    changeUsername() {
      if (this.newUserName.trim().length === 0)
        this.error = "The username can't be empty !"
      else
      {
        axios.post('/api/user/username', {
          username: this.newUserName,
        })
            .then((response) => {
              this.$router.push('/Home');
            })
      }
    },
    pushHome() {
      this.$router.push('/Home')
    },
  },
  async mounted() {
    await axios.get('/api/auth/profile').then((response) => {
      this.user = response.data
    })
  },
}
</script>

<style scoped>

</style>