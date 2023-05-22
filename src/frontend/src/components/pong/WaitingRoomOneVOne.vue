<template>
    <p>Waiting for opponent...</p>
    <button @click="leaveList" class="btn">Leave Waiting List</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'WaitingRoom',
    props: ['socket', 'userId', 'senderId', 'opponentId'],
    mounted() {
        this.socket.emit('joinMatchmakingOneVOne', {
            userId: this.userId,
            senderId: this.senderId,
            opponentId: this.opponentId
        })

        this.socket.on('opponentFound', (matchId: number) => {
            console.log('Opponent found')
            console.log(matchId)
            this.$emit('opponent-found', matchId)
        })
    },
    methods: {
        leaveList() {
            this.socket.emit('leaveMatchmakingOneVOne', this.userId)
            this.$emit('leave-matchmaking')
        }
    }
})
</script>

<style scoped></style>
