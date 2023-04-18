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
import io from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import Console from '@/components/pong/Console.vue'

export default {
    name: 'PracticeMatch',
    props: ['practiceSettings', 'socket'],
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
    components: {
        Console
    },
    mounted() {
        //from session storage
        this.currentPlayerId = this.practiceSettings.userId
        this.socket.emit('start practice', this.practiceSettings)

        //listen for the state updates from the server
        this.socket.on(
            'PracticeState',
            (state: {
                ball: any
                player1: any
                player2: any
                gamestate: any
                winner: any
                practiceMatchId: any
            }) => {
                if (state.practiceMatchId !== this.info.practiceMatchId) {
                    return
                }
                this.ball = state.ball
                this.player1 = state.player1
                this.player2 = state.player2
                this.gamestate = state.gamestate
                this.winner = state.winner
                if (this.gamestate === 'end') {
                    this.gameOver = true
                }
            }
        )

        this.socket.on('practiceMatchCreated', (practiceMatchId: number, socketId: string) => {
            // console.log("Practice match created by socket " + socketId);
            // if (socketId !== this.socket.id) {
            //   console.log("Practice match created by other socket");
            //   this.started = false;
            //   return ;
            // }
            console.log('Practice match created')
            this.info.practiceMatchId = practiceMatchId
        })

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
