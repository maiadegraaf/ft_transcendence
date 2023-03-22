<template>
  <div id="app" class="container">
            <div class="row">
                <div class="col-md-6 offset-md-3 col-sm-12">
                    <h1 class="text-center">{{ title }}</h1>
                    <br>
                    <div id="status"></div>
                    <div id="chat">
                        <input type="text" v-model="name" id="username" class="form-control" placeholder="Enter name...">
                        <br>
                        <div class="card">
                            <div id="messages" class="card-block">
                                <ul>
                                    <li v-for="message of messages" :key="message.name">{{ message.name }}: {{ message.text }}</li>
                                </ul>
                            </div>
                        </div>
                        <br>
                        <textarea id="textarea" class="form-control" v-model="text" placeholder="Enter message..."></textarea>
                        <br>
                        <button id="send" class="btn" @click.prevent="sendMessage">Send</button>
                    </div>
                </div>
            </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
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
  created: function (): void {
    // Initializes the Socket.IO client and stores it in the Vue instance.
    this.socket = io('http://localhost:8080');
    // Listens for 'msgToClient' events and calls the receivedMessage method with the message.
    this.socket.on('msgToClient', (message: { name: string; text: string }) => {
      this.receivedMessage(message);
    });
  },
};
</script>

<style>

#messages{
  height:300px;
  overflow-y: scroll;
}

#app {
  margin-top: 2rem;
  margin: auto;
  width: 40%;
}
</style>
