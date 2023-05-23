<template>
    <footer class="bg-dark-purple w-full min-h-10">
        <div class="p-3 flex">
            <div class="flex-1 p-1 bg-white rounded-md">
                <input
                    v-model="text"
                    placeholder="Type a message..."
                    class="w-full text-black focus:outline-none"
                    @keyup.enter="sendMessage"
                />
            </div>
            <button
                @click="sendInvite"
                class="ml-3 text-buff hover:opacity-60 transition-all font-semibold"
            >
                Invite
            </button>
            <button @click="sendMessage" class="ml-3 hover:opacity-60 transition-all">
                <PaperAirplaneIcon class="h-8 w-8 text-buff" />
            </button>
        </div>
    </footer>
</template>

<script lang="ts">
import { useChatStore } from '@/store/channel.store'
import { useUserStore } from '@/store/user.store'
import { PaperAirplaneIcon } from '@heroicons/vue/24/outline'
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'MessageInput',
    components: {
        PaperAirplaneIcon
    },
    setup() {
        const chatStore = useChatStore()
        const userStore = useUserStore()
        return { chatStore, userStore }
    },
    data(): any {
        return {
            matchId: 0,
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
        this.sender.id = this.userStore.id
        this.sender.login = this.userStore.name
        console.log(this.$data)
    },
    methods: {
        sendMessage(): void {
            // Validates the input before sending the message.
            this.channel = this.chatStore.channelInView
            if (this.text.length > 0) {
                this.userStore.socket.emit('msgToServer', this.$data)
                // Resets the input field.
                this.text = ''
            }
        },
        sendInvite(): void {
            console.log('Sending invite')
            this.text = 'Invite'
            this.channel = this.chatStore.channelInView
            this.userStore.socket.emit('msgToServer', this.$data)
            this.userStore.socket.on('opponentFound', (matchId: number) => {
                console.log('Opponent found')
                console.log(matchId)
                this.$router.push({ name: 'Pong'})
            })
        }
    }
})
</script>

<style scoped></style>
