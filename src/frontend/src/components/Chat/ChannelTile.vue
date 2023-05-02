<template>
  <div v-if="!ch.profile" class="h-20" @click="toView(ch.id)">
    <div class="flex flex-col justify-center">
      <div class="font-bold">DM | {{ ch.name }} | {{ ch.id }}</div>
      <div>{{ lastMessage }}</div>
    </div>
  </div>
  <div v-else class="h-20" @click="toView(ch.id)">
    <div class="flex flex-col justify-center">
      <div class="font-bold">Group | {{ ch.name }} | {{ ch.id }}</div>
      <div>{{ lastMessage }}</div>
    </div>
  </div>
  <div v-if="ch.profile">
    <button @click="groupSettings(ch.id, ch.profile.id, ch.profile.name)" class="rounded-full ml-3 hover:shadow-md">Settings</button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import MessageList from "@/components/Chat/MessageList.vue";
import GroupSettings from "@/components/Chat/GroupSettings.vue";
import {useChatStore} from "@/store/channel.store";

export default defineComponent({
  name: "ChannelTile",
  props: ['ch'],
  setup() {
    const chatStore = useChatStore()
    return { chatStore }
  },
  computed: {
    lastMessage(): string {
        if (this.ch.messages.length > 0) {
          return this.ch.messages[this.ch.messages.length - 1].content
        }
        return 'No messages'
      }
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
  }
})
</script>

<style scoped>

</style>