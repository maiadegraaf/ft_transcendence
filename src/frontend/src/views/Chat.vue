<template>
    <Nav/>
    <div class="flex-1 overflow-hidden h-3/4">
      <div class="max-w-screen-2xl w-full box-border h-full mx-auto flex">
        <div class="w-1/4 h-full flex flex-col">
          <ChannelHeader @switch-chat-right-component="changeComponent"/>
          <ChannelList @switch-chat-right-component="changeComponent"/>
        </div>
        <div class="w-3/4 h-full flex flex-col overflow-hidden">
          <component :is="currentComponent" @switch-chat-right-component="changeComponent"/>
        </div>
        </div>
      </div>
</template>

<script lang="ts">
import Nav from '@/components/Nav.vue'
import MessageList from '@/components/Chat/MessageList.vue'
import ChannelList from '@/components/Chat/ChannelList.vue'
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
    // this.userStore.socket.on('msgToClient', (message: IMessage) => {
    //   console.log("Message recieved!")
    //   this.chatStore.receivedMessage(message)
    // })
    // this.userStore.socket.on('addChannelToClient', (channel: IChannels) => {
    //   console.log("Channel recieved!")
    //   this.chatStore.receivedNewChannel(channel)
    // })
    // this.userStore.socket.on('removeChannelFromClient', (channelId: number) => {
    //   console.log("Channel removed request!")
    //   this.chatStore.removeChannel(channelId)
    // })
  },
  watch: {
  },
  // The methods of the Vue instance.
  methods: {
    changeComponent(component: any): void {
      this.currentComponent = component
      // if (groupName) {
      //
      // }
    },
  },
  // The created hook of the Vue instance.
  created(): void {
  }
})
</script>

<style></style>
