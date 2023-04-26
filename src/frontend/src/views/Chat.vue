<template>
  <div class="absolute flex flex-column w-screen h-screen max-h-screen">
    <Nav/>
    <div class="flex-1 overflow-hidden">
      <div class="max-w-5xl w-full box-border h-full mx-auto pb-10 flex">
        <div class="w-1/4 h-full flex flex-column">
          <div class="border-buff border-double border-2 rounded-md">
            <h2 class="h2">Channels</h2>
          </div>
          <ChannelGroup/>
          <ChannelList
           @switch-chat-right-component="changeComponent"/>
          <ChannelInput/>
        </div>
        <component :is="currentComponent" class="w-3/4 h-full flex flex-column overflow-hidden"
        @switch-chat-right-component="changeComponent"/>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import Nav from '@/components/Nav.vue'
import { UserChatStore} from "@/store/store";
import type {IMessage, IChannels} from "@/store/types";
import MessageList from '@/components/Chat/MessageList.vue'
import ChannelList from '@/components/Chat/ChannelList.vue'
// import MessageInput from "@/components/Chat/MessageInput.vue";
import ChannelInput from "@/components/Chat/ChannelInput.vue";
import ChannelGroup from "@/components/Chat/ChannelGroup.vue";
import GroupSettings from "@/components/Chat/GroupSettings.vue";
// import { currentComponent } from "@/store/./sharedState"
export default {
  components: {
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
    const chatStore = UserChatStore()
    return { chatStore }
  },

  async mounted() {
    // useProvideBus()
    await this.chatStore.setupChatStore()
    console.log('channels: ')
    console.log(this.chatStore.channels)
    // console.log('channels: ' + JSON.stringify(this.chatStore.channels))
    this.chatStore.socket.on('msgToClient', (message: IMessage) => {
      this.chatStore.receivedMessage(message)
    })
    this.chatStore.socket.on('addChannelToClient', (channel: IChannels) => {
      this.chatStore.receivedNewChannel(channel)
    })
  },
  watch: {
  },

  // The methods of the Vue instance.
  methods: {
    changeComponent(component: any): void {
      console.log(component);
      this.currentComponent = component
    },
  },
  // The created hook of the Vue instance.
  created(): void {
    // const bus = useInjectBus();
    // this.currentComponent = bus.currentComponent.value
  }
}
</script>

<style>

</style>
