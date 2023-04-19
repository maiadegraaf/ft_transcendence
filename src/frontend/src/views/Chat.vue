<template>
  <Nav />
  <v-sheet
      elevation="5"
      class="mx-auto d-flex"
      width="75%"
      height="75%"
  >
    <v-sheet
        height="100%"
        width="30%"
    >
      <v-toolbar
          density="compact"
          title="Channels"
          color="grey"
          class="border-right"
      ></v-toolbar>
      <v-list id="channelList">
        <div v-for="n in userChannels.channels" :key="n.id">
          <v-btn :key="n.name.toString()" @click="joinRoom(n.id)">{{ n.name }} : Channel {{ n.id }}</v-btn>
        </div>
      </v-list>
      <v-footer>
        <v-row>Footer</v-row>
      </v-footer>
    </v-sheet>
    <v-sheet
        class="d-flex flex-column"
        height="100%"
        width="70%"
        color="deep-purple-lighten-4"
    >
      <v-toolbar
          density="compact"
          title="Chat"
          color="grey"
      ></v-toolbar>
      <div class="overflow-y-auto fill-height d-flex flex-column-reverse" ref="chatSpace">
          <v-list id="chatList" class="bg-deep-purple-lighten-4">
            <div v-for="message of messages" :key="message.userId">
              <v-card v-if="message.userId != userId"
                      flat
                      tile
                      class="mb-1 ml-2 d-flex justify-center"
                      width=50%
                      color="purple-darken-2"
              >
                <div class="font-weight-bold mt-2 ml-3"> {{ message.sender }}</div>
                <div class="mr-2 mb-2 ml-3"> {{ message.text }}</div>
                <div class="mr-2 mb-2 ml-3">{{ new Date().toLocaleTimeString('en-GB') }}</div>
              </v-card>
              <div class="d-flex justify-end">
                <v-card v-if="message.userId == userId"
                        class="mb-1 mr-2 text-right d-flex justify-center"
                        tile
                        flat
                        width=50%
                        color="purple-lighten-2"
                >
<!--                  <div class="font-weight-bold mr-4 mt-1"> {{ message.sender }}</div>-->
                  <div class="mr-4 mb-1 ml-2"> {{ message.text }}</div>
                  <div class="mr-2 mb-2 ml-3">{{ new Date().toLocaleTimeString('en-GB') }}</div>
                </v-card>
              </div>
            </div>
          </v-list>
      </div>
      <v-sheet
          color="grey-lighten-3"
          width="100%"
      >
          <v-text-field
              v-model="text"
              density="compact"
              variant="solo"
              label="message..."
              single-line
              hide-details
              class="ml-4 mr-2 my-3"
              @keyup.enter="sendMessage"
          >
            <template v-slot:append>
              <v-btn
                  @click="sendMessage"
                  variant="plain"
                  icon="mdi-send"
                  density="compact"
              >
              </v-btn>
            </template>
          </v-text-field>
      </v-sheet>
    </v-sheet>
  </v-sheet>
  <br>
  <v-sheet
      color="grey-lighten-3"
      width="40%"
  >
    <v-text-field
        v-model="invite"
        density="compact"
        variant="solo"
        label="New DM user name..."
        single-line
        hide-details
        class="ml-4 mr-2 my-3"
        @keyup.enter="createChannel(invite)"
    >
    </v-text-field>
  </v-sheet>
  <v-btn @click="createChannel(invite)">Create Channel</v-btn>
</template>

<script lang="ts">
import io from 'socket.io-client'
import Nav from '@/components/Nav.vue'
import { nextTick } from 'vue'
import axios from "axios";
import {VueCookieNext} from "vue-cookie-next";
import {promises} from "dns";
// import {UserChatStore} from "@/store/store";

