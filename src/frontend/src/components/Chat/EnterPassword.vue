<template>
    <div class="w-full h-full flex border-buff border-double border-t-4 flex-col">
        <div class="flex justify-between p-4">
            <button @click="goBack" class="hover:opacity-60 transition-opacity">
                <ChevronLeftIcon class="h-8 w-8 text-buff" />
            </button>
            <h2 class="text-buff text-2xl font-semibold uppercase">Set Password</h2>
            <span class="w-8"></span>
        </div>
        <div class="flex flex-col justify-center items-center">
            <input
                v-model="passwordText"
                type="password"
                placeholder="Password"
                class="w-1/2 !text-white focus:outline-none rounded-md border-buff px-2 py-1 border bg-transparent my-10"
            />
            <button
                @click="enterPassword"
                class="font-semibold text-2xl text-buff hover:opacity-60 transition-opacity rounded-full ml-3 hover:shadow-md"
            >
                GO
            </button>
        </div>
    </div>
    <!--  search for existing public group-->
</template>

<script lang="ts">
import { useChatStore } from '@/store/channel.store'
import axios from 'axios'
import { defineComponent } from 'vue'
import NoChannelSelected from "@/components/Chat/NoChannelSelected.vue";
import {ChevronLeftIcon} from "@heroicons/vue/24/outline";
import NewChannel from "@/components/Chat/NewChannel.vue";

export default defineComponent({
    name: 'EnterPassword',
    components: {
        ChevronLeftIcon,
    },
    setup() {
        const chatStore = useChatStore()
        return { chatStore }
    },
    data(): any {
        return {
            passwordText: ''
        }
    },
    async mounted() {},
    methods: {
        enterPassword(): void {
            if (this.passwordText === '') {
                this.passwordText = ''
                return
            }
            const param = {
                groupId: this.chatStore.newGroupId,
                password: this.passwordText
            }
            axios.post('/api/chat/group/user/password', param).then((res) => {
                if (res.data === true) {
                    this.$emit('switch-chat-right-component', NoChannelSelected)
                } else {
                    alert('wrong password')
                }
            })
            this.passwordText = ''
            this.$emit('switch-chat-right-component', NoChannelSelected)
        },
        goBack(): void {
            // leave chat request
            this.$emit('switch-chat-right-component', NewChannel)
        }
    }
})
</script>

<style scoped>
input {
    color: white;
}
</style>
