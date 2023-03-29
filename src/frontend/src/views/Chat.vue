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
      <v-list></v-list>
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
            <div v-for="message of messages" :key="message.name">
              <v-card v-if="message.name === 'Bert'"
                      flat
                      tile
                      class="mb-1 ml-2 d-flex justify-center"
                      width=50%
                      color="purple-darken-2"
              >
                <div class="font-weight-bold mt-2 ml-3"> {{ message.name }}</div>
                <div class="mr-2 mb-2 ml-3"> {{ message.text }}</div>
              </v-card>
              <div class="d-flex justify-end">
                <v-card v-if="message.name === 'Hans'"
                        class="mb-1 mr-2 text-right d-flex justify-center"
                        tile
                        flat
                        width=50%
                        color="purple-lighten-2"
                >
                  <div class="font-weight-bold mr-4 mt-1"> {{ message.name }}</div>
                  <div class="mr-4 mb-1 ml-2"> {{ message.text }}</div>
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
  <v-text-field
      bg-color="white"
      v-model="name"
      label="Name"
      placeholder="Enter your name"
      required></v-text-field>
</template>

<script lang="ts">
import io from 'socket.io-client'
import Nav from '@/components/Nav.vue'
import { nextTick } from 'vue'

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
      name: string
      text: string
    }[]
    socket: any
    userId: number
    ChannelId: number
  } {
    // The initial data of the Vue instance.
    return {
      title: 'Nestjs Websockets Chat',
      name: '',
      text: '',
      messages: [],
      socket: null,
      userId: 0,
      ChannelId: 1
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
    // Sends a message to the server.
    sendMessage(): void {
      // Validates the input before sending the message.
      if (this.validateInput()) {
        const message = {
          name: this.name,
          text: this.text
        }
        // Emits a 'msgToServer' event with the message.
        this.socket.emit('msgToServer', message)
        // Resets the input field.
        this.text = ''
      }
    },
    // Receives a message from the server.
    async receivedMessage(message: { name: string; text: string }): Promise<void> {
      // Adds the message to the messages array.
      this.messages.push(message)
    },
    // Validates the input for sending a message.
    validateInput(): boolean {
      return this.name.length > 0 && this.text.length > 0
    }
  },
  // The created hook of the Vue instance.
  created(): void {
    // Initializes the Socket.IO client and stores it in the Vue instance.
    this.socket = io('http://localhost:8080')
    // Listens for 'msgToClient' events and calls the receivedMessage method with the message.
    this.socket.on('msgToClient', (message: { name: string; text: string }) => {
      this.receivedMessage(message)
    })
  }
}
</script>

<style>

</style>
