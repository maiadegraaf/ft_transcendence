<template>
    <div class="w-full h-full flex border-buff border-double border-t-4 flex-col">
        <div class="flex justify-between p-4">
            <button @click="doneGroup" class="hover:opacity-60 transition-opacity">
                <ChevronLeftIcon class="h-8 w-8 text-buff" />
            </button>
            <h2 class="text-buff text-2xl font-semibold uppercase">settings</h2>
          <div class="flex justify-center items-center">
            <button
                @click="leaveGroup"
                class="hover:opacity-60 transition-opacity text-buff font-semibold mr-2"
                alt="Delete Group"
            >Leave</button>
            <button
                @click="deleteGroup"
                class="hover:opacity-60 transition-opacity text-buff font-semibold"
                alt="Delete Group"
            >
                <TrashIcon class="h-8 w-8 text-buff" />
            </button>
          </div>
        </div>
        <GroupSettingUserList/>
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
    computed: {
      getParams(): any {
        const params : any = {
          userName : this.userStore.name,
          channelId: this.chatStore.channelInView,
          groupId: this.chatStore.getCurrentGroupId
        }
        return params
      },
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
            this.params = this.getParams
            this.params.userName = this.userText
            axios
                .post('/api/chat/group/user', this.params)
                .catch((error) => {
                    this.userText = ''
                    return
                })
            this.userText = ''
            this.searchResult = null
        },
        deleteGroup(): void {
            this.params = this.getParams
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
                    return
                })
        },
        leaveGroup(): void {
          this.params = this.getParams
          axios.delete('api/chat/group/leave', { data: this.params })
              .then((response) => {
                console.log(response)
                if (response.data == true) {
                  this.doneGroup()
                }
              })
              .catch(() => {
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
    },
    created() {}
})
</script>

<style scoped>
input {
    color: white;
}
</style>
