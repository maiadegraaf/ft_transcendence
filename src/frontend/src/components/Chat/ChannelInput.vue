<template>
  <footer class="bg-normal w-full min-h-10">
    <div class="p-3 flex">
      <div class="flex-1 p-1 bg-white rounded-md">
        <input v-model="dmText" placeholder="Dm user ..." class="w-full focus:outline-none"
               @keyup.enter="dmNewUser">
      </div>
      <button @click="dmNewUser" class="rounded-full ml-3 hover:shadow-md">></button>
    </div>
  </footer>
</template>

<script lang="ts">
import {UserChatStore} from "../../store/store";
import axios from "axios";

export default {
  name: "ChannelInput",
  // props: ['chatStore']
  setup() {
    const chatStore = UserChatStore()
    // chatStore.setupChatStore()
    return { chatStore }
  },
  data(): any {
      return {
        dmText: '',
        groupText: '',
        userId: 0,
        userName: '',
      }
    },
  async mounted() {
    await this.chatStore.fetchUserData()
    this.userId = this.chatStore.userId
    this.userName = this.chatStore.name
  },
  methods: {
    dmNewUser(): void {
      // Validates the input before sending the message.
      if (this.dmText.length <= 0) {
        this.dmText = ''
        return
      }
      const param = {
        userId: this.userId,
        invitee: this.dmText,
      }
      axios.post('/api/chat/dm', param)
      this.dmText = ''
    },
  }
}
</script>

<style scoped>

</style>