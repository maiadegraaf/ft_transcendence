<template>
    <body>
        <NavBar />
        <Leaderboard />
    </body>
</template>

<script lang="ts">
import NavBar from '@/components/NavBar.vue'
import Leaderboard from '@/components/leaderboard/Leaderboard.vue'
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'LeaderboardView',
    components: { NavBar, Leaderboard }
})
</script>
