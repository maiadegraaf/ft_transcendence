<template>
    <p>Waiting for opponent...</p>
    <button @click="leaveList" class="btn">Leave Waiting List</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'WaitingRoom',
    props: ['socket', 'userId'],
    mounted() {
        this.socket.emit('joinMatchmaking', this.userId)

        this.socket.on('opponentFound', (matchId: number) => {
            this.$emit('opponent-found', matchId)
        })
    },
    methods: {
        leaveList() {
            this.socket.emit('leaveMatchmaking', this.userId)
            this.$emit('leave-matchmaking')
        }
    }
})
</script>

<style scoped></style>
