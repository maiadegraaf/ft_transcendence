<style>
.table-row {
    position: relative;
}

.table-row td:last-child {
    border-radius: 0 0.5rem 0.5rem 0;
}

.table-row td:nth-child(3) {
    border-radius: 0.5rem 0.5rem 0.5rem 0.5rem;
}

.table-row td:nth-child(5) {
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
    background-color: #f1ac7eff;
    position: relative;
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
        <div class="relative w-full rounded-b-lg -mt-0.5 bg-buff p-4 border-2 border-vista-blue">
            <table
                v-if="tab == 'Overall'"
                class="table-fixed w-[600px] m-auto -mt-2 border-separate border-spacing-y-4 text-center"
            >
                <thead>
                    <tr class="">
                        <th class="w-[30px] pl-4 pr-4"></th>
                        <th class="w-[10px] pl-2 pr-2">{{ whitespace }}</th>
                        <th class="w-[150px] pl-2 pr-2">Username</th>
                        <th class="w-[10px] pl-2 pr-2">{{ whitespace }}</th>
                        <th class="w-[85px] pl-2 pr-2">Rating</th>
                        <th class="w-[85px] pl-2 pr-2">Wins</th>
                        <th class="w-[85px] pl-2 pr-2">Losses</th>
                        <th class="w-[85px] pl-2 pr-2">Winning Streak</th>
                    </tr>
                </thead>
                <tbody class="text-center">
                    <tr v-for="(item, index) in leaderboardData" :key="index" class="table-row">
                        <td class="text-dark-purple text-2xl">{{ index + 1 }}</td>
                        <td class="">{{ whitespace }}</td>
                        <td
                            class="border-2"
                            :class="
                                currentUser === item.user.id
                                    ? 'bg-vista-blue border-blush'
                                    : 'bg-amaranth-purple border-blush'
                            "
                        >
                            {{ item.user ? item.user.login : '' }}
                        </td>
                        <td>{{ whitespace }}</td>
                        <td class="w-[85px] bg-blush shadow-lg">{{ item.rating }}</td>
                        <td class="w-[85px] bg-blush shadow-lg">{{ item.wins }}</td>
                        <td class="w-[85px] bg-blush shadow-lg">{{ item.losses }}</td>
                        <td class="w-[85px] bg-blush shadow-lg">{{ item.winStreak }}</td>
                    </tr>
                </tbody>
            </table>
            <table
                v-if="tab === 'Practice Matches'"
                class="w-full border border-separate border-spacing-y-4 text-center shadow-md"
            >
                <thead>
                    <tr class="bg-gray-200">
                        <th class="w-full">Difficulty</th>
                        <th class="w-full">Matches Played</th>
                        <th class="w-full">Wins</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="bg-white">
                        <td class="w-full border">Easy</td>
                        <td class="w-full border">{{ practiceMatchData.practiceEasyPlayed }}</td>
                        <td class="w-full border">{{ practiceMatchData.practiceEasyWins }}</td>
                    </tr>
                    <tr class="bg-white">
                        <td class="w-full border">Normal</td>
                        <td class="w-full border">
                            {{ practiceMatchData.practiceNormalPlayed }}
                        </td>
                        <td class="w-full border">{{ practiceMatchData.practiceNormalWins }}</td>
                    </tr>
                    <tr class="bg-white">
                        <td class="w-full border">Hard</td>
                        <td class="w-full border">{{ practiceMatchData.practiceHardPlayed }}</td>
                        <td class="w-full border">{{ practiceMatchData.practiceHardWins }}</td>
                    </tr>
                    <tr class="bg-white">
                        <td class="w-full border">Expert</td>
                        <td class="w-full border">
                            {{ practiceMatchData.practiceImpossiblePlayed }}
                        </td>
                        <td class="w-full border">
                            {{ practiceMatchData.practiceImpossibleWins }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<!--<template>-->
<!--    <div>-->
<!--        <ul class="flex border-b">-->
<!--            <li class="-mb-px mr-1">-->
<!--                <a-->
<!--                    class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold"-->
<!--                    @click="tab = 'Overall'"-->
<!--                    :class="{-->
<!--                        'text-blue-700': tab === 'Overall',-->
<!--                        'text-blue-500 hover:text-blue-800': tab !== 'Overall'-->
<!--                    }"-->
<!--                    href="#"-->
<!--                    >Overall</a-->
<!--                >-->
<!--            </li>-->
<!--            <li class="mr-1">-->
<!--                <a-->
<!--                    class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold"-->
<!--                    @click="tab = 'Practice Matches'"-->
<!--                    :class="{-->
<!--                        'text-blue-700': tab === 'Practice Matches',-->
<!--                        'text-blue-500 hover:text-blue-800': tab !== 'Practice Matches'-->
<!--                    }"-->
<!--                    href="#"-->
<!--                    >Practice Matches</a-->
<!--                >-->
<!--            </li>-->
<!--        </ul>-->

