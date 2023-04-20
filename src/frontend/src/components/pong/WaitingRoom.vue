<template>
    <p>Waiting for opponent...</p>
    <button @click="leaveList" class="btn">Leave Waiting List</button>
</template>

<script lang="ts">
export default {
    props: ['userId', 'socket'],
    name: 'WaitingRoom',
    mounted() {
        this.socket.emit('joinMatchmaking', this.userId)

        this.socket.on('opponentFound', (matchId: number) => {
            console.log('Opponent found')
            this.$emit('opponent-found', matchId)
        })

        this.socket.on('matchmakingCanceled', () => {
            console.log('Matchmaking canceled')
            this.$emit('matchmaking-error')
        })
    },
    methods: {
        leaveList() {
            this.socket.emit('leaveMatchmaking', this.userId)
            this.$emit('leave-matchmaking')
        }
    }
}
</script>

<style scoped></style>
