<template>
  <div class="w-3/4 h-full flex flex-column overflow-hidden">
    <div class="border-buff border-double border-2 rounded-md">
      <h2 class="h2">Messages</h2>
    </div>
    <div class="flex-1 w-full bg-dark-purple overflow-hidden">
<!--      <MessageList/>-->
      <div class="max-w-full h-full max-h-full flex flex-column-reverse overflow-y-auto">
        <div v-for="message of chatStore.getChannelInView.slice().reverse()" :key="message.id">
          <div :class="posMessage(message.sender.id) + ' block mb-1 mx-2'">
            <div :class="'inline box-border font-bold text-sm p-1 rounded-md ' + colorMessage(message.sender.id)">{{ message.text }}</div>
          </div>
        </div>
      </div>
    </div>
    <MessageInput/>
  </div>
</template>

<script lang="ts">
import {UserChatStore} from "../../store/store";
import MessageInput from "@/components/Chat/MessageInput.vue";

export default {
  components: {
    MessageInput,
  },
  name: "MessageList",
  setup() {
    const chatStore = UserChatStore()
    return { chatStore }
  },
  methods: {
    posMessage(senderId: number): string {
      if (senderId == this.chatStore.userId) {
        return "flex justify-end"
      } else {
        return "flex justify-start"
      }
    },
    colorMessage(senderId: number): string {
      if (senderId == this.chatStore.userId) {
        return "bg-amaranth-purple"
      } else {
        return "bg-grey-darken-2"
      }
    }
  }
}
</script>

<style scoped>

</style>