<template>
    <!--  create a scrolling list-->
    <div class="flex flex-col justify-center items-center mt-16">
        <div
            class="border-double border-4 text-buff relative border-buff rounded-md w-[50vw] min-w-[600px] pt-10 p-4 bg-dark-purple bg-opacity-60"
        >
            <h1
                class="text-2xl font-bold text-white absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dark-purple rounded-md border-2 border-buff px-4 py-2"
            >
                Members
            </h1>
            <ul>
                <li
                    v-for="(user, index) in chatStore.getChannelUsersByChannelId(
                        chatStore.channelInView
                    )"
                    :key="index"
                    class="py-1 px-2 my-2 flex items-center border border-buff rounded-md bg-dark-purple justify-between"
                >
                    <div class="flex items-center">
                        <img
                            class="rounded-full w-8 object-cover mr-3 aspect-square"
                            :src="`api/user/${user.id}/avatar`"
                            alt="avatar"
                        />
                        <a :href="'/profile/' + user.id">{{ user.login }}</a>
                        <p class="pl-2 text-xs opacity-50">{{ chatStore.getRole(user) }}</p>
                    </div>
                    <div v-if="user.id != userStore.id" class="space-x-4">
                        <button
                            class="-tracking-2 hover:opacity-60 transition-opacity"
                            @click="addAdmin(user.login)"
                        >
                            admin
                        </button>
                        <button @click="addMuted(user.login)">mute</button>
                        <button @click="addBanned(user.login)">ban</button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useChatStore } from '@/store/channel.store'
import { useUserStore } from '@/store/user.store'
import axios from 'axios'

export default defineComponent({
    name: 'GroupSettingUserList',
    setup() {
        const chatStore = useChatStore()
        const userStore = useUserStore()
        return { chatStore, userStore }
    },
    data(): any {
        return {
            adminText: '',
            mutedText: '',
            bannedText: '',
            userText: '',
            params: {
                userId: 0,
                userName: '',
                groupId: 0,
                channelId: 0
            },
            userName: '',
            groupName: ''
        }
    },
    async mounted() {
        this.userName = this.userStore.name
        this.groupName = this.chatStore.groupName
        this.params.userId = this.userStore.id
        this.params.channelId = this.chatStore.channelInView
        this.params.groupId = this.chatStore.groupId
    },
    methods: {
        addAdmin(login: string): void {
            this.params.userName = login
            axios
                .post('/api/chat/group/admin', this.params)
                .then((response) => {
                    console.log(response)
                })
                .catch((error) => {
                    console.log(error)
                    return
                })
            window.location.reload()
        },
        deleteAdmin(login: string): void {
            axios
                .delete('/api/chat/group/admin', { data: login })
                .then((response) => {
                    console.log(response)
                })
                .catch((error) => {
                    console.log(error)
                    return
                })
        },

        addMuted(login: string): void {
            this.params.userName = login
            axios
                .post('/api/chat/group/muted', this.params)
                .then((response) => {
                    console.log(response)
                })
                .catch((error) => {
                    console.log(error)
                    return
                })
        },
        deleteMuted(login: string): void {
            this.params.userName = login
            axios
                .delete('/api/chat/group/muted', { data: this.params })
                .then((response) => {
                    console.log(response)
                })
                .catch((error) => {
                    console.log(error)
                    return
                })
        },
        addBanned(login: string): void {
            this.params.userName = login
            axios
                .post('/api/chat/group/banned', this.params)
                .then((response) => {
                    console.log(response)
                })
                .catch((error) => {
                    console.log(error)
                    return
                })
        }
        // deleteBanned(login: string): void {
        //   this.params.userName = login
        //   axios
        //       .delete('/api/chat/group/banned', { data: this.params })
        //       .then((response) => {
        //         console.log(response)
        //       })
        //       .catch((error) => {
        //         console.log(error)
        //         return
        //       })
        // },
    }
})
</script>
