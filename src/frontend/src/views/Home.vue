<script lang="ts">
import axios from 'axios'
import Pong from '../components/Pong.vue'

export default {
  name: "User",
  data() {
    return {
      lists: [],
    };
  },
  created() {
		axios.get('https://api.intra.42.fr/v2/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }})
			.then((response) => {this.lists = response.data})
			.catch(error => console.log(error))
	}
}
</script>

<template>
  <div>
    <header></header>
    <main>
      {{lists}}
      <Pong />
    </main>
  </div>
</template>

<style scoped>
header {
  display: flex;
  place-items: center;
}
</style>