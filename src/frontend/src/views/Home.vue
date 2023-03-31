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
    this.$cookie.setCookie("usr", "wajo");
    console.log(this.$cookie.keys());
    this.user = this.$cookie.getCookie("user").user;
    // const user = JSON.parse(decodeURIComponent(usernotparse.data));
    // console.log(user);
    console.log(this.user);
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
