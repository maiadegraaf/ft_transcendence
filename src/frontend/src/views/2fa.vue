<template>
  <div class="h-screen flex justify-center align-center flex-column">
    <button
      class="text-center text-3xl mt-14 p-2 border-2 rounded-md uppercase border-blush font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl"
    >
      Activate Two Factor Authentication
    </button>
    <button
        @click="redirectHome()"
      class="text-center text-3xl mt-14 p-2 border rounded-md uppercase border-blush font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl"
    >
      Not Now
    </button>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TwoFA',
  methods: {
    redirectHome() {
      this.$router.push('/Home')
    }
  }
}

</script>

<style scoped></style>
