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
    <div class="text-center border-buff flex-col h-full border-double border-t-4 flex justify-center items-center overflow-hidden">
        <div class="my-auto">
            <ChatBubbleLeftRightIcon class="h-40 w-40 text-buff mx-auto" />
          <h2 class="p-3 text-buff font-semibold text-5xl">Welcome to the chat</h2>
          <p class="text-buff opacity-70">Start by adding a user/group or select one!</p>
        </div>
    </div>
</template>

<style scoped></style>
