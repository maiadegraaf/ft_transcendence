<script lang="ts">
import axios from 'axios'
import Nav from '../components/Nav.vue'

export default {
  name: 'User',
  data() {
    return {
      content: {}
    }
  },
  async created() {
    try {
      await axios
          .get('https://localhost:8080/api/users/{{id}}')
          .then((response) => {

          })

    } catch (error) {
      console.error(error)
    }
  },
  components: {
    Nav
  }
}
</script>

<template>
  <div>
    <Nav />
    <header></header>
    <main>
      {{ content }}
    </main>
  </div>
</template>

<style scoped></style>
