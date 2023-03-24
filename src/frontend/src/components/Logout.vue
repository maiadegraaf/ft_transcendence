<template>
  <button class="mr-10 uppercase font-semibold tracking-wider text-blush hover:text-amaranth-purple px-3 py-2 drop-shadow-2xl" @click="destroyToken()">Log out</button>
</template>

<script>
export default {
  name: "Logout",
  methods: {
    destroyToken() {
      localStorage.setItem('token', "null");
      this.$router.push('/');
    },
  }
}
</script>

<style scoped>

</style>