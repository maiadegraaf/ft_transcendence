<template>
  <div class="flex-1 w-full bg-dark-purple flex flex-col">
    <div v-for="ch in chatStore.channels" :key="ch.id"
         class="block border-buff cursor-pointer border-double border-2 rounded-md">
      <div v-if="!ch.profile" class="h-20" @click="toView(ch.id)">
        <div class="flex flex-column justify-center">
          <div class="font-bold">DM | {{ ch.name }} | {{ ch.id }}</div>
          <div>{{ lastMessage(ch) }}</div>
        </div>
      </div>
      <div v-else class="h-20" @click="toView(ch.id)">
        <div class="flex flex-column justify-center">
          <div class="font-bold">Group | {{ ch.name }} | {{ ch.id }}</div>
          <div>{{ lastMessage(ch) }}</div>
        </div>
        <button @click="toggleGroup" class="rounded-full ml-3 hover:shadow-md">Settings</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {UserChatStore} from "../../store/store";
import axios from "axios";
// import {busSymbol} from "../../store/bus";
import GroupSettings from "@/components/Chat/GroupSettings.vue";
import MessageList from "@/components/Chat/MessageList.vue";
import sharedState from "@/store/sharedState";

export default {
  name: "ChannelList",
  data(): any {
    return {
      userId: 0,
      userName: '',
      currentComponent: null,
    }
  },
  setup() {
    const chatStore = UserChatStore()
    // useProvideBus()
    // const bus = useInjectBus()
    return { chatStore }
  },
  // inject: {
  //   bus: busSymbol,
  // },
  mounted() {
    // useProvideBus()
    this.userId = this.chatStore.userId
    this.chatStore.loadChannels()
    this.currentComponent = sharedState.currentComponent
  },
  methods: {
    toView(id: number): void {
      this.chatStore.setChannelInView(id)
      // const bus = useInjectBus();
      // this.bus.currentComponent.value = MessageList;
      // bus.$emit('switch-component', 'MessageList')
    },
    toggleGroup() {
      console.log('toggleGroup')
      // sharedState.currentComponent = sharedState.currentComponent === MessageList ? GroupSettings : MessageList
      sharedState.currentComponent = GroupSettings
      // const bus = useInjectBus();
      // this.bus.currentComponent.value = this.bus.currentComponent.value === MessageList ? GroupSettings : MessageList;
      console.log('toggleGroup check')
    },
    groupSettings(channelId: number, groupId: number): void {
      const payload = {
        channelId: channelId,
        userId: this.userId,
        groupId: groupId,
      }
      // axios.get('/api/chat/group/' + groupId, payload)
      //     .then((response) => {
      //       console.log(response)
      //       // this.redirectGroupPanel(response.data)
      //     })
      //     .catch((error) => {
      //       console.log(error)
      //       return
      //     })
      // bus.$emit('switch-component', 'GroupSettings')
      // this.chatStore.setChannelInView(id)
      // this.$router.push({ name: 'GroupSettings' })
      // const bus = useInjectBus();
      // bus.currentComponent.value = bus.currentComponent.value === MessageList ? GroupSettings : MessageList;
    },
    // showGroupSettings(): void {
    //   const bus = useInjectBus();
    //   bus.currentComponent.value = GroupSettings;
    //   // bus.$emit('switch-component', 'MessageList')
    // },
    lastMessage(ch: any): string {
      if (ch.messages.length === 0) {
        return "No messages yet"
      } else {
        return ch.messages[ch.messages.length - 1].text
      }
    },
    // redirectGroupPanel(): void {
    //   this.$router.push({ name: 'GroupPanel' })
    // },
  }
}
</script>

<style scoped>

</style>