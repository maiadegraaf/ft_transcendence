<template>
  <nav class="flex justify-center p-3">
    <router-link class="hover:opacity-70 text-gray-900 transition-opacity ease-in-out" to="/Home" exact>Home</router-link>
    <router-link class="hover:opacity-70 text-gray-900 transition-opacity ease-in-out" to="/Authenticated" exact>Auth</router-link>
    <router-link class="hover:opacity-70 text-gray-900 transition-opacity ease-in-out" to="/Login" exact>Login</router-link>
    <router-link class="hover:opacity-70 text-gray-900 transition-opacity ease-in-out" to="/Pong" exact>Pong</router-link>
  </nav>
<!--  <Pong />-->
  <router-view/>
</template>

<script lang="ts">

export default {
  name: 'App',
  components: {
  }
}
</script>


