<template>
    <div class="w-full h-full flex border-buff border-double border-t-4 flex-col">
        <div class="flex justify-between p-4">
            <button @click="doneGroup" class="hover:opacity-60 transition-opacity">
                <ChevronLeftIcon class="h-8 w-8 text-buff" />
            </button>
            <h2 class="text-buff text-2xl font-semibold uppercase">settings</h2>
            <button
                @click="deleteGroup"
                class="hover:opacity-60 transition-opacity text-buff font-semibold"
                alt="Delete Group"
            >
                <TrashIcon class="h-8 w-8 text-buff" />
            </button>
        </div>
        <GroupSettingUserList />
        <!-- <div class="flex-1 w-full overflow-hidden">
            <h2>Users</h2>
            <input
                v-model="userText"
                placeholder="enter user name"
                class="w-full focus:outline-none"
            />
            <button @click="addUser">add user</button>
            <div></div>
            <button @click="deleteUser">delete user</button>
        </div> -->
        <div class="flex flex-col pt-10 items-center justify-center">
            <label class="text-xl text-buff mb-1 font-semibold uppercase">
                Add new groupmembers by username:
            </label>
            <input
                type="text"
                v-model="userText"
                class="border p-0.5 border-buff rounded mt-3 appearance-none bg-transparent outline-none"
                @keyup.enter="searchForUser"
            />
            <div class="h-10 flex items-center text-buff">
                <p v-if="searchError" class="font-bold text-blush">{{ searchError }}</p>
                <span class="pr-3 font-semibold" v-if="searchResult && !searchError">{{
                    searchResult.login
                }}</span>
                <button
                    class="text-xs border rounded-md p-0.5 px-2 border-buff cursor-pointer hover:opacity-60 transition-opacity"
                    v-if="searchResult && !searchError"
                    @click="addUser"
                >
                    add
                </button>
            </div>
        </div>

        <div class="w-full min-h-10">
            <div class="text-center">
                <button
                    @click="doneGroup"
                    class="hover:opacity-70 transition-opacity font-semibold uppercase text-buff border-4 border-double border-buff rounded-md p-2 px-5"
                >
                    done
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useChatStore } from '../../../store/channel.store'
import axios from 'axios'
import MessageList from '@/components/Chat/Message_panel/MessageList.vue'
import { useUserStore } from '@/store/user.store'
import { defineComponent } from 'vue'
import { ChevronLeftIcon, TrashIcon } from '@heroicons/vue/24/outline'
import GroupSettingUserList from '@/components/Chat/Group_panel/GroupSettingUserList.vue'

interface User {
    id: number
    login: string
}

export default defineComponent({
    name: 'GroupSettings',
    components: { GroupSettingUserList, ChevronLeftIcon, TrashIcon },
    setup() {
        const chatStore = useChatStore()
        const userStore = useUserStore()
        return { chatStore, userStore }
    },
    data(): any {
        return {
            userText: '',
            params: {
                userName: '',
                groupId: 0,
                channelId: 0
            },
            groupName: '',
            searchError: '',
            searchResult: null as User | null
        }
    },
    async mounted() {
        this.userName = this.userStore.name
        this.groupName = this.chatStore.getChannelName
        this.params.channelId = this.chatStore.channelInView
        this.params.groupId = this.chatStore.getChannelGroupId
        // this.profile = this.chatStore.getProfileByChannelId(this.chatStore.channelInView)
        // console.log(this.channelUsers)
        // console.log(this.profile)
    },
    methods: {
        doneGroup(): void {
            this.$emit('switch-chat-right-component', MessageList)
        },

        addUser(): void {
            // Validates the input before sending the message.
            if (this.userText.length <= 0) {
                this.userText = ''
                return
            }

            this.params.userName = this.userText
            axios
                .post('/api/chat/group/user', this.params)
                .then((response) => {
                    console.log(response)
                })
                .catch((error) => {
                    console.log(error)
                    this.userText = ''
                    return
                })
            this.userText = ''
            this.searchResult = null
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
        },

        async searchForUser() {
            this.searchError = null
            if (!this.userText) {
                this.searchResult = null
                return
            }
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/user/search/${this.userText}`
                )
                this.searchResult = response.data
                this.searchError = null
            } catch (error) {
                this.searchResult = null
                this.searchError = `No user found with username "${this.userText}"`
            }
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
    color: white;
}
</style>
