<template>
    <NavBar />
    <div class="w-full box-border h-[calc(100vh-4rem)] flex">
        <div
            class="w-1/4 min-w-[300px] flex flex-col border-t-4 border-r-4 border-double border-buff"
        >
            <ChannelHeader @switch-chat-right-component="changeComponent" />
            <ChannelList @switch-chat-right-component="changeComponent" />
        </div>
        <div class="w-3/4 min-w-[400px] flex flex-col overflow-hidden">
            <component :is="currentComponent" @switch-chat-right-component="changeComponent" />
        </div>
    </div>
</template>

<script lang="ts">
import NavBar from '@/components/NavBar.vue'
import MessageList from '@/components/Chat/Message_panel/MessageList.vue'
import ChannelList from '@/components/Chat/Channel_panel/ChannelList.vue'
import GroupSettings from '@/components/Chat/Group_panel/GroupSettings.vue'
import { useChatStore } from '@/store/channel.store'
import type { IMessage, IChannels } from '@/types/types'
import MessageInput from '@/components/Chat/Message_panel/MessageInput.vue'
import { useUserStore } from '@/store/user.store'
import { defineComponent } from 'vue'
import ChannelHeader from '@/components/Chat/Channel_panel/ChannelHeader.vue'
import NoChannelSelected from "@/components/Chat/NoChannelSelected.vue";

export default defineComponent({
    components: {
        ChannelHeader,
        NavBar,
        MessageList,
        ChannelList,
        GroupSettings
    },
    // The root element of the Vue instance.
    el: '#app',
    // The data object of the Vue instance.
    data(): any {
        return {
            currentComponent: NoChannelSelected
        }
    },
    mounted() {
        if (this.chatStore.channelInView > -1) {}
        this.currentComponent = MessageList
    },
    setup() {
        const chatStore = useChatStore()
        const userStore = useUserStore()
        return { chatStore, userStore }
    },
    methods: {
        changeComponent(component: any): void {
            this.currentComponent = component
        }
    },
    // The created hook of the Vue instance.
    created(): void {}
})
</script>

<style></style>
