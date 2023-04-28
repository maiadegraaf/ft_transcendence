<template>
    <footer class="bg-normal w-full min-h-10">
        <div class="p-3 flex">
            <div class="flex-1 p-1 bg-white rounded-md">
                <input
                    v-model="text"
                    placeholder="Type a message..."
                    class="w-full focus:outline-none"
                    @keyup.enter="sendMessage"
                />
            </div>
            <button @click="sendMessage" class="rounded-full ml-3 hover:shadow-md">></button>
        </div>
    </footer>
</template>

<script lang="ts">
import { UserChatStore } from '@/store/store'
import type { IMessage } from '@/store/types'

export default {
    name: 'MessageInput',
    setup() {
        const chatStore = UserChatStore()
        return { chatStore }
    },
    data(): any {
        return {
            id: 0,
            text: '',
            sender: {
                id: 0,
                login: ''
            },
            channel: 0
        }
    },
    mounted() {
        this.sender.id = this.chatStore.userId
        this.sender.login = this.chatStore.name
        console.log(this.$data)
    },
    methods: {
        sendMessage(): void {
            // Validates the input before sending the message.
            this.channel = this.chatStore.channelInView
            if (this.text.length > 0) {
                this.chatStore.socket.emit('msgToServer', this.$data)
                // Resets the input field.
                this.text = ''
            }
        }
    }
}
</script>

<style scoped></style>
