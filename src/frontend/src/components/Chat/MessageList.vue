<template>
    <header class="border-buff border border-1 rounded-r-md flex h-16">
        <h2 class="h2">Messages</h2>
    </header>
    <div class="flex-1 w-full bg-dark-purple overflow-hidden">
        <div class="max-w-full h-full max-h-full flex flex-col-reverse overflow-y-auto">
            <div v-for="message of chatStore.getChannelInView.slice().reverse()" :key="message.id">
                <div :class="posMessage(message.sender.id) + ' block mb-1 mx-2'">
                    <div
                        :class="
                            'inline box-border font-bold text-sm p-1 rounded-md ' +
                            colorMessage(message.sender.id)
                        "
                    >
                        {{ message.text }}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <MessageInput />
</template>

<script lang="ts">
import { useChatStore } from '../../store/channel.store'
import { useUserStore } from '@/store/user.store'
import { defineComponent } from 'vue'
import MessageInput from '@/components/Chat/MessageInput.vue'

export default defineComponent({
    components: {
        MessageInput
    },
    name: 'MessageList',
    setup() {
        const chatStore = useChatStore()
        const userStore = useUserStore()
        return { chatStore, userStore }
    },
    methods: {
        posMessage(senderId: number): string {
            if (senderId == this.userStore.id) {
                return 'flex justify-end'
            } else {
                return 'flex justify-start'
            }
        },
        colorMessage(senderId: number): string {
            if (senderId == this.userStore.id) {
                return 'bg-amaranth-purple'
            } else {
                return 'bg-grey-darken-2'
            }
        }
    }
})
</script>

<style scoped></style>
