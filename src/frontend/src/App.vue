<template>
    <div class="flex flex-col h-screen w-screen bg-dark-purple font-mono">
        <div class="flex-1 w-full mx-auto bg-gradient-to-r from-transparent via-transparent to-dark-purple">
            <router-view v-if="userStore.socket || $route.path === '/'" :key="$route.fullPath" />
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios'
import {useUserStore} from "@/store/user.store";
import {defineComponent} from "vue";
export default defineComponent({
    name: 'App',
    components: {},
  setup() {
      const userStore = useUserStore()
      return { userStore }
  },
  beforeCreate() {
    axios.get('/api/auth/profile').then((res) => {
      if (res.status === 200) {
        this.userStore.loadUser()
        if (this.$route.path === '/') {
          this.$router.push({path: '/home'})
        }
      }
      }).catch((err) => {
          this.$router.push({path: '/'})
      })
  }
})
</script>

<style scoped>
.bg-gradient-to-r {
    background-image: url('../src/assets/images/gradient_pong_background.png');
    background-size: 400px;
    background-repeat: repeat-x;
    background-position: bottom;
}
</style>
