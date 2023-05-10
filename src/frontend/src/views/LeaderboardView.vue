<template>
    <body>
        <Nav />
        <Leaderboard />
    </body>
</template>

<script lang="ts">
import Nav from '@/components/Nav.vue'
import Leaderboard from '@/components/leaderboard/Leaderboard.vue'
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'LeaderboardView',
    components: { Nav, Leaderboard }
})
</script>
