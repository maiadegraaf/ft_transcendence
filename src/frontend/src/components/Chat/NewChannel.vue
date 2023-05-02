<template>
  <div class="p-3 flex">
    <button @click="goBack" class="rounded-full ml-3 hover:shadow-md">Go Back</button>
  </div>
  <div class="p-3 flex">
    <div class="flex-1 p-1 bg-white rounded-md">
      <input v-model="groupText" placeholder="New Group Name" class="w-full focus:outline-none">
    </div>
    <button @click="newGroupChannel" class="rounded-full ml-3 hover:shadow-md">Create a new group</button>
  </div>
  <div class="p-3 flex">
    <div class="flex-1 p-1 bg-white rounded-md">
      <input v-model="dmText" placeholder="Dm user ..." class="w-full focus:outline-none">
    </div>
    <button @click="dmNewUser" class="rounded-full ml-3 hover:shadow-md">dm user</button>
  </div>
<!--  search for existing public group-->
</template>

<script lang="ts">
import {useChatStore} from "../../store/channel.store";
import axios from "axios";
import MessageList from "@/components/Chat/MessageList.vue";

export default {
  name: "NewChannel",
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
      // setchannel in view
      this.$emit('switch-chat-right-component', MessageList)
    },
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
      // setchannel in view
      this.$emit('switch-chat-right-component', MessageList)
    },
    goBack(): void {
      this.$emit('switch-chat-right-component', MessageList)
    },
  }
}
</script>

<style scoped>

input {
  color: black;
}

</style>