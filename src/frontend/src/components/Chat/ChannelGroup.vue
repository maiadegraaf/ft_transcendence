<template>
  <header class="bg-normal w-full min-h-10">
    <div class="p-3 flex">
      <div class="flex-1 p-1 bg-white rounded-md">
        <input v-model="groupText" placeholder="New Group Name" class="w-full focus:outline-none"
               @keyup.enter="newGroupChannel">
      </div>
      <button @click="newGroupChannel" class="rounded-full ml-3 hover:shadow-md">></button>
    </div>
  </header>
</template>

<script lang="ts">
import {useChatStore} from "../../store/channel.store";
import axios from "axios";

export default {
  name: "ChannelGroup",
  // props: ['chatStore']
  setup() {
    const chatStore = useChatStore()
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
    newGroupChannel(): void {
      // Validates the input before sending the message.
      if (this.groupText.length <= 0) {
        this.groupText = ''
        return
      }
      const param = {
        userId: this.userId,
        groupName: this.groupText,
      }
      axios.post('/api/chat/group', param)
          .then((response) => {
            console.log(response)
            // this.redirectGroupPannel()
          })
          .catch((error) => {
            console.log(error)
            return
          });
      this.groupText = ''
    },
  }
}
</script>

<style scoped>

</style>