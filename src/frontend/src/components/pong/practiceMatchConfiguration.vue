<template>
    <div class="flex flex-col items-center">
        <label for="winningScore" class="mb-4 flex items-center">
            <span class="mr-2 text-2xl font-bold text-buff">Winning Score:</span>
            <input
                value="10"
                type="number"
                id="winningScore"
                v-model.number="winningScore"
                min="1"
                class="w-16 px-2 py-1 text-2xl font-bold rounded-lg border border-solid border-amaranth-purple bg-buff text-amaranth-purple focus:text-buff focus:bg-amaranth-purple focus:outline-none focus:border-amaranth-purple"
            />
        </label>
        <label for="difficulty" class="mb-4 flex items-center">
            <span class="mr-2 text-2xl font-bold text-buff">Difficulty:</span>
            <select
                id="difficulty"
                v-model="selectedDifficulty"
                class="w-32 px-4 py-2 text-2xl font-bold text-amaranth-purple focus:text-buff rounded-lg border border-amaranth-purple border-solid focus:outline-none bg-buff focus:outline-none focus:bg-amaranth-purple focus:outline-none focus:border-amaranth-purple"
            >
                <option value="EASY">Easy</option>
                <option value="NORMAL">Normal</option>
                <option value="HARD">Hard</option>
                <option value="IMPOSSIBLE">Impossible</option>
            </select>
        </label>
        <button @click="start" class="btn">Start Game</button>
    </div>
</template>

<script lang="ts">
interface practiceSettingsInterface {
    score: number
    difficulty: string
    userId: string
}

enum Difficulty {
    EASY = 'EASY',
    NORMAL = 'NORMAL',
    HARD = 'HARD',
    IMPOSSIBLE = 'IMPOSSIBLE'
}
export default {
    name: 'practiceMatchConfiguration',
    props: ['userId'],
    enums: {
        Difficulty
    },
    data() {
        return {
            winningScore: 10,
            selectedDifficulty: 'EASY',
            multipleConnectionsError: false
        }
    },
    methods: {
        start() {
            console.log('Starting game by ' + this.userId)
            switch (this.selectedDifficulty) {
                case 'EASY':
                    this.selectedDifficulty = Difficulty.EASY
                    break
                case 'NORMAL':
                    this.selectedDifficulty = Difficulty.NORMAL
                    break
                case 'HARD':
                    this.selectedDifficulty = Difficulty.HARD
                    break
                case 'IMPOSSIBLE':
                    this.selectedDifficulty = Difficulty.IMPOSSIBLE
                    break
            }
            let practiceSettings: practiceSettingsInterface = {
                score: this.winningScore,
                difficulty: this.selectedDifficulty,
                userId: this.userId
            }
            console.log(practiceSettings)
            this.$emit('start-practice', practiceSettings)
            return
        }
    }
}
</script>

<style scoped></style>
