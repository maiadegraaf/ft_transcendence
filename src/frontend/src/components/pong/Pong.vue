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
import type { Socket } from 'socket.io-client'
import ErrorPopUp from '../ErrorPopUp.vue'
import PracticeMatchConfiguration from '@/components/pong/practiceMatchConfiguration.vue'
import PracticeMatch from '@/components/pong/PracticeMatch.vue'
import WaitingRoom from '@/components/pong/WaitingRoom.vue'
import Match from '@/components/pong/Match.vue'

export interface practiceSettingsInterface {
    score: number
    selectedDifficulty: string
    userId: string
}

export default {
    name: 'pongGame',
    props: ['userId', 'socket', 'matchId'],
    data(): any {
        return {
            currentPlayerId: '',
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
        }
    },
    components: {
        PracticeMatchConfiguration,
        PracticeMatch,
        WaitingRoom,
        Match,
        ErrorPopUp
    },
    created() {
      this.currentPlayerId = this.userId
      console.log("Current player id: " + this.currentPlayerId)

      if (this.matchId != 0) {
        console.log("Match id: " + this.matchId)
        this.startedBy = this.userId
        this.startMatch = true
      }
    },
  async mounted() {
        this.socket.on('MultipleConnections', (msg: string) => {
            this.$refs.errorPopUp.show('You are already ' + msg)
            this.reset()
        })

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                console.log('Disconnecting...')
                this.socket.emit('disconnect')
            }
        })
    },
    beforeRouteLeave(to: any, from: any, next: any) {
        console.log('Leaving pong game...')
        this.socket.emit('disconnect')
        next()
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
            this.waiting = false
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
            this.reset()
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
