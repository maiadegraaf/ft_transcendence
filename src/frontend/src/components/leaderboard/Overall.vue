<template>
    <table
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
                <td
                    class="text-2xl"
                    :class="currentUser === item.user.id ? 'text-buff' : 'text-vista-blue'"
                >
                    {{ index + 1 }}
                </td>
                <td class="">{{ whitespace }}</td>
                <td
                    class="text-dark-purple row-both"
                    :class="currentUser === item.user.id ? 'bg-buff' : 'bg-vista-blue'"
                >
                    <a :href="'/profile/' + item.user.id">
                        {{ item.user ? item.user.login : '' }}
                    </a>
                </td>

                <td>{{ whitespace }}</td>
                <td
                    class="w-[85px] row-left bg-dark-purple border-t-2 border-b-2 border-l-2 shadow-lg"
                    :class="
                        currentUser === item.user.id
                            ? 'border-buff text-buff'
                            : 'border-vista-blue text-vista-blue'
                    "
                >
                    {{ item.rating }}
                </td>
                <td
                    class="w-[85px] bg-dark-purple border-t-2 border-b-2 shadow-lg"
                    :class="
                        currentUser === item.user.id
                            ? 'border-buff text-buff'
                            : 'border-vista-blue text-vista-blue'
                    "
                >
                    {{ item.wins }}
                </td>
                <td
                    class="w-[85px] bg-dark-purple border-t-2 border-b-2 shadow-lg"
                    :class="
                        currentUser === item.user.id
                            ? 'border-buff text-buff'
                            : 'border-vista-blue text-vista-blue'
                    "
                >
                    {{ item.losses }}
                </td>
                <td
                    class="w-[85px] row-right bg-dark-purple border-t-2 border-b-2 border-r-2 shadow-lg"
                    :class="
                        currentUser === item.user.id
                            ? 'border-buff text-buff'
                            : 'border-vista-blue text-vista-blue'
                    "
                >
                    {{ item.winStreak }}
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
export default {
    name: 'Overall',
    props: ['leaderboardData', 'currentUser', 'whitespace']
}
</script>

<style scoped></style>
