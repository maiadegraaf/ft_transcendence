<template>
    <nav class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
            <div class="ml-10 flex items-baseline space-x-4">
                <router-link
                    class="uppercase font-semibold tracking-wider text-blush hover:text-amaranth-purple px-3 py-2 drop-shadow-2xl"
                    to="/Home"
                >
                    Home
                </router-link>

                <router-link
                    class="uppercase font-semibold tracking-wider text-blush hover:text-amaranth-purple px-3 py-2 drop-shadow-2xl"
                    to="/Chat"
                >
                    Chat
                </router-link>

                <router-link
                    class="uppercase font-semibold tracking-wider text-blush hover:text-amaranth-purple px-3 py-2 drop-shadow-2xl"
                    :to="{
                      name:'Pong',
                      params:{
                        userId: currentUserId,
                        matchId: matchId
                      }
                    }"
                >
                    Pong
                </router-link>
                <router-link
                    class="uppercase font-semibold tracking-wider text-blush hover:text-amaranth-purple px-3 py-2 drop-shadow-2xl"
                    to="/Leaderboard"
                >
                    Leaderboard
                </router-link>
                <router-link
                    class="uppercase font-semibold tracking-wider text-blush hover:text-amaranth-purple px-3 py-2 drop-shadow-2xl"
                    :to="{name:'Profile', params:{ id: currentUserId}}"
                >
                    Profile
                </router-link>
            </div>
            <Logout />
        </div>
    </nav>
</template>

<script lang="ts">
import axios from 'axios'
import Logout from './Logout.vue'

export default {
    name: 'Nav',
    components: { Logout },
    data() {
      return{
        currentUserId: 0,
        matchId: 0
      }
    },
    async mounted() {
        await axios.get('/api/auth/profile')
        .then((response) => {
          this.currentUserId = response.data.id;
        })
    }
}
</script>

<style scoped></style>
