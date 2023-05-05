<template>
<!--  <header class="bg-normal w-full min-h-10">-->
  <div class="w-3/4 h-full flex flex-col overflow-hidden">
    <div class="border-buff border-double border-2 rounded-md">
      <h2 class="h2">Group Settings</h2>
    </div>
    <div class="border-buff border-2 rounded-md">
      <h2 class="h2">{{ groupName }}</h2>
    </div>
    <div class="flex-1 w-full bg-dark-purple overflow-hidden">
      <button @click="doneGroup" class="rounded-full ml-3 hover:shadow-md">Go Back</button>
    </div>
    <GroupSettingUserList/>
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
import {useChatStore} from "../../store/channel.store";
import axios from "axios";
import MessageList from "@/components/Chat/MessageList.vue";
import {useUserStore} from "@/store/user.store";
import {defineComponent} from "vue";
import type {IUser} from "@/types/types";
import GroupSettingUserList from "@/components/Chat/GroupSettingUserList.vue";

export default defineComponent({
  name: "GroupSettings",
  components: {GroupSettingUserList},
  // props: ['chatStore']
  setup() {
    const chatStore = useChatStore()
    const userStore = useUserStore()
    return {chatStore, userStore}
  },
  data(): any {
    return {
      adminText: '',
      mutedText: '',
      bannedText: '',
      userText: '',
      params: {
        userId: 0,
        userName: '',
        groupId: 0,
        channelId: 0,
      },
      userName: '',
      groupName: '',
    }
  },
  async mounted() {
    this.userName = this.userStore.name
    this.groupName = this.chatStore.groupName
    this.params.userId = this.userStore.id
    this.params.channelId = this.chatStore.channelInView
    this.params.groupId = this.chatStore.groupId
    // this.profile = this.chatStore.getProfileByChannelId(this.chatStore.channelInView)
    // console.log(this.channelUsers)
    // console.log(this.profile)
  },
  methods: {
    doneGroup(): void {
      this.chatStore.setGroupId(0)
      this.chatStore.setGroupName('')
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
      console.log(this.params)

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
    // getRole(user: IUser): string {
    //   let str = ''
    //
    //   const profile = this.chatStore.getProfileByChannelId(this.chatStore.channelInView)
    //   if (profile) {
    //     if (profile.owner.id === user.id) {
    //       str += ' | (Owner)'
    //     }
    //     if (profile.admin.find((adm) => adm.id === user.id)) {
    //       str +=  ' | (Admin)'
    //     }
    //     if (profile.muted.find((mtd) => mtd.id === user.id)) {
    //       str +=  ' | (Muted)';
    //     }
    //   }
    //   return str;
    // },
  },
  created() {

  }
})
</script>

<style scoped>
input {
  color: black;
}
</style>
