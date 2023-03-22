<template>
  <v-card
      class="mx-auto"
      color="secondary"
      width="75%"
      title="Chat"
  >
    <v-list bg-color="secondary">
      <div v-for="message of messages" :key="message.name">
        <v-card v-if="message.name === 'Bert'"
                flat
                tile
                class="mb-1 ml-2 d-flex justify-center"
                width=50%
        >
          <div class="font-weight-bold mt-2 ml-3"> {{ message.name }} </div>
          <div class="mr-2 mb-2 ml-3"> {{ message.text }} </div>
        </v-card >
        <div class="d-flex justify-end">
          <v-card v-if="message.name === 'Hans'"
                  class="mb-1 mr-2 text-right d-flex justify-center"
                  tile
                  flat
                  width=50%
                  color="red"
          >
            <div class="font-weight-bold mr-4 mt-1"> {{ message.name }} </div>
            <div class="mr-4 mb-1 ml-2"> {{ message.text }} </div>
          </v-card>
        </div>
      </div>
    </v-list>
  </v-card>
  <br>
  <input type="text" v-model="name" id="username" class="form-control" placeholder="Enter name...">
  <br>
  <textarea id="textarea" class="form-control" v-model="text" placeholder="Enter message..."></textarea>
  <br>
  <button id="send" class="btn" @click.prevent="sendMessage">Send</button>
</template>

<script lang="ts">
import io from 'socket.io-client';

export default {
  // The root element of the Vue instance.
  el: '#app',
  // The data object of the Vue instance.
  data(): {
    title: string;
    name: string;
    text: string;
    messages: {
      name: string;
      text: string;
      // id: number
    }[];
    socket: any;
  } {
    // The initial data of the Vue instance.
    return {
      title: 'Nestjs Websockets Chat',
      name: '',
      text: '',
      messages: [],
      socket: null,
    };
  },
  // The methods of the Vue instance.
  methods: {
    // Sends a message to the server.
    sendMessage(): void {
      // Validates the input before sending the message.
      if (this.validateInput()) {
        const message = {
          name: this.name,
          text: this.text,
        };
        // Emits a 'msgToServer' event with the message.
        this.socket.emit('msgToServer', message);
        // Resets the input field.
        this.text = '';
      }
    },
    // Receives a message from the server.
    receivedMessage(message: { name: string; text: string}): void {
      // Adds the message to the messages array.
      this.messages.push(message);
    },
    // Validates the input for sending a message.
    validateInput(): boolean {
      return this.name.length > 0 && this.text.length > 0;
    },
  },
  // The created hook of the Vue instance.
  created(): void {
    // Initializes the Socket.IO client and stores it in the Vue instance.
    this.socket = io('http://localhost:8080');
    // Listens for 'msgToClient' events and calls the receivedMessage method with the message.
    this.socket.on('msgToClient', (message: { name: string; text: string}) => {
      this.receivedMessage(message);
    });
  },
};
</script>

<style>


</style>