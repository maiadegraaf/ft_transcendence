<template>
    <body>
        <Nav />
        <Leaderboard />
    </body>
</template>

<script lang="ts">
import Nav from '../components/Nav.vue'
import Leaderboard from '../components/Leaderboard.vue'

export default {
    name: 'LeaderboardView',
    components: { Nav, Leaderboard }
}
</script>
