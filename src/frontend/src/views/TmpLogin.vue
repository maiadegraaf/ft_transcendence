<template>
  <div>
    <select v-model="selectedUser">
      <option v-for="user in users" :value="user">{{ user }}</option>
    </select>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { mapActions } from 'vuex';
import io from 'socket.io-client';

export default {
  data() {
    return {
      users: [],
      selectedUser: null,
      socket: io('http://localhost:8080'),
    };
  },
  mounted() {
    // retrieve list of users from API endpoint
    axios.get('/users').then((response) => {
      console.log(response.data);
      this.users = response.data;
    });

    // establish socket connection and emit selected user
    this.socket.on('connect', () => {
      if (this.selectedUser) {
        this.socket.emit('userSelected', this.selectedUser);
      }
    });

    // listen for selected user updates from socket
    this.socket.on('userSelected', (user) => {
      this.selectedUser = user;
    });
  },
  methods: {
    ...mapActions(['storeSelectedUser']),
    selectUser() {
      // store selected user in Vuex and emit to socket
      this.storeSelectedUser(this.selectedUser);
      this.socket.emit('userSelected', this.selectedUser);
    },
  },
};
</script>
