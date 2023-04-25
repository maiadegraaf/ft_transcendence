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
          <ChannelList/>
          <ChannelInput/>
<!--          <ChannelInput :chat-store="chatStore"/>-->
        </div>
        <component :is="currentComponent"></component>
<!--        <MessageList/>-->
<!--        <div class="w-3/4 h-full flex flex-column overflow-hidden">-->
<!--          <div class="border-buff border-double border-2 rounded-md">-->
<!--            <h2 class="h2">Messages</h2>-->
<!--          </div>-->
<!--          <div class="flex-1 w-full bg-dark-purple overflow-hidden">-->
<!--              <MessageList/>-->
<!--            </div>-->
<!--          <MessageInput/>-->
<!--        </div>-->
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
import sharedState from "@/store/sharedState";
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
      currentComponent: null,
    }
  },
  // provide() {
  //   return {
  //     [busSymbol]: {
  //       currentComponent: this.$data.currentComponent,
  //     },
  //   };
  // },
  // inject: {
  //   bus: busSymbol,
  // },

  setup() {
    const chatStore = UserChatStore()
    return { chatStore }
  },

  async mounted() {
    // useProvideBus()
    await this.chatStore.setupChatStore()
    this.chatStore.socket.on('msgToClient', (message: IMessage) => {
      this.chatStore.receivedMessage(message)
    })
    this.chatStore.socket.on('addChannelToClient', (channel: IChannels) => {
      this.chatStore.receivedNewChannel(channel)
    })
    sharedState.currentComponent = MessageList;
    this.currentComponent = sharedState.currentComponent;
    // const bus = useInjectBus();
    // this.bus.currentComponent.value = MessageList
    // this.currentComponent = this.bus.currentComponent
    // bus.currentComponent.value = MessageList
    // useProvideBus()
    // const bus = useInjectBus();
    // this.currentComponent = this.bus.currentComponent
  },
  watch: {
  },

  // The methods of the Vue instance.
  methods: {

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
