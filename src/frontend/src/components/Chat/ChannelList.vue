<template>
  <div class="flex-1 w-full bg-dark-purple flex flex-col">
    <div v-for="ch in chatStore.channels" :key="ch.id" class="block border-buff cursor-pointer border-b-2">
      <ChannelTile :ch="ch" @switch-chat-right-component="Test"/>
    </div>
  </div>
</template>

<script lang="ts">
import {useChatStore} from "@/store/channel.store";
import {defineComponent} from "vue";
import ChannelTile from "@/components/Chat/ChannelTile.vue";
import GroupSettings from "@/components/Chat/GroupSettings.vue";


export default defineComponent({
  name: "ChannelList",
  components: {
    ChannelTile,
  },
  setup() {
    const chatStore = useChatStore()
    return { chatStore }
  },
  methods: {
    Test(): void {
      console.log('test')
      this.$emit('switch-chat-right-component', GroupSettings)
    }
  }
})
</script>

<style scoped></style>
