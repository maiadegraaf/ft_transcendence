<template>
    <body>
        <Nav />
        <Pong v-if="ready" match-id="0"/>
    </body>
</template>

<script lang="ts">
import Pong from '../components/pong/Pong.vue'
import Nav from '@/components/Nav.vue'
import {defineComponent} from "vue";


export default defineComponent({
    name: 'PongGame',
    components: {
        Nav,
        Pong
    },
    data() {
        return {
            // userId: 0,
            // socket: {} as Socket,
            matchId: 0,
            ready: false
        }
    },
    async mounted() {
      // this.userId = +this.$route.params.userid
      // if (!this.userId) {
      //   await axios.get('http://localhost:8080/api/auth/profile').then((response) => {
      //     this.userId = response.data.id
      //   })
      // }
      // console.log("//PONG GAME//\nUser id: " + this.userId)
      // this.socket = this.$route.params.socket
      // if (!this.socket) {
      //   this.socket = io('http://localhost:8080', {
      //     query: {
      //       userId: this.userId
      //     }
      //   })
      // }
      this.matchId = +this.$route.params.matchid
      if (!this.matchId) {
        this.matchId = 0
      }
      this.ready = true
      // console.log("Socket: " + this.socket + "\nMatch id: " + this.matchId)
      // if (this.socket && this.userId != 0) {
      //   console.log("Socket connected and user found" + this.userId)
      //   this.ready = true
      // }
    }
})
</script>
