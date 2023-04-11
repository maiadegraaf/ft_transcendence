<template>
    <div class="mx-auto w-[800px]">
        <div
            class="relative w-full aspect-video border-double border-4 border-buff bg-dark-purple"
            ref="pongGame"
        >
            <div class="absolute left-5 w-5 h-24 bg-white" :style="{ top: player1.y + 'px' }"></div>
            <div
                class="absolute right-5 w-5 h-24 bg-white"
                :style="{ top: player2.y + 'px' }"
            ></div>
            <div
                class="absolute w-5 h-5 bg-white rounded-full"
                :style="{ top: ball.y + 'px', left: ball.x + 'px' }"
            ></div>
            <div
                class="absolute top-2 left-1/2 transform -translate-x-1/2 text-white text-3xl font-bold p-3"
            >
                <span class="p-4">{{ player1.score }}</span>
                <span class="p-4">{{ player2.score }}</span>
            </div>
            <div class="absolute inset-y-0 left-1/2 border-l border-dashed border-buff"></div>
            <div
                v-if="gameOver"
                class="absolute top-0 left-0 w-full h-full bg-dark-purple text-white flex flex-col items-center justify-center"
            >
                <h1 class="text-5xl text-buff font-bold text-shadow-lg mb-8">Game Over</h1>
                <h3 class="text-3xl text-buff font-bold text-shadow-lg mb-8">{{ winner }}</h3>
                <button to="/Pong" class="btn">Play Again</button>
            </div>
        </div>
        <div class="mx-auto flex w-2/3 m-2 items-center">
            <div class="flex-auto w-1/3">
                <img
                    src="../assets/images/up-down_keys.png"
                    alt="Use the up and down keys to control the paddle"
                    class="mx-auto my-4"
                />
            </div>
            <div class="text-center">
                <p class="mx-auto w-full text-white text-lg">
                    Use the up and down keys to control the paddle
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import io from 'socket.io-client'
export default {
    name: 'PracticeMatch',
    data(): any {
        return {
            started: false,
            startedBy: '',
            gameOver: false,
            winner: '',
            gamestate: '',
            waiting: false,
            practiceMode: false,
            winningScore: 10,
            difficulty: 'easy',
            multipleConnectionsError: false,
            currentPlayerId: '',
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
            },
            socket: typeof io
        }
    },
    mounted() {
        this.socket.on(
            'state',
            (state: { ball: any; player1: any; player2: any; gamestate: any; winner: any }) => {
                console.log('receiving state from server')
                this.ball = state.ball
                this.player1 = state.player1
                this.player2 = state.player2
                this.gamestate = state.gamestate
                this.winner = state.winner
                if (this.gamestate === 'playing') {
                    this.started = true
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
            console.log('Sending move to socket ' + this.socket.id)
            this.socket.emit('move', this.info)
        })
    },
    methods: {},
    watch: {
        gamestate() {
            if (this.gamestate === 'end') {
                this.gameOver = true
            }
        }
    }
}
</script>
