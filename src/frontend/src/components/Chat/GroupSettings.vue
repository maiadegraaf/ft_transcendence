<template>
<!--  <header class="bg-normal w-full min-h-10">-->
  <div class="w-3/4 h-full flex flex-column overflow-hidden">
    <div class="border-buff border-double border-2 rounded-md">
      <h2 class="h2">Group Settings</h2>
    </div>
    <div class="flex-1 w-full bg-dark-purple overflow-hidden">
      <h2>Users</h2>
      <!--      list of users-->
      <input v-model="userText" placeholder="enter user name" class="w-full focus:outline-none">
      <button @click="addUser">add user</button>
      <div>  </div>
      <button @click="deleteUser">delete user</button>
    </div>
    <div class="flex-1 w-full bg-dark-purple overflow-hidden">
      <h2>Admins</h2>
<!--      list of admins-->
      <input v-model="adminText" placeholder="enter user name" class="w-full focus:outline-none">
      <button @click="addAdmin">add</button>
      <div>  </div>
      <button @click="deleteAdmin">delete</button>
    </div>
    <div class="flex-1 w-full bg-dark-purple overflow-hidden">
      <h2>Muted</h2>
<!--    list of muted-->
      <input v-model="mutedText" placeholder="enter user name" class="w-full focus:outline-none">
      <button @click="addMuted">add</button>
      <div>  </div>
      <button @click="deleteMuted">delete</button>
      <!--        this is for blocked-->
    </div>
    <div class="flex-1 w-full bg-dark-purple overflow-hidden">
      <h2>Banned</h2>
      <input v-model="bannedText" placeholder="enter user name" class="w-full focus:outline-none">
      <button @click="addBanned">add</button>
      <div>  </div>
      <button @click="deleteBanned">delete</button>
      <!--      this is for muted-->
    </div>
    <footer class="bg-normal w-full min-h-10">
      <div class="p-3 flex">
        <button @click="doneGroup" class="rounded-full">done</button>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import {UserChatStore} from "../../store/store";
import axios from "axios";
import MessageList from "@/components/Chat/MessageList.vue";

export default {
  name: "GroupSettings",
  // props: ['chatStore']
  setup() {
    const chatStore = UserChatStore()
    // chatStore.setupChatStore()
    return {chatStore}
  },
  data(): any {
    return {
      adminText: '',
      mutedText: '',
      bannedText: '',
      userText: '',
      userId: 0,
      params: {
        userId: 0,
        userName: '',
        groupId: 0,
        channelId: 0,
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
    this.params.userId = this.userId
    this.params.channelId = this.chatStore.channelInView
    this.params.groupId = this.chatStore.groupId
  },
  methods: {
    doneGroup(): void {
      this.chatStore.setGroupId(0)
      this.$emit('switch-chat-right-component', MessageList)
    },

    addUser():void {
      // Validates the input before sending the message.
      if (this.userText.length <= 0) {
        this.userText = ''
        return
      }

      this.params.userName = this.userText
      console.log('test username: ' + this.params.userName)

      axios.post('/api/chat/group/user', this.params)
          .then((response) => {
            console.log(response)
            // this.redirectGroupPannel()
          })
          .catch((error) => {
            console.log(error)
            this.userText = ''
            return
          });
      this.userText = ''
    },
    deleteUser(): void {
      // Validates the input before sending the message.
      if (this.userText.length <= 0) {
        this.userText = ''
        return
      }

      this.params.userName = this.userText
      console.log('test username: ' + this.params.userName)

      axios.delete('/api/chat/group/user', {data: this.params})
          .then((response) => {
            console.log(response)
            // this.redirectGroupPannel()
          })
          .catch((error) => {
            console.log(error)
           this.userText = ''
            return
          });
      this.userText = ''
    },

    addAdmin(): void {
      // Validates the input before sending the message.
      if (this.adminText.length <= 0) {
        this.adminText = ''
        return
      }

      this.params.userName = this.adminText
      console.log('test username: ' + this.params.userName)

      axios.post('/api/chat/group/admin', this.params)
          .then((response) => {
            console.log(response)
            // this.redirectGroupPannel()
          })
          .catch((error) => {
            console.log(error)
            return
          });
      this.adminText = ''
    },
    deleteAdmin(): void {
      // Validates the input before sending the message.
      if (this.adminText.length <= 0) {
        this.adminText = ''
        return
      }

      this.params.userName = this.adminText
      console.log('test username: ' + this.params.userName)

      axios.delete('/api/chat/group/admin', {data: this.params})
          .then((response) => {
            console.log(response)
            // this.redirectGroupPannel()
          })
          .catch((error) => {
            console.log(error)
            return
          });
      this.adminText = ''
    },
    addMuted(): void {
      // Validates the input before sending the message.
      if (this.mutedText.length <= 0) {
        this.mutedText = ''
        return
      }

      this.params.userName = this.mutedText
      console.log('test username: ' + this.params.userName)
      axios.post('/api/chat/group/muted', this.params)
          .then((response) => {
            console.log(response)
            // this.redirectGroupPannel()
          })
          .catch((error) => {
            console.log(error)
            return
          });
      this.mutedText = ''
    },
    deleteMuted(): void {
      // Validates the input before sending the message.
      if (this.mutedText.length <= 0) {
        this.mutedText = ''
        return
      }

      this.params.userName = this.mutedText
      console.log(this.params)

      axios.delete('/api/chat/group/muted', {data: this.params})
          .then((response) => {
            console.log(response)
            // this.redirectGroupPannel()
          })
          .catch((error) => {
            console.log(error)
            return
          });
      this.mutedText = ''
    },
    addBanned(): void {
      // Validates the input before sending the message.
      if (this.bannedText.length <= 0) {
        this.bannedText = ''
        return
      }

      this.params.userName = this.bannedText
      console.log('test username: ' + this.params.userName)
      //
      axios.post('/api/chat/group/banned', this.params)
          .then((response) => {
            console.log(response)
            // this.redirectGroupPannel()
          })
          .catch((error) => {
            console.log(error)
            return
          });
      this.bannedText = ''
    },
    deleteBanned(): void {
      // Validates the input before sending the message.
      if (this.bannedText.length <= 0) {
        this.bannedText = ''
        return
      }

      this.params.userName = this.bannedText
      console.log('test username: ' + this.params.userName)
      axios.delete('/api/chat/group/banned', {data: this.params})
          .then((response) => {
            console.log(response)
            // this.redirectGroupPannel()
          })
          .catch((error) => {
            console.log(error)
            return
          })
      this.bannedText = ''
    },
  },
}
</script>