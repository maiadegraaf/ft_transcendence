<template>
    <div class="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
        <h1 class="text-5xl text-buff font-bold text-shadow-lg mb-8">Game Over</h1>
        <h3 class="text-3xl text-buff font-bold text-shadow-lg mb-8">{{ winner }}</h3>
        <button @click="reset" class="btn">Play Again</button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'GameOver',
    props: ['winner'],
    methods: {
        reset() {
            if (!this.$parent) {
                return
            }
            this.$parent.$emit('reset')
        }
    }
})
</script>

<style scoped></style>
