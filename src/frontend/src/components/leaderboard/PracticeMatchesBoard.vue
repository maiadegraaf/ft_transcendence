<template>
    <table
        class="table-fixed w-[300px] m-auto -mt-2 border-separate border-spacing-y-4 text-center"
    >
        <thead>
            <tr class="">
                <th class="w-[150px] pl-4 pr-4"></th>
                <th class="w-[10px] pl-2 pr-2">{{ whitespace }}</th>
                <th class="w-[85px] pl-2 pr-2">Matches Played</th>
                <th class="w-[85px] pl-2 pr-2">Wins</th>
            </tr>
        </thead>
        <tbody>
            <PracticeMatchRow
                :played="practiceMatchData.practiceEasyPlayed"
                :wins="practiceMatchData.practiceEasyWins"
                :color="easy"
                :whitespace="whitespace"
                difficulty="Easy"
            />
            <PracticeMatchRow
                :played="practiceMatchData.practiceNormalPlayed"
                :wins="practiceMatchData.practiceNormalWins"
                :color="normal"
                :whitespace="whitespace"
                difficulty="Normal"
            />
            <PracticeMatchRow
                :played="practiceMatchData.practiceHardPlayed"
                :wins="practiceMatchData.practiceHardWins"
                :color="hard"
                :whitespace="whitespace"
                difficulty="Hard"
            />
            <PracticeMatchRow
                :played="practiceMatchData.practiceImpossiblePlayed"
                :wins="practiceMatchData.practiceImpossibleWins"
                :color="impossible"
                :whitespace="whitespace"
                difficulty="Impossible"
            />
        </tbody>
    </table>
</template>

<script lang="ts">
import PracticeMatchRow from '@/components/leaderboard/PracticeMatchRow.vue'

export default {
    name: 'PracticeMatchesBoard',
    components: { PracticeMatchRow },
    props: ['practiceMatchData', 'currentUser', 'whitespace'],
    data() {
        return {
            easy: '#C9DAF8',
            normal: '#81A9EE',
            hard: '#3A78E4',
            impossible: '#1942B3'
        }
    }
}
</script>

<style scoped></style>
