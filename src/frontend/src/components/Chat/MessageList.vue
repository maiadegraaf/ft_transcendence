<template>
  <div class="max-w-full h-full max-h-full flex flex-col-reverse overflow-y-auto">
    <div v-for="message of chatStore.getChannelInView.slice().reverse()" :key="message.id">
      <div :class="posMessage(message.sender.id) + ' block mb-1 mx-2'">
        <div :class="'inline box-border font-bold text-sm p-1 rounded-md ' + colorMessage(message.sender.id)">{{ message.text }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {useChatStore} from "../../store/channel.store";
import {useUserStore} from "@/store/user.store";
import {defineComponent} from "vue";

export default defineComponent({
  name: "MessageList",
  setup() {
    const chatStore = useChatStore()
    const userStore = useUserStore()
    return { chatStore, userStore }
  },
  methods: {
    posMessage(senderId: number): string {
      if (senderId == this.userStore.id) {
        return "flex justify-end"
      } else {
        return "flex justify-start"
      }
    },
    colorMessage(senderId: number): string {
      if (senderId == this.userStore.id) {
        return "bg-amaranth-purple"
      } else {
        return "bg-grey-darken-2"
      }
    }
  }
})
</script>

<style scoped></style>
