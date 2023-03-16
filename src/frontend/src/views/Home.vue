<script setup lang="ts">
import Login from '../components/Login.vue'
import CreatePost from '../components/CreatePost.vue'
</script>

<template>
  <div>
    <header></header>
    <main>
      <Login/>
      <CreatePost/>
    </main>
  </div>
</template>

<style scoped>
header {
  display: flex;
  place-items: center;
}
</style>