<template>
    <!--    <div-->
    <!--        v-if="chatStore.dmId == -1 && chatStore.dmName.length == 0"-->
    <!--        class="text-center border-buff flex-col h-full border-double border-t-4 flex justify-center items-center"-->
    <!--    >-->
    <!--        <ChatBubbleLeftRightIcon class="h-40 w-40 text-buff mx-auto" />-->
    <!--        <h2 class="p-3 text-buff font-semibold text-5xl">Welcome to the chat</h2>-->
    <!--        <p class="text-buff opacity-70">Start by adding a user/group or select one!</p>-->
    <!--    </div>-->
    <div class="border-buff border-double border-t-4 flex flex-col justify-end items-end h-full">
        <div
            class="flex max-h-full h-full flex-col w-full justify-between overflow-auto scrollbar-hide"
        >
            <div class="p-4 bg-dark-purple fixed w-full flex items-center z-10">
                <img
                    v-if="chatStore.dmId != -1"
                    @click="$router.push('/profile/' + chatStore.dmId)"
                    class="rounded-full w-10 aspect-square object-cover mr-3 cursor-pointer"
                    :src="`api/user/${chatStore.dmId}/avatar`"
                    alt="avatar"
                />
                <div>
                    <h2 class="text-buff font-semibold text-xl">
                        {{ chatStore.dmName }}
                    </h2>
                    <Transition name="appear">
                        <p class="opacity-60 text-xs absolute" v-if="isOnline">online</p>
                    </Transition>
                </div>
            </div>
            <div></div>
            <div class="flex flex-col-reverse overflow-x-hidden overflow-y-auto no-scrollbar mt-20">
                <div
                    v-for="(message, index) of chatStore.getCurrentMessages.slice().reverse()"
                    :key="index"
                >
                    <div class="" :class="posMessage(message.sender.id) + ' flex-col mb-1 mx-4'">
                        <div v-if="chatStore.getCurrentMessages.slice().reverse()[index + 1]">
                            <span
                                v-if="
                                    message.sender.id !=
                                    chatStore.getCurrentMessages.slice().reverse()[index + 1].sender
                                        .id
                                "
                                class="text-xs opacity-60 pb-1 pr-1"
                                >{{ message.sender.login }}</span
                            >
                        </div>
                        <div v-else>
                            <span class="text-xs opacity-60 pb-1 pr-1">{{
                                message.sender.login
                            }}</span>
                        </div>
                        <div v-if="message.text == 'Invite'">
                          <button class="text-buff px-2 py-1 hover:opacity-70 transition-all my-2 border border-buff rounded-md border-double border-4" @click="acceptInvite">Join the game!</button>
                        </div>
                        <div v-else
                            :class="
                                'inline break-all box-border text-sm p-1 px-4 rounded-xl text-l ' +
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
import { useChatStore } from '../../../store/channel.store'
import { useUserStore } from '@/store/user.store'
import { defineComponent } from 'vue'
import MessageInput from '@/components/Chat/Message_panel/MessageInput.vue'
import { ChatBubbleLeftRightIcon } from '@heroicons/vue/24/solid'

export default defineComponent({
    components: {
        MessageInput,
        ChatBubbleLeftRightIcon
    },
    name: 'MessageList',
    data() {
        return {
            isOnline: false
        }
    },
    setup() {
        const chatStore = useChatStore()
        const userStore = useUserStore()
        return { chatStore, userStore }
    },
    beforeUpdate() {
        this.userStore.socket.emit('checkUserOnline', {
            userId: this.chatStore.dmId
        })
        this.userStore.socket.on('userOnline', (userId: number) => {
            if (userId == this.chatStore.dmId) this.isOnline = true
        })
        this.userStore.socket.on('userOffline', (userId: number) => {
            if (userId == this.chatStore.dmId) this.isOnline = false
        })
    },
    methods: {
        posMessage(senderId: number): string {
            if (senderId == this.userStore.id) {
                return 'flex items-end'
            } else {
                return 'flex items-start'
            }
        },
        colorMessage(senderId: number): string {
            if (senderId == this.userStore.id) {
                return 'bg-blush'
            } else {
                return 'bg-gray-700'
            }
        },
        // Testing invite
        acceptInvite() {
            console.log('Accepting invite')
            console.log(this.userStore.id, this.chatStore.dmId)
            this.$router.push({
                name: 'wait',
                params: {
                    senderId: this.userStore.id,
                    opponentId: this.chatStore.dmId
                }
            })
        },
    }
})
</script>

<style scoped>
.appear-enter-active {
    transition: opacity 0.3s ease;
}
.appear-enter-from {
    opacity: 0;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}
</style>
