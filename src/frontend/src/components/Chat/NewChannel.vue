<template>
    <div class="w-full h-full flex border-buff border-double border-t-4 flex-col">
        <div class="flex justify-between p-4">
            <button @click="goBack" class="hover:opacity-60 transition-opacity">
                <ChevronLeftIcon class="h-8 w-8 text-buff" />
            </button>
            <h2 class="text-buff text-2xl font-semibold uppercase">New channel</h2>
            <span class="w-8"></span>
        </div>
        <div class="flex justify-center items-center flex-col w-full">
            <div class="div_input_new_channel">
                <input
                    v-model="joinGroupText"
                    placeholder="Join an Existing Group"
                    class="input_new_channel"
                />
                <button
                    @click="joinGroup"
                    class="text-buff text-center font-semibold pt-2 uppercase hover:opacity-70 transition-opacity"
                >
                    Join
                </button>
                <p v-if="searchErrorJOIN" class="font-bold text-blush">{{ searchErrorJOIN}}</p>
            </div>
            <div class="div_input_new_channel">
                <input v-model="groupText" placeholder="New Group Name" class="input_new_channel" />
                <div>
                    <ul class="text-buff">
                        <li class="flex items-center">
                            <input
                                type="radio"
                                :value="Form.PRIVATE"
                                id="private"
                                v-model="checkedBox"
                                class="radio_button"
                            />
                            <label for="private">Private</label>
                        </li>
                        <li class="flex items-center">
                            <input
                                type="radio"
                                :value="Form.PUBLIC"
                                id="public"
                                v-model="checkedBox"
                                class="radio_button"
                            />
                            <label for="public">Public</label>
                        </li>
                        <li class="flex items-center">
                            <input
                                type="radio"
                                :value="Form.PROTECTED"
                                id="protected"
                                v-model="checkedBox"
                                class="radio_button"
                            />
                            <label for="protected">Protected</label>
                        </li>
                    </ul>
                    <div class="w-full text-center">
                        <button
                            class="text-buff text-center font-semibold pt-2 uppercase hover:opacity-70 transition-opacity"
                            @click="createGroup"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
            <div class="div_input_new_channel">
                <input v-model="dmText" placeholder="Dm user..." class="input_new_channel" />
                <button
                    @click="dmNewUser"
                    class="text-buff text-center font-semibold pt-2 uppercase hover:opacity-70 transition-opacity"
                >
                    dm user
                </button>
                <p v-if="searchErrorDM" class="font-bold text-blush">{{ searchErrorDM}}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useChatStore } from '@/store/channel.store'
import axios, { AxiosError } from 'axios';
import { EGroupChannelType } from '@/types/types'
import { defineComponent } from 'vue'
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'
import SetPassword from '@/components/Chat/SetPassword.vue'
import EnterPassword from '@/components/Chat/EnterPassword.vue'
import NoChannelSelected from '@/components/Chat/NoChannelSelected.vue'

const Form = {
    PRIVATE: 0,
    PUBLIC: 1,
    PROTECTED: 2
}
interface ErrorResponse {
  message: string;
}

export default defineComponent({
    name: 'NewChannel',
    components: {
        ChevronLeftIcon
    },
    setup() {
        const chatStore = useChatStore()
        return { chatStore }
    },
    data(): any {
        return {
            Form: Form,
            checkedBox: Form.PRIVATE,
            dmText: '',
            groupText: '',
            joinGroupText: '',
            searchErrorDM: null as string | null,
            searchErrorJOIN: null as string | null,
        }
    },
    mounted() {
        this.chatStore.setChannelInView(-1)
    },
    methods: {
        createGroup(): void {
            if (this.checkedBox == Form.PRIVATE) {
                this.newPrivateGroupChannel()
            } else if (this.checkedBox == Form.PUBLIC) {
                this.newPublicGroupChannel()
            } else if (this.checkedBox == Form.PROTECTED) {
                this.newProtectedGroupChannel()
            }
        },
        async dmNewUser() {
            // Validates the input before sending the message.
            if (this.dmText.length <= 0) {
                this.dmText = ''
                return
            }
            const param = {
                invitee: this.dmText
            }
            try {
              await axios.post('/api/chat/dm', param)
              this.searchErrorDM = null
              this.$emit('switch-chat-right-component', NoChannelSelected)
              this.dmText = ''
            } catch (error) {
              const axiosError = error as AxiosError;
              if (axiosError.response && axiosError.response.data) {
                const data = axiosError.response.data as ErrorResponse;
                this.searchErrorDM = data.message;
              } else {
                this.searchErrorDM = `No user found with username "${param.invitee}"`
              }
              this.dmText = ''
            }
            // set channel in view
        },
        async joinGroup() {
            if (this.joinGroupText.length <= 0) {
                this.joinGroupText = ''
                return
            }
            const param = {
                groupName: this.joinGroupText
            }
            await axios
                .post('api/chat/group/join', param)
                .then((response) => {
                    this.searchErrorJOIN = null
                    if (!response.data) {
                        this.$emit('switch-chat-right-component', NoChannelSelected)
                    }
                    this.chatStore.setNewGroupId(response.data.groupId)
                    if (response.data.type == EGroupChannelType.PROTECTED) {
                        this.$emit('switch-chat-right-component', EnterPassword)
                        this.joinGroupText = ''
                        return
                    }
                })
                .catch((error) => {
                    this.joinGroupText = ''
                    const axiosError = error as AxiosError;
                    if (axiosError.response && axiosError.response.data) {
                      const data = axiosError.response.data as ErrorResponse;
                      this.searchErrorJOIN = data.message;
                    } else {
                      this.searchErrorJOIN = 'Error Joining group'
                    }
                    // this.$emit('switch-chat-right-component', NoChannelSelected)
                    return
                })
        },
        newPrivateGroupChannel(): void {
            // Validates the input before sending the message.
            if (this.groupText.length <= 0) {
                this.groupText = ''
                return
            }
            const param = {
                groupName: this.groupText,
                type: EGroupChannelType.PRIVATE,
                password: null
            }
            axios.post('/api/chat/group', param).catch((error) => {
                return
            })
            this.groupText = ''
            // set channel in view
            this.$emit('switch-chat-right-component', NoChannelSelected)
        },
        newPublicGroupChannel(): void {
            // Validates the input before sending the message.
            if (this.groupText.length <= 0) {
                this.groupText = ''
                return
            }
            const param = {
                groupName: this.groupText,
                type: EGroupChannelType.PUBLIC,
                password: null
            }
            axios.post('/api/chat/group', param).catch((error) => {
                return
            })
            this.groupText = ''
            this.$emit('switch-chat-right-component', NoChannelSelected)
        },
        newProtectedGroupChannel(): void {
            if (this.groupText.length <= 0) {
                this.groupText = ''
                return
            }
            this.chatStore.setNewGroupName(this.groupText)
            this.$emit('switch-chat-right-component', SetPassword)
            this.groupText = ''
        },
        goBack(): void {
            this.$emit('switch-chat-right-component', NoChannelSelected)
        }
    }
})
</script>

<style scoped>
.input_new_channel {
    @apply w-3/4 text-white focus:outline-none rounded-md border-buff px-2 py-1 border bg-transparent mt-10 mb-2;
}

.div_input_new_channel {
    @apply w-full flex flex-col items-center justify-center;
}
.radio_button {
    @apply h-4 w-4 cursor-pointer mr-2 opacity-70 appearance-none border-double rounded-full border-4 border-buff text-buff transition-all checked:border-solid checked:opacity-100;
}
</style>
