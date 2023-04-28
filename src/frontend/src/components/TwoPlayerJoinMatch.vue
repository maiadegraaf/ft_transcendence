<template>
    <div class="btn" @click="join">Join Match</div>
    <Match v-if="joined" :socket="socket" :matchId="matchId" />
</template>

<script lang="ts">
import io from 'socket.io-client'
import Match from '@/components/pong/Match.vue'
export default {
    name: 'TwoPlayerJoinMatch',
    components: { Match },
    data() {
        return {
            player1Id: 1,
            player2Id: 2,
            joined: false,
            matchId: 0
        }
    },
    mounted() {
        this.socket = io('http://localhost:8080')

        this.socket.on('match-created', (matchId: number) => {
            this.matchId = matchId
            this.joined = true
        })
    },
    methods: {
        join() {
            const data = {
                player1: this.player1Id,
                player2: this.player2Id
            }
            this.$emit('create match', data)
        }
    }
}
</script>

<style scoped></style>
