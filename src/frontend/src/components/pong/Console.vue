<template>
    <div
        class="mx-auto w-[800px] h-[500px] relative border-double border-t-4 border-b-4 border-buff bg-dark-purple"
    >
        <div v-if="!gameOver" ref="pongGame">
            <div
                class="absolute w-[20px] h-[100px] bg-white"
                :style="{ top: player1.y + 'px', left: player1.x + 'px' }"
            ></div>
            <div
                class="absolute w-[20px] h-[100px] bg-white -translate-x-1/2"
                :style="{ top: player2.y + 'px', left: player2.x + 'px' }"
            ></div>
            <div
                class="absolute w-[20px] h-[20px] bg-white rounded-full -translate-x-1/2"
                :style="{ top: ball.y + 'px', left: ball.x + 'px' }"
            ></div>
            <div
                class="absolute top-2 left-1/2 transform -translate-x-1/2 text-white text-3xl font-bold p-3"
            >
                <span class="p-4">{{ player1.score }}</span>
                <span class="p-4">{{ player2.score }}</span>
            </div>
            <div class="volley">
                <span class="font-bold text-white text-xl p-2">{{ volley }}</span>
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
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'Console',
    components: { Instructions, GameOver },
    props: ['player1', 'player2', 'ball', 'gameOver', 'winner', 'volley']
})
</script>

<style scoped>
.volley {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    background-color: #170623;
    border: 1px dashed #f1ac7eff;
    z-index: 1;
}
</style>
