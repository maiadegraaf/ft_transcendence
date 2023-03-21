<template>
  <nav class="flex justify-center p-3">
    <router-link class="hover:opacity-70 text-gray-900 transition-opacity ease-in-out" to="/Home" exact>Home</router-link>
  </nav>
  <Pong />
  <router-view/>
</template>

<script lang="ts">
import Pong from '../../../src/frontend/src/components/Pong.vue'

export default {
  name: 'App',
  components: {
    Pong
  }
}
</script>


