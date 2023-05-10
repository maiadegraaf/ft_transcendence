<template>
  <div class="p-3 flex">
    <button @click="goBack" class="rounded-full ml-3 hover:shadow-md">Go Back</button>
  </div>
  <div class="p-3 flex">
    <div class="flex-1 p-1 bg-white rounded-md">
      <input v-model="joinGroupText" placeholder="Join an Existing Group" class="w-full focus:outline-none">

    </div>
    <button @click="joinGroup" class="rounded-full ml-3 hover:shadow-md">Join</button>
  </div>
  <div class="p-3 flex">
    <div class="flex-1 p-1 bg-white rounded-md">
      <input v-model="groupText" placeholder="New Group Name" class="w-full focus:outline-none">
    </div>
    <button @click="newPrivateGroupChannel" class="rounded-full ml-3 hover:shadow-md">Private</button>
    <button @click="newPublicGroupChannel" class="rounded-full ml-3 hover:shadow-md">Public</button>
    <button @click="newProtectedGroupChannel" class="rounded-full ml-3 hover:shadow-md">Protected</button>
  </div>
  <div class="p-3 flex">
    <div class="flex-1 p-1 bg-white rounded-md">
      <input v-model="passwordText" placeholder="New Password" class="w-full focus:outline-none">
    </div>
    <button @click="enterPassword" class="rounded-full ml-3 hover:shadow-md">go</button>
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
import {useUserStore} from "@/store/user.store";
import { EGroupChannelType } from "@/types/types";
import {defineComponent} from "vue";
import SetPassword from "@/components/Chat/SetPassword.vue";

export default defineComponent({
  name: "NewChannel",
  // props: ['chatStore']
  setup() {
    const chatStore = useChatStore()
    const user = useUserStore()
    // chatStore.setupChatStore()
    return { chatStore, user }
  },
  data(): any {
    return {
      dmText: '',
      groupText: '',
      joinGroupText: '',
      passwordText: '',
    }
  },
  async mounted() {
  },
  methods: {
    dmNewUser(): void {
      // Validates the input before sending the message.
      if (this.dmText.length <= 0) {
        this.dmText = ''
        return
      }
      const param = {
        userId: this.user.id,
        invitee: this.dmText,
      }
      axios.post('/api/chat/dm', param)
      this.dmText = ''
      // setchannel in view
      this.$emit('switch-chat-right-component', MessageList)
    },
    joinGroup(): void {
      if (this.joinGroupText.length <= 0) {
        this.joinGroupText = ''
        return
      }
      const param = {
        userId: this.user.id,
        groupName: this.joinGroupText,
      }
      axios.post('api/chat/group/join', param)
          .then((response) => {
            console.log(response)
            if (!response.data) {
              this.$emit('switch-chat-right-component', MessageList)
            }
            this.chatStore.setGroupId(response.data.id)
            if (response.data.type == EGroupChannelType.PROTECTED) {
              console.log('kamaan')
              this.$emit('switch-chat-right-component', SetPassword)
              this.joinGroupText = ''
              return
            }
            // this.redirectGroupPannel()
          })
          .catch((error) => {
            this.joinGroupText = ''
            console.log(error)
            this.$emit('switch-chat-right-component', MessageList)
            return
          });
      // console.log("door el join")
      // this.joinGroupText = ''
      // this.$emit('switch-chat-right-component', MessageList)
    },
    newPrivateGroupChannel(): void {
      // Validates the input before sending the message.
      if (this.groupText.length <= 0) {
        this.groupText = ''
        return
      }
      const param = {
        userId: this.user.id,
        groupName: this.groupText,
        type: EGroupChannelType.PRIVATE,
        password: null,
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
    newPublicGroupChannel(): void {
      // Validates the input before sending the message.
      if (this.groupText.length <= 0) {
        this.groupText = ''
        return
      }
      const param = {
        userId: this.user.id,
        groupName: this.groupText,
        type: EGroupChannelType.PUBLIC,
        password: null,
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
    newProtectedGroupChannel(): void {
      if (this.groupText.length <= 0) {
        this.groupText = ''
        return
      }
    },
    enterPassword(): void {
      if (this.passwordText.length <= 0 || this.groupText.length <= 0) {
        this.passwordText = ''
        this.groupText = ''
        return
      }
      const param = {
        userId: this.user.id,
        groupName: this.groupText,
        type: EGroupChannelType.PROTECTED,
        password: this.passwordText,
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
      this.passwordText = ''
      this.groupText = ''
    },
    goBack(): void {
      this.$emit('switch-chat-right-component', MessageList)
    },
  }
})
</script>

<style scoped>

input {
  color: black;
}

</style>