<!--        <div class="p-6">-->
<!--            <table v-if="tab === 'Overall'" class="table-auto">-->
<!--                <thead>-->
<!--                    <tr>-->
<!--                        <th class="px-4 py-2">Username</th>-->
<!--                        <th class="px-4 py-2">Rating</th>-->
<!--                        <th class="px-4 py-2">Wins</th>-->
<!--                        <th class="px-4 py-2">Losses</th>-->
<!--                        <th class="px-4 py-2">Winning Streak</th>-->
<!--                    </tr>-->
<!--                </thead>-->
<!--                <tbody>-->
<!--                    <tr v-for="(item, index) in leaderboardData" :key="index">-->
<!--                        <td class="border px-4 py-2">{{ item.user ? item.user.login : '' }}</td>-->
<!--                        <td class="border px-4 py-2">{{ item.rating }}</td>-->
<!--                        <td class="border px-4 py-2">{{ item.wins }}</td>-->
<!--                        <td class="border px-4 py-2">{{ item.losses }}</td>-->
<!--                        <td class="border px-4 py-2">{{ item.winStreak }}</td>-->
<!--                    </tr>-->
<!--                </tbody>-->
<!--            </table>-->

<!--            <table v-else-if="tab === 'Practice Matches' && practiceMatchData" class="table-auto">-->
<!--                <thead>-->
<!--                    <tr>-->
<!--                        <th class="px-4 py-2">Difficulty</th>-->
<!--                        <th class="px-4 py-2">Matches Played</th>-->
<!--                        <th class="px-4 py-2">Wins</th>-->
<!--                    </tr>-->
<!--                </thead>-->
<!--                <tbody>-->
<!--                    <tr>-->
<!--                        <td class="border px-4 py-2">Easy</td>-->
<!--                        <td class="border px-4 py-2">-->
<!--                            {{ practiceMatchData.practiceEasyPlayed }}-->
<!--                        </td>-->
<!--                        <td class="border px-4 py-2">-->
<!--                            {{ practiceMatchData.practiceEasyWins }}-->
<!--                        </td>-->
<!--                    </tr>-->
<!--                    <tr>-->
<!--                        <td class="border px-4 py-2">Normal</td>-->
<!--                        <td class="border px-4 py-2">-->
<!--                            {{ practiceMatchData.practiceNormalPlayed }}-->
<!--                        </td>-->
<!--                        <td class="border px-4 py-2">-->
<!--                            {{ practiceMatchData.practiceNormalWins }}-->
<!--                        </td>-->
<!--                    </tr>-->
<!--                    <tr>-->
<!--                        <td class="border px-4 py-2">Hard</td>-->
<!--                        <td class="border px-4 py-2">-->
<!--                            {{ practiceMatchData.practiceHardPlayed }}-->
<!--                        </td>-->
<!--                        <td class="border px-4 py-2">-->
<!--                            {{ practiceMatchData.practiceHardWins }}-->
<!--                        </td>-->
<!--                    </tr>-->
<!--                    <tr>-->
<!--                        <td class="border px-4 py-2">Impossible</td>-->
<!--                        <td class="border px-4 py-2">-->
<!--                            {{ practiceMatchData.practiceImpossiblePlayed }}-->
<!--                        </td>-->
<!--                        <td class="border px-4 py-2">-->
<!--                            {{ practiceMatchData.practiceImpossibleWins }}-->
<!--                        </td>-->
<!--                    </tr>-->
<!--                </tbody>-->
<!--            </table>-->
<!--        </div>-->
<!--    </div>-->
<!--</template>-->

<script lang="ts">
import axios from 'axios'
import io from 'socket.io-client'

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
    practiceImpossiblePlayed: number
    practiceImpossibleWins: number
}

export default {
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
                practiceImpossiblePlayed: 0,
                practiceImpossibleWins: 0
            } as PracticeMatchData,
            currentUser: 0,
            whitespace: '  '
        }
    },
    mounted() {
        const userId = sessionStorage.getItem('user')
        if (userId === null) {
            this.$router.push('/')
        } else {
            this.currentUser = JSON.parse(userId).user.id
        }
        console.log('Current User: ' + this.currentUser)
        axios.get('http://localhost:8080/api/leaderboard').then((response) => {
            this.leaderboardData = Array.from(response.data)
        })
        axios.get('http://localhost:8080/api/leaderboard/' + this.currentUser).then((response) => {
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
