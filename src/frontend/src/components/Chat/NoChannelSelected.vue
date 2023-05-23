<script lang="ts">
import { ChatBubbleLeftRightIcon } from '@heroicons/vue/24/outline'
import { defineComponent } from 'vue'
import MessageList from "@/components/Chat/Message_panel/MessageList.vue";
import { useChatStore } from '@/store/channel.store'

export default defineComponent({
    name: 'NoChannelSelected',
    setup() {
      const chatStore = useChatStore()
      return { chatStore }
    },
    components: {
        ChatBubbleLeftRightIcon
    },
    mounted() {
      if (this.chatStore.channelInView > -1) {
        this.$emit('switch-chat-right-component', MessageList)
      }

    }
})
</script>

<template>
    <div
        class="text-center border-buff flex-col h-full border-double border-t-4 flex justify-center items-center overflow-hidden"
    >
        <div class="my-auto">
            <ChatBubbleLeftRightIcon class="h-40 w-40 text-buff mx-auto" />
            <h2 class="p-3 text-buff font-semibold text-5xl">Welcome to the chat</h2>
            <p class="text-buff opacity-70">Start by adding a user/group or select one!</p>
        </div>
    </div>
</template>

<style scoped></style>
