<template>
    <Nav />
    <div
        class="mx-auto flex flex-col items-center justify-center w-10/12 aspect-video bg-dark-purple-800"
    >
        <img class="m-8 w-[450px]" src="../assets/images/PONG.gif" alt="PONG" />
        <div v-if="startMatch == false">
            <WaitingRoomOneVOne
                :socket="userStore.socket"
                :userId="Number(userStore.id)"
                :senderId="Number($route.params.senderId)"
                :opponentId="Number($route.params.opponentId)"
                @leave-matchmaking="leaveMatchmaking"
                @opponent-found="opponentFound"
            />
        </div>
        <div v-if="startMatch">
            <Match :socket="userStore.socket" :match-id="matchId" @reset="reset" />
        </div>
    </div>
    <div>
        <ErrorPopUp ref="errorPopUp" />
    </div>
</template>

<script lang="ts">
import ErrorPopUp from '../components/ErrorPopUp.vue'
import Nav from '../components/Nav.vue'
import Match from '../components/pong/Match.vue'
import WaitingRoomOneVOne from '../components/pong/WaitingRoomOneVOne.vue'
import { defineComponent } from 'vue'
import { useUserStore } from '@/store/user.store'

export default defineComponent({
    setup() {
        const userStore = useUserStore()
        return { userStore }
    },
    name: 'WaitingOpponent',
    components: {
        Nav,
        Match,
        ErrorPopUp,
        WaitingRoomOneVOne
    },
    data(): any {
        return {
            startMatch: false,
            waiting: true,
            matchId: 0,
            startedBy: 0
        }
    },
    created() {
        // this.currentPlayerId = this.userId
        console.log('Current player id: ' + this.userStore.id)

        if (this.matchId != 0) {
            console.log('Match id: ' + this.matchId)
            this.startedBy = this.userStore.id
            this.startMatch = true
        }
    },
    async mounted() {
        this.userStore.socket.on('MultipleConnections', (msg: string) => {
            this.$refs.errorPopUp.show('You are already ' + msg)
            this.reset()
        })

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                console.log('Disconnecting...')
                this.userStore.socket.emit('disconnect')
            }
        })
    },
    beforeRouteLeave(to, from, next: any) {
        console.log('Leaving pong game...')
        // this.userStore.socket.emit('disconnect')
        next()
    },
    methods: {
        reset() {
            this.startedBy = ''
            this.startMatch = false
        },
        leaveMatchmaking() {
            this.userStore.socket.emit('leaveMatchmaking')
            this.$router.push({
                name: 'Chat'
            })
        },
        matchmakingError() {
            this.$refs.errorPopUp.show('You cannot join a match in multiple tabs or windows.')
            this.reset()
        },
        opponentFound(matchId: number) {
            this.matchId = matchId
            this.startedBy = this.userStore.id
            this.startMatch = true
            console.log('Opponent found' + this.startMatch)
        }
    }
})
</script>
