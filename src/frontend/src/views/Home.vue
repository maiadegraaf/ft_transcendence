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
      const response = await axios.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log(response.data);
      const { login, email, usual_full_name } = response.data;
      this.content = { login, email, usual_full_name };
      // const postResponse = await axios.post('http://localhost:8080/api/users', this.content);
      await axios.post('http://localhost:8080/api/users', this.content);
    } catch (error) {
      console.error(error);
    }
  },
  components: {
    Nav
  }
};
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