<template>
    <div>
        <ul class="flex border-b">
            <li class="-mb-px mr-1">
                <a
                    class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold"
                    @click="tab = 'Overall'"
                    :class="{
                        'text-blue-700': tab === 'Overall',
                        'text-blue-500 hover:text-blue-800': tab !== 'Overall'
                    }"
                    href="#"
                    >Overall</a
                >
            </li>
            <li class="mr-1">
                <a
                    class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold"
                    @click="tab = 'Practice Matches'"
                    :class="{
                        'text-blue-700': tab === 'Practice Matches',
                        'text-blue-500 hover:text-blue-800': tab !== 'Practice Matches'
                    }"
                    href="#"
                    >Practice Matches</a
                >
            </li>
        </ul>

        <div class="p-6">
            <table v-if="tab === 'Overall'" class="table-auto">
                <thead>
                    <tr>
                        <th class="px-4 py-2">Username</th>
                        <th class="px-4 py-2">Rating</th>
                        <th class="px-4 py-2">Wins</th>
                        <th class="px-4 py-2">Losses</th>
                        <th class="px-4 py-2">Winning Streak</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in leaderboardData" :key="index">
                        <td class="border px-4 py-2">{{ item.user ? item.user.login : '' }}</td>
                        <td class="border px-4 py-2">
                            <div class="bg-gray-300 rounded-full h-4">
                                <div
                                    class="bg-green-500 rounded-full h-4"
                                    :style="{ width: item.rating + '%' }"
                                ></div>
                            </div>
                        </td>
                        <td class="border px-4 py-2">{{ item.wins }}</td>
                        <td class="border px-4 py-2">{{ item.losses }}</td>
                        <td class="border px-4 py-2">{{ item.winStreak }}</td>
                    </tr>
                </tbody>
            </table>

            <!--            <table v-else-if="tab === 'Practice Matches'" class="table-auto">-->
            <!--                <thead>-->
            <!--                    <tr>-->
            <!--                        <th class="px-4 py-2">Difficulty</th>-->
            <!--                        <th class="px-4 py-2">Matches Played</th>-->
            <!--                        <th class="px-4 py-2">Wins</th>-->
            <!--                    </tr>-->
            <!--                </thead>-->
            <!--                <tbody>-->
            <!--                    <tr v-for="(item, index) in getItems(tab)" :key="index">-->
            <!--                        <td class="border px-4 py-2">{{ item.difficulty }}</td>-->
            <!--                        <td class="border px-4 py-2">{{ item.matchesPlayed }}</td>-->
            <!--                        <td class="border px-4 py-2">{{ item.wins }}</td>-->
            <!--                    </tr>-->
            <!--                </tbody>-->
            <!--            </table>-->
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios'

interface LeaderboardData {
    user: {
        login: string
    }
    rating: number
    wins: number
    losses: number
    winStreak: number
}

export default {
    data() {
        return {
            tab: 'Overall',
            leaderboardData: [] as LeaderboardData[]
        }
    },
    mounted() {
        axios.get('/leaderboard').then((response) => {
            this.leaderboardData = Array.from(response.data)
        })
    },
    methods: {
        getItems(tab: string) {
            if (tab === 'Overall') {
                return this.leaderboardData.sort((a, b) => b.rating - a.rating)
            } // else if (tab === 'Practice Matches') {
            //     return [
            //         { difficulty: 'Easy', matchesPlayed: 0, wins: 0 },
            //         { difficulty: 'Normal', matchesPlayed: 0, wins: 0 },
            //         { difficulty: 'Hard', matchesPlayed: 0, wins: 0 },
            //         { difficulty: 'Impossible', matchesPlayed: 0, wins: 0 }
            //     ]
            // }
        }
    }
}
</script>
