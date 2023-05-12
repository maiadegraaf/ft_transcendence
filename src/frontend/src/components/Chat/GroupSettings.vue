<template>
    <div class="w-full h-full flex border-buff border-double border-t-4 flex-col">
        <div class="flex justify-between p-4">
            <button @click="doneGroup" class="hover:opacity-60 transition-opacity">
                <ChevronLeftIcon class="h-8 w-8 text-buff" />
            </button>
            <h2 class="text-buff text-2xl font-semibold uppercase">settings</h2>
            <span class="w-8"></span>
        </div>
        <GroupSettingUserList />
        <div class="flex-1 w-full overflow-hidden">
            <h2>Users</h2>
            <input
                v-model="userText"
                placeholder="enter user name"
                class="w-full focus:outline-none"
            />
            <button @click="addUser">add user</button>
            <div></div>
            <button @click="deleteUser">delete user</button>
        </div>

        <footer class="bg-normal w-full min-h-10">
            <div class="p-3 flex">
                <button @click="doneGroup" class="rounded-full">done</button>
            </div>
        </footer>
    </div>
</template>

<script lang="ts">
import { useChatStore } from '../../store/channel.store'
import axios from 'axios'
import MessageList from '@/components/Chat/MessageList.vue'
import { useUserStore } from '@/store/user.store'
import { defineComponent } from 'vue'
import type { IUser } from '@/types/types'
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'

import GroupSettingUserList from '@/components/Chat/GroupSettingUserList.vue'

export default defineComponent({
    name: 'GroupSettings',
    components: { GroupSettingUserList, ChevronLeftIcon },
    // props: ['chatStore']
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
        // this.profile = this.chatStore.getProfileByChannelId(this.chatStore.channelInView)
        // console.log(this.channelUsers)
        // console.log(this.profile)
    },
    methods: {
        doneGroup(): void {
            this.chatStore.setGroupId(0)
            this.chatStore.setGroupName('')
            this.$emit('switch-chat-right-component', MessageList)
        },

        addUser(): void {
            // Validates the input before sending the message.
            if (this.userText.length <= 0) {
                this.userText = ''
                return
            }

            this.params.userName = this.userText
            console.log('test username: ' + this.params.userName)

            axios
                .post('/api/chat/group/user', this.params)
                .then((response) => {
                    console.log(response)
                    // this.redirectGroupPannel()
                })
                .catch((error) => {
                    console.log(error)
                    this.userText = ''
                    return
                })
            this.userText = ''
        },
        deleteUser(): void {
            // Validates the input before sending the message.
            if (this.userText.length <= 0) {
                this.userText = ''
                return
            }

            this.params.userName = this.userText
            console.log('test username: ' + this.params.userName)

            axios
                .delete('/api/chat/group/user', { data: this.params })
                .then((response) => {
                    console.log(response)
                    // this.redirectGroupPannel()
                })
                .catch((error) => {
                    console.log(error)
                    this.userText = ''
                    return
                })
            this.userText = ''
        },



        deleteGroup(): void {
            this.params.userName = this.userStore.name
            axios
                .delete('/api/chat/group', { data: this.params })
                .then((response) => {
                    console.log(response)
                    if (response.data == true) {
                        this.doneGroup()
                    }
                    // this.redirectGroupPannel()
                })
                .catch((error) => {
                    console.log(error)
                    return
                })
        }

        // getRole(user: IUser): string {
        //   let str = ''
        //
        //   const profile = this.chatStore.getProfileByChannelId(this.chatStore.channelInView)
        //   if (profile) {
        //     if (profile.owner.id === user.id) {
        //       str += ' | (Owner)'
        //     }
        //     if (profile.admin.find((adm) => adm.id === user.id)) {
        //       str +=  ' | (Admin)'
        //     }
        //     if (profile.muted.find((mtd) => mtd.id === user.id)) {
        //       str +=  ' | (Muted)';
        //     }
        //   }
        //   return str;
        // },
    },
    created() {}
})
</script>

<style scoped>
input {
    color: black;
}
</style>
