<template>
    <div class="flex flex-col justify-center items-center mt-16">
        <div
            class="border-double border-4 text-buff relative border-buff rounded-md w-[50vw] min-w-[600px] pt-10 p-4"
        >
            <h1
                class="text-2xl font-bold text-white absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dark-purple rounded-md border-2 border-buff px-4 py-2"
            >
                Stats
            </h1>
            <div class="flex items-center justify-around">
                <div class="scoreDiv">
                    <h3 class="scoreIdentifier">Rating</h3>
                    <h3 class="score">
                        {{ leaderboardData.rating }}
                    </h3>
                </div>
                <div class="scoreDiv">
                    <h3 class="scoreIdentifier">Wins</h3>
                    <h3 class="score">
                        {{ leaderboardData.wins }}
                    </h3>
                </div>
                <div class="scoreDiv">
                    <h3 class="scoreIdentifier">Losses</h3>
                    <h3 class="score">
                        {{ leaderboardData.losses }}
                    </h3>
                </div>
                <div class="scoreDiv">
                    <h3 class="scoreIdentifier">Win Streak</h3>
                    <h3 class="score">
                        {{ leaderboardData.winStreak }}
                    </h3>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios'

interface LeaderboardData {
    rating: number
    wins: number
    losses: number
    winStreak: number
}

export default {
    name: 'WinLosses',
    data() {
        return {
            currentUserId: 0,
            leaderboardData: {} as LeaderboardData
        }
    },
    async mounted() {
        await axios.get('/api/auth/profile').then((response) => {
            this.currentUserId = response.data.id
        })
        axios.get('/api/leaderboard/' + this.currentUserId).then((response) => {
            this.leaderboardData = response.data
        })
        console.log(this.leaderboardData)
    }
}
</script>

<style scoped>
.scoreDiv {
    @apply flex flex-col items-center justify-center;
}
.score {
    @apply text-xl text-buff font-bold;
}
.scoreIdentifier {
    @apply text-xl text-white font-bold mb-4;
}
</style>
