<template>
    <div class="p-3 flex">
        <button @click="goBack" class="rounded-full ml-3 hover:shadow-md">Go Back</button>
    </div>
    <div class="p-3 flex">
        <div class="flex-1 p-1 bg-white rounded-md">
            <input
                v-model="passwordText"
                placeholder="Set New Password"
                class="w-full focus:outline-none"
            />
        </div>
        <button @click="setPassword" class="rounded-full ml-3 hover:shadow-md">go</button>
    </div>
    <!--  search for existing public group-->
</template>

<script lang="ts">
import { useChatStore } from '../../store/channel.store'
import axios from 'axios'
import MessageList from '@/components/Chat/MessageList.vue'
import { useUserStore } from '@/store/user.store'
import { EGroupChannelType } from '@/types/types'
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'SetPassword',
    // props: ['chatStore']
    setup() {
        const chatStore = useChatStore()
        const user = useUserStore()
        // chatStore.setupChatStore()
        return { chatStore, user }
    },
    data(): any {
        return {
            passwordText: ''
        }
    },
    async mounted() {},
    methods: {
        setPassword(): void {
            if (this.passwordText.length <= 0) {
                this.passwordText = ''
                this.groupText = ''
                return
            }
            const param = {
                userId: this.user.id,
                groupName: this.chatStore.groupName,
                type: EGroupChannelType.PROTECTED,
                password: this.passwordText
            }
            axios
                .post('/api/chat/group', param)
                .then((response) => {
                    console.log(response)
                    // this.redirectGroupPannel()
                })
                .catch((error) => {
                    console.log(error)
                    return
                })
            this.passwordText = ''
            this.chatStore.setGroupName('')
            this.$emit('switch-chat-right-component', MessageList)
        },
        goBack(): void {
            // leave chat reuqest
            this.$emit('switch-chat-right-component', MessageList)
        }
    }
})
</script>

<style scoped>
input {
    color: black;
}
</style>
