<template>
  <div class="flex-1 w-full bg-dark-purple flex flex-col">
    <div v-for="ch in chatStore.channels" :key="ch.id"
         class="block border-buff cursor-pointer border-double border-2 rounded-md">
      <div class="h-20" @click="toView(ch.id)">
        <div class="flex flex-column justify-center">
          <div class="font-bold">{{ ch.profile ? 'Group' : 'DM' }} | {{ ch.name }} | {{ ch.id }}</div>
          <div>{{ lastMessage(ch) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {UserChatStore} from "../../store/store";

export default {
  name: "ChannelList",
  setup() {
    const chatStore = UserChatStore()
    return { chatStore }
  },
  methods: {
    toView(id: number): void {
      this.chatStore.setChannelInView(id)
    },
    lastMessage(ch: any): string {
      if (ch.messages.length === 0) {
        return "No messages yet"
      } else {
        return ch.messages[ch.messages.length - 1].text
      }
    }
  }
}
</script>

<style scoped>

</style>