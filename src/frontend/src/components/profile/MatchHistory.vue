<template>
    <div class="flex flex-col justify-center items-center my-16">
        <div
            class="border-double text-center border-4 text-buff relative border-buff rounded-md w-[50vw] min-w-[600px] pt-10 p-4"
        >
            <h1
                class="text-2xl font-bold text-white absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dark-purple rounded-md border-2 border-buff px-4 py-2"
            >
                Match History
            </h1>
            <div class="grid grid-cols-3 gap-6 px-2 grid-rows-1 text-buff">
                <div
                    v-for="(match, index) in showMore
                        ? matchHistoryData
                        : matchHistoryData.slice(0, 3)"
                    v-on:click="sendToProfileOpponent(match)"
                    :key="index"
                    :class="whoWonTrue(match) ? 'text-blush border-blush' : 'text-buff border-buff'"
                    class="cursor-pointer border rounded-md p-2 flex flex-col justify-center items-center"
                >
                    <h2 class="font-bold text-2xl mb-2">{{ wonOrLost(match) }}</h2>
                    <h3 class="text-center break-all leading-4">
                        {{ match.player1.login }}<br />vs<br />{{ match.player2.login }}
                    </h3>
                    <h3 class="font-semibold mt-2">
                        {{ match.player1Score }} - {{ match.player2Score }}
                    </h3>
                </div>
            </div>
            <div
                v-if="matchHistoryData.length == 0"
                class="flex flex-col justify-center items-center"
            >
                <h3 class="text-3xl font-semibold">No matchs!!</h3>
                <a class="hover:opacity-60 transition-opacity" href="/Pong">Play a game</a>
            </div>
            <button
                v-if="matchHistoryData.length > 3"
                @click="showMore = !showMore"
                class="pt-4 hover:opacity-60 opacity-transition"
            >
                {{ showMore ? 'see less' : 'see more...' }}
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios'
import { defineComponent } from 'vue'

interface User {
    id: number
    login: string
}

interface MatchHistoryData {
    id: number
    player1: User
    player2: User
    player1Score: number
    player2Score: number
}

export default defineComponent({
    data() {
        return {
            matchHistoryData: [] as MatchHistoryData[],
            won: false,
            showMore: false
        }
    },
    methods: {
        whoWon(matchData: MatchHistoryData): User {
            if (matchData.player1Score > matchData.player2Score) {
                return matchData.player1
            } else {
                return matchData.player2
            }
        },
        whoWonTrue(matchData: MatchHistoryData): Boolean {
            if (matchData.player1.id == Number(this.$route.params.id)) {
                return matchData.player2Score > matchData.player1Score
            } else {
                return matchData.player1Score > matchData.player2Score
            }
        },
        wonOrLost(matchData: MatchHistoryData): string {
            if (this.whoWon(matchData).id == Number(this.$route.params.id)) {
                this.won = true
                return 'Won'
            } else {
                return 'Lost'
            }
        },
        sendToProfileOpponent(matchData: MatchHistoryData): void {
            console.log(matchData)
            if (matchData.player1.id == Number(this.$route.params.id)) {
                this.$router.push('/profile/' + matchData.player2.id)
            } else {
                this.$router.push('/profile/' + matchData.player1.id)
            }
        }
    },
    async mounted() {
        await axios.get('/api/match/' + this.$route.params.id).then((response) => {
            this.matchHistoryData = Array.from(response.data)
        })
    },
    name: 'MatchHistory'
})
</script>

<style scoped></style>
