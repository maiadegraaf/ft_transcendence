<template>
    <body>
        <NavBar />
        <Pong v-if="ready" :match-id-prop="matchId" />
    </body>
</template>

<script lang="ts">
import Pong from '../components/pong/Pong.vue'
import NavBar from '@/components/NavBar.vue'
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'PongGame',
    components: {
        NavBar,
        Pong
    },
    data() {
        return {
            matchId: 0 as number,
            ready: false
        }
    },
    async mounted() {
        this.matchId = +this.$route.params.matchid
        if (!this.matchId) {
            this.matchId = 0
        }
        this.ready = true
    }
})
</script>
