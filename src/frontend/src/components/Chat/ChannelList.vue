<template>
    <div class="flex-1 bg-dark-purple bg-opacity-60 flex flex-col">
        <div
            v-for="ch in chatStore.channels"
            :key="ch.id"
            class="block border-buff cursor-pointer border-b-2"
        >
            <ChannelTile :ch="ch" @switch-chat-right-component="passTrough" />
        </div>
    </div>
</template>

<script lang="ts">
import { useChatStore } from '@/store/channel.store'
import { defineComponent } from 'vue'
import ChannelTile from '@/components/Chat/ChannelTile.vue'

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
