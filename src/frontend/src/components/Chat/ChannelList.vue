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
      </div>
      <div v-if="ch.profile">
        <button @click="groupSettings(ch.id, ch.profile.id, ch.profile.name)" class="rounded-full ml-3 hover:shadow-md">Settings</button>
      </div>
    </div>
  </div>
  <footer class="bg-normal w-full min-h-10">
    <div class="p-3 flex">
      <button @click="newChannel" class="rounded-full ml-3 hover:shadow-md">New Channel +</button>
    </div>
  </footer>
</template>

<script lang="ts">
import {useChatStore} from "../../store/channel.store";
import {defineComponent} from "vue";
import axios from "axios";
import GroupSettings from "@/components/Chat/GroupSettings.vue";
import MessageList from "@/components/Chat/MessageList.vue";
import NewChannel from "@/components/Chat/NewChannel.vue";

export default defineComponent({
  name: "ChannelList",
  setup() {
    const chatStore = useChatStore()
    return { chatStore }
  },
  methods: {
    toView(id: number): void {
      this.chatStore.setChannelInView(id)
      this.$emit('switch-chat-right-component', MessageList)
    },
    groupSettings(channelId: number, groupId: number, groupName: string): void {
      this.chatStore.setChannelInView(channelId)
      this.chatStore.setGroupId(groupId)
      this.chatStore.setGroupName(groupName)
      this.$emit('switch-chat-right-component', GroupSettings)
    },
    lastMessage(ch: any): string {
      if (ch.messages.length === 0) {
        return "No messages yet"
      } else {
        return ch.messages[ch.messages.length - 1].text
      }
    },
    newChannel(): void {
      this.$emit('switch-chat-right-component', NewChannel)
    },
  }
})
</script>

<style scoped></style>
