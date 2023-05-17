<template>
<!--    <div-->
<!--        v-if="chatStore.dmId == -1 && chatStore.dmName.length == 0"-->
<!--        class="text-center border-buff flex-col h-full border-double border-t-4 flex justify-center items-center"-->
<!--    >-->
<!--        <ChatBubbleLeftRightIcon class="h-40 w-40 text-buff mx-auto" />-->
<!--        <h2 class="p-3 text-buff font-semibold text-5xl">Welcome to the chat</h2>-->
<!--        <p class="text-buff opacity-70">Start by adding a user/group or select one!</p>-->
<!--    </div>-->
    <div
        class="border-buff border-double border-t-4 flex flex-col justify-end items-end h-full"
    >
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
                <h2 class="text-buff font-semibold text-xl">
                    {{ chatStore.dmName }}
                </h2>
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
                        <div v-if="message.text == 'Invite'" class="text-buff"><button @click="acceptInvite(message.sender)">Invite</button></div>
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
import { useChatStore } from '../../store/channel.store'
import { useUserStore } from '@/store/user.store'
import { defineComponent } from 'vue'
import MessageInput from '@/components/Chat/MessageInput.vue'
import {ChatBubbleLeftRightIcon} from "@heroicons/vue/24/solid";

export default defineComponent({
    components: {
        MessageInput,
        ChatBubbleLeftRightIcon
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
        acceptInvite(sender: any) {
          this.userStore.socket.emit('createMatch', { player1: this.userStore.id, player2: sender.id })
          this.userStore.socket.on('opponentFound', ( matchId: number ) => {
            console.log('Opponent found')
            console.log(matchId)
            this.$router.push({
              name: 'Pong',
              params: {
                matchid: matchId
              }
            })
          })
        }
    }
})
</script>

<style scoped>
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
