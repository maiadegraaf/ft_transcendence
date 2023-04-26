<template>
    <div
        class="mx-auto flex flex-col items-center justify-center w-10/12 aspect-video bg-dark-purple-800"
    >
        <img class="m-8 w-[450px]" src="../../assets/images/PONG.gif" alt="PONG" />
        <button
            v-if="!waiting && !practiceMode && !startMatch"
            @click="setPracticeMode"
            class="btn"
        >
            Start a Practice Game
        </button>
        <div v-if="practiceMode && !startPractice">
            <practice-match-configuration
                :user-id="currentPlayerId"
                @start-practice="handleStartPractice"
                @back="back"
            />
        </div>
        <div v-if="startPractice && startedBy == currentPlayerId">
            <practice-match :practice-settings="practiceSettings" :socket="socket" @reset="reset" />
        </div>
        <button v-if="!waiting && !practiceMode && !startMatch" @click="joinMatch" class="btn">
            Join Match
        </button>
        <div v-if="waiting">
            <waiting-room
                :user-id="currentPlayerId"
                :socket="socket"
                @leave-matchmaking="leaveMatchmaking"
                @matchmaking-error="matchmakingError"
                @opponent-found="opponentFound"
            />
        </div>
        <div v-if="startMatch">
            <Match :socket="socket" :match-id="matchId" :user-id="currentPlayerId" @reset="reset" />
        </div>
    </div>
    <div>
        <ErrorPopUp ref="errorPopUp" />
    </div>
</template>

<script lang="ts">
import io from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import { VueCookieNext } from 'vue-cookie-next'
import ErrorPopUp from '../ErrorPopUp.vue'
import PracticeMatchConfiguration from '@/components/pong/practiceMatchConfiguration.vue'
import PracticeMatch from '@/components/pong/PracticeMatch.vue'
import WaitingRoom from '@/components/pong/WaitingRoom.vue'
import Match from '@/components/pong/Match.vue'
import axios from 'axios'
interface practiceSettingsInterface {
    score: number
    selectedDifficulty: string
    userId: string
}

export default {
    name: 'pongGame',
    data(): any {
        return {
            currentPlayerId: '',
            // multipleConnectionsError: false,
            practiceMode: false,
            practiceSettings: {
                score: 10,
                selectedDifficulty: 'EASY',
                userId: ''
            } as practiceSettingsInterface,
            startPractice: false,
            startedBy: '',
            startMatch: false,
            waiting: false,
            matchId: 0
        }
    },
    components: {
        PracticeMatchConfiguration,
        PracticeMatch,
        WaitingRoom,
        Match,
        ErrorPopUp
    },
    async mounted() {
        let userId = 0
        await axios.get('/api/auth/profile').then((response) => {
            userId = response.data.id
        })
        // console.log('Session Storage User: ' + userId)
        if (userId === 0) {
            this.$router.push('/')
        } else {
            this.currentPlayerId = userId
            console.log('Current player id: ' + this.currentPlayerId)
            // console.log('Current player id: ' + this.currentPlayerId)
            this.socket = io('http://localhost:8080', {
                query: {
                    userId: this.currentPlayerId
                }
            })
        }

        this.socket.on('already in list', () => {
            this.$refs.errorPopUp.show('You are already waiting to join a match.')
            this.waiting = false
            this.practiceMode = false
            this.startPractice = false
            this.startMatch = false
        })

        this.socket.on('already in practice match', () => {
            this.$refs.errorPopUp.show('You are already in a practice match.')
            this.waiting = false
            this.practiceMode = false
            this.startPractice = false
            this.startMatch = false
        })

        this.socket.on('already in match', () => {
            this.$refs.errorPopUp.show('You are already in a match.')
            this.waiting = false
            this.practiceMode = false
            this.startPractice = false
            this.startMatch = false
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
    beforeUnmount() {
        this.socket.disconnect()
        this.$root.$off('reset')
    },
    methods: {
        setPracticeMode() {
            this.practiceMode = true
        },
        handleStartPractice(practiceSettings: practiceSettingsInterface) {
            this.startedBy = practiceSettings.userId
            this.startPractice = true
            this.practiceSettings = practiceSettings
        },
        reset() {
            this.startPractice = false
            this.practiceMode = false
            this.startedBy = ''
            this.startMatch = false
        },
        joinMatch() {
            console.log('Joining match...')
            this.waiting = true
        },
        leaveMatchmaking() {
            this.waiting = false
            this.socket.emit('leaveMatchmaking')
        },
        matchmakingError() {
            this.$refs.errorPopUp.show('You cannot join a match in multiple tabs or windows.')
        },
        opponentFound(matchId: number) {
            this.startedBy = this.currentPlayerId
            this.startMatch = true
            this.waiting = false
            this.matchId = matchId
        },
        back() {
            this.practiceMode = false
        }
    }
}
</script>
