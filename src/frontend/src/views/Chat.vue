<template>
  <div class="absolute flex flex-col w-screen h-screen max-h-screen">
    <Nav/>
    <div class="flex-1 overflow-hidden">
      <div class="max-w-screen-2xl w-full box-border h-full mx-auto pb-10 flex">
        <div class="w-1/4 h-full flex flex-col">
          <ChannelHeader @switch-chat-right-component="changeComponent"/>
<!--          <ChannelGroup/>-->
          <ChannelList/>
<!--          <ChannelInput/>-->
        </div>
        <div class="w-3/4 h-full flex flex-col overflow-hidden">
          <component :is="currentComponent" @switch-chat-right-component="changeComponent"/>
        </div>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import Nav from '@/components/Nav.vue'
import MessageList from '@/components/Chat/MessageList.vue'
import ChannelList from '@/components/Chat/ChannelList.vue'
import ChannelInput from "@/components/Chat/ChannelInput.vue";
import ChannelGroup from "@/components/Chat/ChannelGroup.vue";
import GroupSettings from "@/components/Chat/GroupSettings.vue";
import {useChatStore} from "@/store/channel.store";
import type {IMessage, IChannels} from "@/types/types";
import MessageInput from "@/components/Chat/MessageInput.vue";
import {useUserStore} from "@/store/user.store";
import {defineComponent} from "vue";
import ChannelHeader from "@/components/Chat/ChannelHeader.vue";

export default defineComponent({
  components: {
    ChannelHeader,
    ChannelGroup,
    ChannelInput,
    Nav,
    MessageList,
    ChannelList,
    GroupSettings
  },
  // The root element of the Vue instance.
  el: '#app',
  // The data object of the Vue instance.
  data(): any {
    return {
      currentComponent: MessageList,
    }
  },
  setup() {
    const chatStore = useChatStore()
    const userStore = useUserStore()
    return { chatStore, userStore }
  },

  mounted() {
    this.userStore.socket.on('msgToClient', (message: IMessage) => {
      this.chatStore.receivedMessage(message)
    })
    this.chatStore.socket.on('addChannelToClient', (channel: IChannels) => {
      this.chatStore.receivedNewChannel(channel)
    })
    this.chatStore.socket.on('removeChannelFromClient', (channelId: number) => {
      this.chatStore.removeChannel(channelId)
    })
  },
  watch: {
  },

  // The methods of the Vue instance.
  methods: {
    changeComponent(component: any): void {
      this.currentComponent = component
    },
  },
  // The created hook of the Vue instance.
  created(): void {
  }
})
</script>

<style></style>
