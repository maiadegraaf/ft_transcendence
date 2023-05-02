<template>
  <div class="flex-1 w-full bg-dark-purple flex flex-col">
    <div v-for="ch in chatStore.channels" :key="ch.id" class="block border-buff cursor-pointer border-b-2">
      <ChannelTile :ch="ch" @switch-chat-right-component="$emit('switch-chat-right-component', $event)"/>
    </div>
  </div>
</template>

<script lang="ts">
import {useChatStore} from "@/store/channel.store";
import {defineComponent} from "vue";
import ChannelTile from "@/components/Chat/ChannelTile.vue";

export default defineComponent({
  name: "ChannelList",
  components: {
    ChannelTile,
  },
  setup() {
    const chatStore = useChatStore()
    return { chatStore }
  },
})
</script>

<style scoped></style>
