<script lang="ts">
import Nav from '../components/Nav.vue'

export default {
  data() {
    return {
      user: {
        id: Number,
        login: String,
        email: String,
    }
  }

  },
  mounted() {
    let usernotparse = this.$cookies.get("user");
    const user = JSON.parse(usernotparse);
    console.log(user);
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
        <h1>Welcome, {{ user.login }}!</h1>
        <h1>id: {{ user.id }}!</h1>
        <p>Email: {{ user.email }}</p>
      </div>
    </main>
  </div>
</template>

<style scoped></style>
