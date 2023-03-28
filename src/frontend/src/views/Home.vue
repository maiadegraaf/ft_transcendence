<script lang="ts">
import axios from 'axios'
import Nav from '../components/Nav.vue'

export default {
  name: 'User',
  data() {
    return {
      lists: []
    }
  },
  created() {
    axios
        .get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        this.lists = response.data
      })
      .catch((error) => console.log(error))
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
      {{ lists }}
    </main>
  </div>
</template>

<style scoped></style>
