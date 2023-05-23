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
        <div v-else>
            <Match :socket="userStore.socket" :match-id="matchId" @reset="reset" />
        </div>
    </div>
    <div>
      <ErrorPopUp v-if="error" :message="msg" @hide-popup="hidePopup"/>
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
            msg: '',
            error: false,
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
            // this.$refs.errorPopUp.show('You are already ' + msg)
            this.msg = 'You are already ' + msg
            this.error = true
            this.reset()
        })
    },
    beforeRouteLeave(to, from, next: any) {
        console.log('Leaving pong game...')
        this.userStore.socket.emit('disconnectUser')
        next()
    },
    methods: {
        hidePopup() {
            this.error = false
        },
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
        opponentFound(matchId: number) {
          console.log('Opponent found ' + this.startMatch)
          this.matchId = matchId
          this.startedBy = this.userStore.id
          this.startMatch = true
        }
    }
})
</script>
