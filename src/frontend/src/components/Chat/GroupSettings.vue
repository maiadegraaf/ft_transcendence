<template>
  <header class="bg-normal w-full min-h-10">
    <div class="p-3 flex">
      <div class="flex-1 p-1 bg-white rounded-md">
        <input v-model="text" placeholder="Add addmin" class="w-full focus:outline-none"
               @keyup.enter="addAddmin">
      </div>
      <button @click="addAddmin" class="rounded-full ml-3 hover:shadow-md">></button>
    </div>
  </header>
</template>

<script lang="ts">
import {UserChatStore} from "../../store/store";
import axios from "axios";

export default {
  name: "GroupSettings",
  // props: ['chatStore']
  setup() {
    const chatStore = UserChatStore()
    // chatStore.setupChatStore()
    return { chatStore }
  },
  data(): any {
    return {
      text: '',
      userId: 0,
      params: {
        userName: '',
        groupId : 0,
        channelId : 0,
      },
      userName: '',
      channelId: 0,
      groupId: 0,
    }
  },
  async mounted() {
    await this.chatStore.fetchUserData()
    this.userId = this.chatStore.userId
    this.userName = this.chatStore.name
    this.params.channelId = this.channelId
    this.params.groupId = this.groupId
  },
  methods: {
    addAddmin(): void {
      // Validates the input before sending the message.
      if (this.text.length <= 0) {
        this.text = ''
        return
      }

      this.params.userName = this.text
      axios.post('/api/chat/group/admin', JSON.parse(this.params))
          .then((response) => {
            console.log(response)
            // this.redirectGroupPannel()
          })
          .catch((error) => {
            console.log(error)
            return
          });
      this.text = ''
    },
    deleteAdmin(): void {
      // Validates the input before sending the message.
      if (this.text.length <= 0) {
        this.text = ''
        return
      }

      this.params.userName = this.text
      axios.delete('/api/chat/group/admin', JSON.parse(this.params))
          .then((response) => {
            console.log(response)
            // this.redirectGroupPannel()
          })
          .catch((error) => {
            console.log(error)
            return
          });
      this.text = ''
    },
    addMuted(): void {
      // Validates the input before sending the message.
      if (this.text.length <= 0) {
        this.text = ''
        return
      }

      this.params.userName = this.text
      axios.post('/api/chat/group/muted', JSON.parse(this.params))
          .then((response) => {
            console.log(response)
            // this.redirectGroupPannel()
          })
          .catch((error) => {
            console.log(error)
            return
          });
      this.text = ''
    },
    deleteMuted(): void {
      // Validates the input before sending the message.
      if (this.text.length <= 0) {
        this.text = ''
        return
      }

      this.params.userName = this.text
      axios.delete('/api/chat/group/muted', JSON.parse(this.params))
          .then((response) => {
            console.log(response)
            // this.redirectGroupPannel()
          })
          .catch((error) => {
            console.log(error)
            return
          });
      this.text = ''
    },
    addBanned(): void {
      // Validates the input before sending the message.
      if (this.text.length <= 0) {
        this.text = ''
        return
      }

      this.params.userName = this.text
      axios.post('/api/chat/group/banned', JSON.parse(this.params))
          .then((response) => {
            console.log(response)
            // this.redirectGroupPannel()
          })
          .catch((error) => {
            console.log(error)
            return
          });
      this.text = ''
    },
    deleteBanned(): void {
      // Validates the input before sending the message.
      if (this.text.length <= 0) {
        this.text = ''
        return
      }

      this.params.userName = this.text
      axios.delete('/api/chat/group/banned', JSON.parse(this.params))
          .then((response) => {
            console.log(response)
            // this.redirectGroupPannel()
          })
          .catch((error) => {
            console.log(error)
            return
          });
      this.text = ''
    },
  }
}
</script>

<style scoped>

</style>