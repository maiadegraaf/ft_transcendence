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
        <button @click="groupSettings(ch.id, ch.profile.id)" class="rounded-full ml-3 hover:shadow-md">Settings</button>
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

export default {
  name: "ChannelList",
  data(): any {
    return {
      userId: 0,
      userName: '',
    }
  },
  setup() {
    const chatStore = UserChatStore()
    return { chatStore }
  },
  mounted() {
    // useProvideBus()
    this.userId = this.chatStore.userId
    this.chatStore.loadChannels()
  },
  methods: {
    toView(id: number): void {
      this.chatStore.setChannelInView(id)
    },
    groupSettings(channelId: number, groupId: number): void {
      this.chatStore.setChannelInView(channelId)
      this.chatStore.setGroupId(groupId)
      this.$emit('switch-chat-right-component', GroupSettings)
    },
    lastMessage(ch: any): string {
      if (ch.messages.length === 0) {
        return "No messages yet"
      } else {
        return ch.messages[ch.messages.length - 1].text
      }
    },
  }
}
</script>

<style scoped>

</style>