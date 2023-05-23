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
                @click="setPassword"
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
import { useUserStore } from '@/store/user.store'
import { EGroupChannelType } from '@/types/types'
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'
import { defineComponent } from 'vue'
import NoChannelSelected from "@/components/Chat/NoChannelSelected.vue";

export default defineComponent({
    name: 'SetPassword',
    components: {
        ChevronLeftIcon
    },
    setup() {
        const chatStore = useChatStore()
        const user = useUserStore()
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
                })
                .catch((error) => {
                    console.log(error)
                    return
                })
            this.passwordText = ''
            this.chatStore.setGroupName('')
            this.$emit('switch-chat-right-component', NoChannelSelected)
        },
        goBack(): void {
            // leave chat request
            this.$emit('switch-chat-right-component', NoChannelSelected)
        }
    }
})
</script>

<style scoped>
input {
    color: black;
}
</style>
