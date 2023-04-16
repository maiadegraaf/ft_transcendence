<template>
    <div
        class="mx-auto w-[800px] relative w-full aspect-video border-double border-4 border-buff bg-dark-purple"
    >
        <div v-if="!gameOver" ref="pongGame">
            <div class="absolute left-5 w-5 h-24 bg-white" :style="{ top: player1.y + 'px' }"></div>
            <div
                class="absolute right-5 w-5 h-24 bg-white"
                :style="{ top: player2.y + 'px' }"
            ></div>
            <div
                class="absolute w-5 h-5 bg-white rounded-full"
                :style="{ top: ball.y + 'px', left: ball.x + 'px' }"
            ></div>
            <div
                class="absolute top-2 left-1/2 transform -translate-x-1/2 text-white text-3xl font-bold p-3"
            >
                <span class="p-4">{{ player1.score }}</span>
                <span class="p-4">{{ player2.score }}</span>
            </div>
            <div class="absolute inset-y-0 left-1/2 border-l border-dashed border-buff"></div>
        </div>
        <div v-else><GameOver :winner="winner" /></div>
    </div>
    <Instructions />
</template>

<script lang="ts">
import GameOver from '@/components/pong/GameOver.vue'
import Instructions from '@/components/pong/Instructions.vue'

export default {
    name: 'Console',
    components: { Instructions, GameOver },
    props: ['player1', 'player2', 'ball', 'gameOver', 'winner']
}
</script>

<style scoped></style>
