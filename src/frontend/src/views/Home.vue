<script lang="ts">
import Nav from '../components/Nav.vue'

export default {
  data() {
    return {
      user: {
        id: Number,
        login: String,
        email: String,
        createdAt: String
      }
    }
  },
  mounted() {
    const userSession = sessionStorage.getItem('user') as string;
    this.user = JSON.parse(userSession).user;
  },
  components:{
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
