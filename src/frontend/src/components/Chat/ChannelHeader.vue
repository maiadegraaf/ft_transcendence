<template>
  <header class="border-buff border border-1 rounded-l-md flex h-16">
    <div class="h-full w-full">
      <img
        :src="`/api/user/${user.id}/avatar`"
        alt="Avatar"
        class="w-12 h-12 rounded-full object-cover my-[7px] ml-3"
      />
    </div>
    <div class="h-full">
      <button class="my-[11px]" @click="newChannel">
        <PlusIcon class="h-10 w-10 mr-3 text-buff"/>
      </button>
    </div>
  </header>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useUserStore} from "@/store/user.store";
import { PlusIcon } from "@heroicons/vue/24/outline"
import NewChannel from "@/components/Chat/NewChannel.vue";

export default defineComponent({
  name: "ChannelHeader",
  components: {
    PlusIcon
  },
  setup() {
    const user = useUserStore()
    return { user }
  },
  methods: {
    newChannel(): void {
      this.$emit('switch-chat-right-component', NewChannel)
    },
  }
})
</script>

<style scoped>

</style>