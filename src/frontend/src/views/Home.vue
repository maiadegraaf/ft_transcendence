<!-- <script lang="ts">
import axios from 'axios'
import Nav from '../components/Nav.vue'

// export default {
//   name: 'User',
//   data() {
//     return {
//       lists: []
//     }
//   },
//   created() {
//     axios
//       .get('https://api.intra.42.fr/v2/me', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       })
//       .then((response) => {
//         this.lists = response.data
//       })
//       .catch((error) => console.log(error))
//   },
//   components: {
//     Nav
//   }
// }

<style scoped></style> -->


<script lang="ts">
import axios from 'axios'
import Nav from '../components/Nav.vue'

export default {
  name: 'User',
  data() {
    return {
      lists: {}
    }
  },
  async created() {
    try {
      const response = await axios.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      this.lists = response.data;

      console.log(response.data);
      const { usual_full_name, login, email } = response.data;
      const content = { usual_full_name, login, email };
      const postResponse = await axios.post('http://localhost:3000/users', content);
      // console.log(postResponse.data);
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
      {{ lists }}
    </main>
  </div>
</template>

<style scoped></style>