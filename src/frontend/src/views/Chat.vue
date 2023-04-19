<template>
  <div class="absolute flex flex-column w-screen h-screen max-h-screen">
    <Nav/>
    <div class="flex-1 overflow-hidden">
      <div class="max-w-5xl w-full box-border h-full mx-auto pb-10 flex">
        <div class="w-1/4 h-full flex flex-column">
          <div class="border-buff border-double border-2 rounded-md">
            <h2 class="h2">Channels</h2>
          </div>
          <ChannelList/>
        </div>
        <div class="w-3/4 h-full flex flex-column overflow-hidden">
          <div class="border-buff border-double border-2 rounded-md">
            <h2 class="h2">Messages</h2>
          </div>
          <div class="flex-1 w-full bg-dark-purple overflow-hidden">
              <MessageList/>
            </div>
          <MessageInput/>
        </div>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import Nav from '@/components/Nav.vue'
import MessageList from '@/components/Chat/MessageList.vue'
import ChannelList from '@/components/Chat/ChannelList.vue'
import { UserChatStore} from "@/store/store";
import type {IMessage} from "@/store/types";
import MessageInput from "@/components/Chat/MessageInput.vue";

export default {
  components: {MessageInput, Nav , MessageList, ChannelList},
  // The root element of the Vue instance.
  el: '#app',
  // The data object of the Vue instance.
  setup() {
    const chatStore = UserChatStore()
    chatStore.fetchUserData()
    chatStore.connectSocket()
    chatStore.loadChannels()
    return { chatStore }
  },

  mounted() {
    this.chatStore.socket.on('msgToClient', (message: IMessage) => {
      this.chatStore.receivedMessage(message)
    })
    },
  watch: {
  },

  // The methods of the Vue instance.
  methods: {

  },
  // The created hook of the Vue instance.
  created(): void {

  }
}
</script>

<style>

</style>
