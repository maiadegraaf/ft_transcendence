<template>
    <div v-if="chatStore.dmId == -1 && chatStore.dmName.length == 0" class="border-buff flex-col h-full border-double border-t-4 flex justify-center items-center">
        <h2 class="p-3 text-buff font-semibold text-5xl">Welcome to the chat</h2>
        <p class="text-buff opacity-70">Start by adding a user/group or select one!</p>
    </div>
    <div v-else class="border-buff border-double border-t-4 flex flex-col justify-end items-end h-full">
        <div class="flex-1 w-full">
            <div class="max-w-full h-full max-h-full flex flex-col-reverse overflow-y-auto">
                <div
                    v-for="message of chatStore.getChannelInView.slice().reverse()"
                    :key="message.id"
                >
                    <div :class="posMessage(message.sender.id) + ' block mb-1 mx-4'">
                        <div
                            :class="
                                'inline box-border text-sm p-1 px-4 rounded-xl text-l ' +
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
    </div>
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
                return 'bg-blush'
            } else {
                return 'bg-gray-700'
            }
        }
    }
})
</script>

<style scoped></style>
