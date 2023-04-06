<script lang="ts">
import Nav from '../components/Nav.vue'
import axios from "axios";
import QrcodeVue from 'qrcode.vue'

export default {
  data() {
    return {
      user: {
        id: Number,
        login: String,
        email: String,
        createdAt: String
      },
      value: String,
      size: 300,
    }
  },
  mounted() {
    const userSession = sessionStorage.getItem('user') as string;
    this.user = JSON.parse(userSession);
    axios.post("http://localhost:8080/api/2fa/generate")
        .then((response) => {
          console.log(response.data.url);
          this.value = response.data.url;
        })
  },
  methods: {
    verify() {
      axios.post("http://localhost:8080/api/2fa/verify", {
          'token' : "325488"
      })
        .then((response) => {
          console.log(response);
        })
    }
  },
  components:{
    Nav,
    QrcodeVue
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
        <qrcode-vue :value="value" :size="size" level="H"/>
        <button @click="verify">verify</button>
      </div>
    </main>
  </div>
</template>

<style scoped></style>
