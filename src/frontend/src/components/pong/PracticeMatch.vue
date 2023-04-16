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
import { VueCookieNext } from 'vue-cookie-next'
import ErrorPopUp from '../ErrorPopUp.vue'
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

        // from cookies
        // this.socket = io("http://localhost:8080");
        // const userCookie = VueCookieNext.getCookie('user')
        // console.log('userCookie: ' + userCookie)
        // if (userCookie === null) {
        //     this.$router.push('/')
        // } else {
        //     // const user = JSON.parse(userCookie)
        //     this.currentPlayerId = userCookie.user.id
        //     console.log('Current player id: ' + this.currentPlayerId)
        //     this.socket = io('http://localhost:8080', {
        //         query: {
        //             userId: this.currentPlayerId
        //         }
        //     })
        // }

        //listen for the state updates from the server
        this.socket.on(
            'PracticeState',
            (state: { ball: any; player1: any; player2: any; gamestate: any; winner: any }) => {
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

        this.socket.on('practiceMatchCreated', (practiceMatchId: number, socketId: string) => {
            // console.log("Practice match created by socket " + socketId);
            // if (socketId !== this.socket.id) {
            //   console.log("Practice match created by other socket");
            //   this.started = false;
            //   return ;
            // }
            console.log('Practice match created')
            this.started = true
            this.info.practiceMatchId = practiceMatchId
        })

        this.socket.on('matchmakingCanceled', () => {
            console.log('Matchmaking canceled')
            this.$refs.errorPopUp.showErrorPopup(
                'You cannot join a match in multiple tabs or windows.'
            )
            this.waiting = false
        })

        window.addEventListener('keydown', (event) => {
            console.log('Key pressed')
            if (!this.started) {
                console.log('Game not started')
                return
            }
            console.log('Game started')
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
    methods: {
        // start() {
        //     // this.currentPlayerId = sessionStorage.getItem("session_user_id");
        //     this.startedBy = this.currentPlayerId
        //     console.log('Starting game by ' + this.startedBy)
        //     this.gameOver = false
        //     this.winner = ''
        //     this.practiceSettings.difficulty = this.difficulty
        //     this.practiceSettings.score = this.winningScore
        //     this.practiceSettings.userId = this.currentPlayerId
        //     this.socket.emit('start practice', this.practiceSettings)
        //     return
        // },
        reset() {
            this.started = false
            this.gameOver = false
            this.practiceMode = false
            this.winner = ''
        },
        setPracticeMode() {
            this.practiceMode = true
        },
        joinMatch() {
            console.log('Joining match...')
            this.waiting = true
            console.log('Current player id: ' + this.currentPlayerId)
            this.socket.emit('joinMatchmaking', this.currentPlayerId)
        },
        leaveList() {
            this.waiting = false
            this.socket.emit('leaveMatchmaking')
        }
    },
    watch: {
        gamestate() {
            if (this.gamestate === 'end') {
                this.gameOver = true
            }
        }
    }
}
</script>
