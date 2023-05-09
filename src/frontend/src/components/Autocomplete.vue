<template>
<!--  <input type="text" class="text-black" v-model="searchTerm" placeholder="Search User..">-->
<!--  <div :key="user.login" v-for="user in searchUsers">-->
<!--    <a v-if="user" href='"/profile/{{user.id}}'>{{ user.login }}</a>-->
<!--  </div>-->

</template>

<!--<script lang="ts">-->
<!--import axios from 'axios'-->
<!--import {ref, computed, defineComponent} from 'vue'-->



<!--export default defineComponent({-->
<!--  data() {-->
<!--    return {-->
<!--      users: []-->
<!--    }-->
<!--  },-->
<!--  created() {-->
<!--    axios.get('http://localhost:8080/api/users')-->
<!--        .then(response => {-->
<!--          this.users = response.data-->
<!--        })-->
<!--        .catch(error => {-->
<!--          console.log(error)-->
<!--        })-->
<!--  },-->
<!--  setup() {-->
<!--    // const users = this.users-->
<!--    let searchTerm = ref('')-->
<!--    const searchUsers = computed(() => {-->
<!--      if (searchTerm.value === '') {-->
<!--        return []-->
<!--      }-->
<!--      return users.filter(user => {-->
<!--        if (user.name.toLowerCase().includes(searchTerm.value.toLowerCase())) {-->
<!--          return user-->
<!--        }-->
<!--      })-->
<!--    });-->
<!--    const selectUser = (user) => {-->
<!--      selectedUser.value = user-->
<!--      searchTerm.value = ''-->
<!--    }-->
<!--    let selectedUser = ref('')-->
<!--    return {-->
<!--      users,-->
<!--      searchTerm,-->
<!--      searchUsers,-->
<!--      selectUser,-->
<!--      selectedUser-->
<!--    }-->
<!--  }-->
<!--})-->
<!--</script>-->