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
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'PracticeMatch',
    props: ['practiceSettings', 'socket'],
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
                volley: any
            }) => {
                if (state.practiceMatchId !== this.info.practiceMatchId) {
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
})
</script>

<!--TODO: I think I fixed this?? Keep an eye on it... -> make the practice mode less buggy when then computer paddle is all the way down and then can't make it to the ball in time and so always looses.-->
<!--TODO: when disconnect lose match.-->
