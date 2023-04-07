<template>
  <Nav />
  <v-sheet elevation="5" class="mx-auto d-flex" width="75%" height="75%">
    <v-sheet height="100%" width="30%">
      <v-toolbar density="compact" title="Channels" color="grey" class="border-right"></v-toolbar>
      <v-list></v-list>
      <v-footer>
        <v-row>Footer</v-row>
      </v-footer>
    </v-sheet>
    <v-sheet class="d-flex flex-column" height="100%" width="70%" color="deep-purple-lighten-4">
      <v-toolbar density="compact" title="Chat" color="grey"></v-toolbar>
      <div class="overflow-y-auto fill-height d-flex flex-column-reverse" ref="chatSpace">
        <v-list id="chatList" class="bg-deep-purple-lighten-4">
          <div v-for="message of messages" :key="message.userId">
            <v-card
              v-if="message.userId != userId"
              flat
              tile
              class="mb-1 ml-2 d-flex justify-center"
              width="50%"
              color="purple-darken-2"
            >
              <div class="font-weight-bold mt-2 ml-3">{{ message.userId }}</div>
              <div class="mr-2 mb-2 ml-3">{{ message.text }}</div>
            </v-card>
            <div class="d-flex justify-end">
              <v-card
                v-if="message.userId == userId"
                class="mb-1 mr-2 text-right d-flex justify-center"
                tile
                flat
                width="50%"
                color="purple-lighten-2"
              >
                <div class="font-weight-bold mr-4 mt-1">{{ message.userId }}</div>
                <div class="mr-4 mb-1 ml-2">{{ message.text }}</div>
              </v-card>
            </div>
          </div>
        </v-list>
      </div>
      <v-sheet color="grey-lighten-3" width="100%">
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
            <v-btn @click="sendMessage" variant="plain" icon="mdi-send" density="compact"> </v-btn>
          </template>
        </v-text-field>
      </v-sheet>
    </v-sheet>
  </v-sheet>
  <br />
  <v-text-field
    bg-color="white"
    v-model="name"
    label="Name"
    placeholder="Enter your name"
    required
  ></v-text-field>
  <v-btn @click="createChannel">Create Channel</v-btn>
  <v-btn @click="channelsByUser">Get Channels</v-btn>
  <v-btn @click="joinRoom">Join Room</v-btn>
</template>

<script lang="ts">
import io from 'socket.io-client'
import Nav from '@/components/Nav.vue'
import { nextTick } from 'vue'
import axios from 'axios'

export default {
  components: { Nav },
  // The root element of the Vue instance.
  el: '#app',
  // The data object of the Vue instance.
  data(): {
    title: string
    name: string
    text: string
    messages: {
      userId: number
      text: string
      channelId: number
    }[]
    socket: any
    userId: number
    channelId: number
  } {
    // The initial data of the Vue instance.
    return {
      title: 'Nestjs Websockets Chat',
      name: '',
      text: '',
      messages: [],
      socket: null,
      userId: 0,
      channelId: 1
    }
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
    joinRoom(): void {
      this.setUserId()
      const payload = {
        userId: this.userId,
        channelId: this.channelId
      }
      this.socket.emit('joinRoom', payload)
    },
    setUserId(): void {
      if (this.name === 'Bert') {
        this.userId = 1
      } else {
        this.userId = 2
      }
      this.channelId = 1
    },
    // Creates a new Channel.
    createChannel(): void {
      const payload = {
        user1: 1,
        user2: 2
      }
      axios.post('http://localhost:8080/api/chat/dm', payload).then((response) => {
        console.log(response.data)
        this.channelId = response.data.id
      })
    },
    // Sends a message to the server.
    sendMessage(): void {
      // Validates the input before sending the message.
      if (this.validateInput()) {
        // Creates a message object.
        const message = {
          userId: this.userId,
          text: this.text,
          channelId: this.channelId
        }
        this.socket.emit('msgToServer', message)
        // Resets the input field.
        this.text = ''
      }
    },
    // Receives a message from the server.
    async receivedMessage(message: {
      userId: number
      text: string
      channelId: number
    }): Promise<void> {
      // Adds the message to the messages array.
      this.messages.push(message)
    },
    // Validates the input for sending a message.
    validateInput(): boolean {
      return this.name.length > 0 && this.text.length > 0
    },
    // Retrieves the channels per user
    channelsByUser(): void {
      const userId = sessionStorage.getItem('session_user_id')
      if (!userId) {
        return
      }
      const userIdValue = JSON.parse(userId).value
      axios.get('http://localhost:8080/api/chat/' + userIdValue + '/channel').then((response) => {
        console.log(response.data)
      })
    }
  },
  // The created hook of the Vue instance.
  created(): void {
    // Initializes the Socket.IO client and stores it in the Vue instance.
    this.socket = io('http://localhost:8080')
    // Listens for 'msgToClient' events and calls the receivedMessage method with the message.
    this.socket.on(
      'msgToClient',
      (message: { userId: number; text: string; channelId: number }) => {
        this.receivedMessage(message)
      }
    )
  }

  // .then((response) => {
  //   console.log(response.data)
  //   this.channelId = response.data.id
  // })
}
</script>

<style></style>
