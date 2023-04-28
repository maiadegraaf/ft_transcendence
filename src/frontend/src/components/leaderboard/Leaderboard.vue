<style>
.table-row {
    position: relative;
}

.row-right {
    border-radius: 0 0.5rem 0.5rem 0;
}

.row-both {
    border-radius: 0.5rem 0.5rem 0.5rem 0.5rem;
}

.row-left {
    border-radius: 0.5rem 0 0 0.5rem;
}

.table-header::before,
.table-header::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 20px;
    border-radius: 9999px;
}
.table-header::before {
    left: -5px;
    transform: translateX(-25%);
}
.table-header::after {
    right: -5px;
    transform: translateX(25%);
}
.tab-button {
    border-top-left-radius: 0.375rem;
    border-top-right-radius: 0.375rem;
    background-color: #5d90e9ff;
    color: white;
    padding: 0.5rem 1rem;
}

.active-tab {
    border-top: 2px solid #5d90e9ff;
    border-left: 2px solid #5d90e9ff;
    border-right: 2px solid #5d90e9ff;
    position: relative;
    background-color: #170623;
    z-index: 1;
}

.inactive-tab:not(:last-child) {
    border-right: 2px solid #5d90e9ff;
}

.inactive-tab {
    background-color: #5d90e9ff;
}

.tab-button:last-child {
    border-top-right-radius: 0.375rem;
}

.tab-button:first-child {
    border-top-left-radius: 0.375rem;
}
</style>

<template>
    <div
        class="w-[730px] p-8 rounded-md relative mt-8 mx-auto w-3/4 border-buff border-double border-4"
    >
        <h1
            class="text-2xl font-bold absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dark-purple rounded-md border-2 border-buff px-4 py-2"
        >
            Leaderboard
        </h1>
        <!--        <div class="flex justify-start mt-2">-->
        <div class="flex justify-start mt-2">
            <button
                class="tab-button mr-3"
                :class="tab === 'Overall' ? 'active-tab' : 'inactive-tab'"
                @click="tab = 'Overall'"
            >
                Overall
            </button>
            <button
                class="tab-button"
                :class="tab === 'Practice Matches' ? 'active-tab' : 'inactive-tab'"
                @click="tab = 'Practice Matches'"
            >
                Practice Matches
            </button>
            <div class="tab-shape"></div>
        </div>
        <div class="relative w-full rounded-b-lg -mt-0.5 p-4 border-2 border-vista-blue">
            <overall
                v-if="tab === 'Overall'"
                :leaderboard-data="leaderboardData"
                :current-user="currentUser"
                :whitespace="whitespace"
            />
            <practice-match-board
                v-else-if="tab === 'Practice Matches'"
                :practice-match-data="practiceMatchData"
                :current-user="currentUser"
                :whitespace="whitespace"
            />
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios'
import io from 'socket.io-client'
import Overall from '@/components/leaderboard/Overall.vue'
import PracticeMatchBoard from '@/components/leaderboard/PracticeMatchesBoard.vue'

interface LeaderboardData {
    user: {
        login: string
        id: number
    }
    rating: number
    wins: number
    losses: number
    winStreak: number
}

interface PracticeMatchData {
    practiceEasyPlayed: number
    practiceEasyWins: number
    practiceNormalPlayed: number
    practiceNormalWins: number
    practiceHardPlayed: number
    practiceHardWins: number
    practiceExpertPlayed: number
    practiceExpertWins: number
}

export default {
    components: {
        Overall,
        PracticeMatchBoard
    },
    data() {
        return {
            tab: 'Overall',
            leaderboardData: [] as LeaderboardData[],
            practiceMatchData: {
                practiceEasyPlayed: 0,
                practiceEasyWins: 0,
                practiceNormalPlayed: 0,
                practiceNormalWins: 0,
                practiceHardPlayed: 0,
                practiceHardWins: 0,
                practiceExpertPlayed: 0,
                practiceExpertWins: 0
            } as PracticeMatchData,
            currentUser: 0,
            whitespace: '  '
        }
    },
    async mounted() {
        await axios.get('/api/auth/profile').then((response) => {
            this.currentUser = response.data.id
        })
        axios.get('/api/leaderboard').then((response) => {
            this.leaderboardData = Array.from(response.data)
        })
        axios.get('/api/leaderboard/' + this.currentUser).then((response) => {
            console.log('http://localhost:8080/api/leaderboard/' + this.currentUser)
            this.practiceMatchData = response.data as PracticeMatchData
        })
    },
    methods: {
        getItems(tab: string) {
            if (tab === 'Overall') {
                return this.leaderboardData
            } else if (tab === 'Practice Matches') {
                return this.practiceMatchData
            }
        }
    }
}
</script>
