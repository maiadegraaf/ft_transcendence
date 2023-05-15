<script lang="ts">
import { ChatBubbleLeftRightIcon } from '@heroicons/vue/24/outline'
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'NoChannelSelected',
    components: {
        ChatBubbleLeftRightIcon
    }
})
</script>

<template>
    <div class="flex-1 flex justify-center w-full bg-dark-purple overflow-hidden">
        <div class="my-auto">
            <ChatBubbleLeftRightIcon class="h-40 w-40 text-buff mx-auto" />
            <h1 class="text-center text-3xl text-buff">Select a channel to start chatting</h1>
        </div>
    </div>
</template>

<style scoped></style>
