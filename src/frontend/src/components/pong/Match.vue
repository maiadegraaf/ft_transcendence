<template>
    <Console
        :player1="player1"
        :player2="player2"
        :ball="ball"
        :game-over="gameOver"
        :winner="winner"
        :volley="volley"
    />
</template>

<script lang="ts">
import Console from '@/components/pong/Console.vue'

export default {
    name: 'Match',
    components: { Console },
    props: ['matchId', 'socket'],
    data(): any {
        return {
            gameOver: false,
            winner: '',
            gamestate: '',
            volley: 0,
            ball: {
                x: 390,
                y: 215
            },
            player1: {
                y: 175,
                score: 0
            },
            player2: {
                y: 175,
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
        this.info.matchId = this.matchId

        this.socket.on(
            'state',
            (state: {
                ball: any
                player1: any
                player2: any
                gamestate: any
                winner: any
                matchId: any
                volley: any
            }) => {
                if (state.matchId !== this.matchId) {
                    return
                }
                this.ball = state.ball
                this.player1 = state.player1
                this.player2 = state.player2
                this.gamestate = state.gamestate
                this.winner = state.winner
                this.volley = state.volley
                if (this.gamestate === 'end') {
                    this.gameOver = true
                }
            }
        )

        window.addEventListener('keydown', (event) => {
            console.log('Key pressed')
            switch (event.keyCode) {
                case 38: // up arrow key
                    this.info.d = -1
                    break
                case 40: // down arrow key
                    this.info.d = 1
                    break
            }
            if (!this.socket) {
                console.log('Socket not connected')
                return
            }
            this.socket.emit('move', this.info)
        })
    }
}
</script>

<style scoped></style>
