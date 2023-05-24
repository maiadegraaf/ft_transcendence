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
                :userId="user.id"
                @start-practice="handleStartPractice"
                @back="back"
            />
        </div>
        <div v-if="startPractice && startedBy == user.id">
            <practice-match
                :practice-settings="practiceSettings"
                :socket="user.socket"
                @reset="reset"
            />
        </div>
        <button v-if="!waiting && !practiceMode && !startMatch" @click="joinMatch" class="btn">
            Join Match
        </button>
        <div v-if="waiting">
            <WaitingRoom
                :socket="user.socket"
                :userId="user.id"
                @leave-matchmaking="leaveMatchmaking"
                @opponent-found="opponentFound"
            />
        </div>
        <div v-if="startMatch">
            <Match :socket="user.socket" :match-id="matchId" @reset="reset" />
        </div>
    </div>
    <div>
        <ErrorPopUp v-if="error" :message="msg" @hide-popup="hidePopup" />
    </div>
</template>

<script lang="ts">
import ErrorPopUp from '../ErrorPopUp.vue'
import PracticeMatchConfiguration from '@/components/pong/practiceMatchConfiguration.vue'
import PracticeMatch from '@/components/pong/PracticeMatch.vue'
import WaitingRoom from '@/components/pong/WaitingRoom.vue'
import Match from '@/components/pong/Match.vue'
import { useUserStore } from '@/store/user.store'
import { defineComponent } from 'vue'

export interface practiceSettingsInterface {
    score: number
    selectedDifficulty: string
    userId: string
}

export default defineComponent({
    name: 'pongGame',
    props: ['matchIdProp'],

    setup() {
        const user = useUserStore()
        return { user }
    },
    data(): any {
        return {
            error: false,
            msg: '',
            // currentPlayerId: user.id,
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
            matchId: this.matchIdProp
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
        // this.currentPlayerId = this.userId

        if (this.matchId != 0) {
            this.startedBy = this.user.id
            this.startMatch = true
        }
    },
    async mounted() {
        this.user.socket.on('MultipleConnections', (msg: string) => {
            // this.$refs.errorPopUp.show('You are already ' + msg)
            this.msg = 'You are already ' + msg
            this.error = true
            this.reset()
        })

        // document.addEventListener('visibilitychange', () => {
        //     if (document.visibilityState === 'hidden') {
        //         console.log('Disconnecting...')
        //         this.user.socket.emit('disconnectUser')
        //     }
        // })
    },
    beforeRouteLeave(to: any, from: any, next: any) {
        this.user.socket.emit('disconnectUser')
        next()
    },
    methods: {
        hidePopup() {
            this.error = false
        },
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
            this.waiting = true
        },
        leaveMatchmaking() {
            this.waiting = false
            this.user.socket.emit('leaveMatchmaking')
        },
        opponentFound(matchId: number) {
            this.matchId = matchId
            this.startedBy = this.user.id
            this.waiting = false
            this.startMatch = true
        },
        back() {
            this.practiceMode = false
        }
    }
})
</script>
