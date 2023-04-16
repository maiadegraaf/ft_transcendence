<template>
    <Console
        :player1="player1"
        :player2="player2"
        :ball="ball"
        :game-over="gameOver"
        :winner="winner"
    />
</template>

<script lang="ts">
import Console from '@/components/pong/Console.vue'

export default {
    name: 'Match',
    components: { Console },
    props: ['matchId', 'socket', 'userId'],
    data(): any {
        return {
            gameOver: false,
            winner: '',
            gamestate: '',
            ball: {
                x: 400,
                y: 300
            },
            player1: {
                y: 250,
                score: 0
            },
            player2: {
                y: 250,
                score: 0
            },
            info: {
                practiceMatchId: '',
                matchId: '',
                d: 0
            }
        }
    },
    mounted() {
        this.socket.on(
            'state',
            (state: { ball: any; player1: any; player2: any; gamestate: any; winner: any }) => {
                this.ball = state.ball
                this.player1 = state.player1
                this.player2 = state.player2
                this.gamestate = state.gamestate
                this.winner = state.winner
            }
        )
    }
}
</script>

<style scoped></style>
