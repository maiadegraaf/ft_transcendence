<template>
    <div class="bg-dark-purple h-full">
        <div class="grid grid-cols-1 justify-start">
            <div v-for="ch in chatStore.channels" :key="ch.id" class="cursor-pointer">
                <ChannelTile :ch="ch" @switch-chat-right-component="passTrough" />
                <div class="w-full flex justify-center items-center">
                    <div class="w-2/3 border-b border-buff opacity-70"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useChatStore } from '@/store/channel.store'
import { defineComponent } from 'vue'
import ChannelTile from '@/components/Chat/Channel_panel/ChannelTile.vue'

export default defineComponent({
    name: 'ChannelList',
    components: {
        ChannelTile
    },
    setup() {
        const chatStore = useChatStore()
        return { chatStore }
    },
    methods: {
        passTrough(component: any): void {
            this.$emit('switch-chat-right-component', component)
        }
    }
})
</script>

<style scoped></style>