export default {
  components: { Nav },
  // The root element of the Vue instance.
  el: '#app',
  // The data object of the Vue instance.
  data(): {
    title: string
    name: string
    text: string
    invite: string
    userChannels: {
      id: number
      name: string
      channels: {
        id: number,
        messages: {
          id: number,
          sender: number,
          senderName: string,
          channel: number,
          text: string,
          // timestamp: Date,
        }[],
        name: string,
        groupProfile: null,
      }[]
    }
    messages: {
      userId: number,
      text: string,
      channelId: number,
      sender: string,
    }[]
    socket: any
    userId: number
    channelId: number
    joined: boolean
  } {
    // The initial data of the Vue instance.
    return {
      title: 'Nestjs Websockets Chat',
      name: '',
      text: '',
      invite: '',
      userChannels: {
        id: 0,
        name: '',
        channels: [],
      },
      messages: [],
      socket: null,
      userId: -1,
      channelId: -1,
      joined: false,
    }
  },
  mounted() {
    const userSession = sessionStorage.getItem('user')
    if (userSession == null) {
      this.$router.push('/Login')
      return
    } else {
      const user = JSON.parse(userSession).user
      this.userId = user.id
      this.name = user.login
      fetch('http://localhost:8080/api/chat/' + this.userId)
          .then(response => response.json())
          .then(data => {
            console.log('got something at retrieve Chat data')
            console.log(data);
            this.userChannels = data
          }).catch(error => {
        console.log(error)
      })
    }
    console.log('this is user: ' + this.userId + '. With name: ' + this.name)
    // Initializes the Socket.IO client and stores it in the Vue instance.
    this.socket = io('http://localhost:8080', {
      query: {
        userId: this.userId,
        userName: this.name,
      },
    });
    // Listens for 'msgToClient' events and calls the receivedMessage method with the message.
    this.socket.on('msgToClient', (message: { id: number, sender: number, senderName: string, channel: number, text: string, }) => {
      this.receivedMessage(message)
    })
    // Listens for 'newUserToChannel' events and calls the addChannelToUser method with the channel.
    this.socket.on('newUserToChannel', (channel: { userId: number, userName: string, channelId: number, channelName: string }) => {
      this.addChannelToUser(channel)
    })
  },
  watch: {
    // Watches the messages array for changes and scrolls the chat window to the bottom.
    messages: {
      handler(): void {
        nextTick(() => {
          const container = document.getElementById('chatList')
          if (container) {
            container.scrollTop = container.scrollHeight
          }
        })
      },
      deep: true
    }
  },

  // The methods of the Vue instance.
  methods: {
    // Sends a message to the server.
    async joinRoom(id: number): Promise<void> {
      if (id == this.channelId) {
        return
      }
      const payload = {
        userId: this.userId,
        userName: this.name,
        channelId: this.channelId
      }
      if (this.joined) {
        this.socket.emit('leaveRoom', payload)
      }
      this.channelId = id
      payload.channelId = id
      this.messages = []
      this.socket.emit('joinRoom', payload)
      await this.pushMessages()
      this.joined = true;
    },
    // Sends a message to the server.
    async pushMessages(): Promise<void> {
      const idx = this.userChannels.channels.findIndex((channel) => channel.id === this.channelId)
      const channel = await this.userChannels.channels[idx]
      await channel.messages.forEach((message) => {
        const msg = {
          userId: message.sender,
          text: message.text,
          channelId: message.channel,
          sender: message.senderName,
        }
        this.messages.push(msg)
      })
    },
    // Creates a new Channel.
    async createChannel(inviteeName: string): Promise<void> {
      const payload = {
        userId: this.userId,
        invitee: inviteeName,
      }
      await axios.post('http://localhost:8080/api/chat/dm', payload)
        .then((response) => {
          // console.log(response.data)
          // this.channelId = response.data.id
          console.log(response.data)
          this.channelId = response.data.id
          this.userChannels.channels.push(response.data)
      }).catch(error => {
        console.log(error)
      })
      this.invite = ''
      await this.joinRoom(this.channelId)
      this.joined = true
      // this.channelId = -1
    },
    // Sends a message to the server.
    sendMessage(): void {
      // Validates the input before sending the message.
      if (this.validateInput()) {
        // Creates a message object.
        const message = {
          id: 0,
          sender: this.userChannels.id,
          senderName: this.userChannels.name,
          channel: this.channelId,
          text: this.text,
        }
        this.socket.emit('msgToServer', message)
        // Resets the input field.
        this.text = ''
      }
    },
    // Receives a message from the server.
    async receivedMessage(message: { id: number, sender: number, senderName: string, channel: number, text: string }): Promise<void> {
      // Adds the message to the messages array.
      console.log(this.userId + ' this is the user id ')
      const msg = {
        userId: message.sender,
        text: message.text,
        channelId: message.channel,
        sender: message.senderName,
      }
      this.messages.push(msg)
      if (message.id > 0) {
        const Idx = this.userChannels.channels.findIndex((channel) => channel.id === message.channel)
        this.userChannels.channels[Idx].messages.push(message)
      }
    },
    // Validates the input for sending a message.
    validateInput(): boolean {
      return this.userChannels.name.length > 0 && this.text.length > 0
    },
    // Retrieves the channels per user
    async addChannelToUser(channel: { userId: number, userName: string, channelId: number, channelName: string}): Promise <void> {
      console.log(this.userId + ' this is the user id ')
      if (this.userId !== channel.userId || this.name !== channel.userName) {
        console.log('not correct channel for user')
        return
      }
      await this.socket.emit('joinRoom', channel)
      await fetch('http://localhost:8080/api/chat/' + this.userId + '/channel/' + channel.channelId)
        .then(response => response.json())
        .then(data => {
          console.log('got something at retrieve addChannelToUser')
          console.log(data);
          this.userChannels.channels.push(data)
        }).catch(error => {
        console.log(error)
      })
      this.joined = true
    },
  },
  // The created hook of the Vue instance.
  created(): void {

  }
}
</script>

<style>

</style>
