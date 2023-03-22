<!--<template>-->
<!--  <div v-if="!started" class="start-screen">-->
<!--    <h1>PONG</h1>-->
<!--    <button @click="start">Start Game</button>-->
<!--  </div>-->
<!--  <div v-else>-->
<!--    <div class="pongGame">-->
<!--      <div class="player player1" :style="{top: player1.y + 'px'}"></div>-->
<!--      <div class="player player2" :style="{top: player2.y + 'px'}"></div>-->
<!--      <div class="ball" :style="{top: ball.y + 'px', left: ball.x + 'px'}"></div>-->
<!--      <div class="score">-->
<!--        <span>{{ player1.score }}</span>-->
<!--        <span>{{ player2.score }}</span>-->
<!--      </div>-->
<!--      <div v-if="gameOver" class="end-screen">-->
<!--        <h1>Game Over</h1>-->
<!--        <h3>{{ winner }} Wins!</h3>-->
<!--        <button @click="start">Play Again</button>-->
<!--      </div>-->
<!--    </div>-->
<!--    <p class="text-center"> Use the up and down keys to control the paddle </p>-->
<!--  </div>-->
<!--</template>-->

<template>
  <div v-if="!started" class="flex flex-col items-center justify-center h-screen bg-dark-purple text-white">
    <h1 class="text-5xl mb-8 text-buff font-bold text-shadow-lg">PONG</h1>
    <button @click="start" class="px-8 py-4 bg-vista-blue hover:bg-yinmn-blue text-dark-purple text-2xl font-bold rounded-lg cursor-pointer">Start Game</button>
  </div>
  <div v-else>
    <div class="relative mx-auto w-10/12 aspect-video border-double border-4 border-buff bg-dark-purple" ref="pongGame">
      <div class="absolute left-5 w-5 h-24 bg-white" :style="{top: player1.y + 'px'}"></div>
      <div class="absolute right-5 w-5 h-24 bg-white" :style="{top: player2.y + 'px'}"></div>
      <div class="absolute w-5 h-5 bg-white rounded-full" :style="{top: ball.y + 'px', left: ball.x + 'px'}"></div>
      <div class="absolute top-2 left-1/2 transform -translate-x-1/2 text-white text-3xl font-bold p-3">
        <span class="p-4">{{ player1.score }}</span>
        <span class="p-4">{{ player2.score }}</span>
      </div>
      <div class="absolute inset-y-0 left-1/2 border-l border-dashed border-buff"></div>
      <div v-if="gameOver" class="absolute top-0 left-0 w-full h-full bg-dark-purple text-white flex flex-col items-center justify-center">
        <h1 class="text-5xl text-buff font-bold text-shadow-lg mb-8">Game Over</h1>
        <h3 class="text-3xl text-buff font-bold text-shadow-lg mb-8">{{ winner }} Wins!</h3>
        <button @click="start" class="px-8 py-4 bg-vista-blue hover:bg-yinmn-blue text-dark-purple text-2xl font-bold rounded-lg cursor-pointer">Play Again</button>
      </div>
    </div>
    <p class="mx-auto w-full text-center top-2 text-white text-lg"> Use the up and down keys to control the paddle </p>
  </div>
</template>


<script lang="ts">
import io from "socket.io-client";
import type { Socket } from "socket.io-client";
// import { onMounted, ref } from "vue";

export default {
  name: 'pongGame',
  data(): any {
    return {
      started: false,
      gameOver: false,
      winner: '',
      gamestate: '',
      ball: {
        x: 400,
        y: 300,
      },
      player1: {
        y: 250,
        score: 0,
      },
      player2: {
        y: 250,
        score: 0,
      },
      gameSize: {
        h: 0,
        w: 0,
      }
    }
  },
  mounted() {
    //connect to the servers websocket
    const socket: Socket = io("http://localhost:8080");

    //listen for the state updates from the server
    socket.on("state", (state) => {
      this.ball = state.ball;
      this.player1 = state.player1;
      this.player2 = state.player2;
      this.gamestate = state.gamestate;
      this.winner = state.winner;
      if (this.gamestate === 'playing') {
        this.started = true;
      }
    });

    window.addEventListener('keydown', (event) => {
      switch (event.keyCode) {
        case 38: // up arrow key
          socket.emit("move", -1);
          break;
        case 40: // down arrow key
          socket.emit("move", 1);
          break;
        case 87: // w key
          socket.emit("move2", -1);
          break;
        case 83: // s key
          socket.emit("move2", 1);
          break;
      }
    });
    window.addEventListener('resize', this.resize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resize);
  },
  updated() {
    this.$nextTick(() => {
      this.gameSize.h = this.$refs.pongGame.clientHeight;
      this.gameSize.w = this.$refs.pongGame.clientWidth;
    });
  },
  methods: {
    start() {
      this.started = true;
      this.gameOver = false;
      this.winner = "";
      const socket: Socket = io("http://localhost:8080");
      socket.emit("start");
      console.log(this.gameSize);
      socket.emit("size", this.gameSize);
    },
    resize() {
      this.gameSize.h = this.$refs.pongGame.clientHeight;
      this.gameSize.w = this.$refs.pongGame.clientWidth;
      const socket: Socket = io("http://localhost:8080");
      socket.emit("size", this.gameSize);
    }
  },
  watch: {
    gamestate() {
      if (this.gamestate === 'end') {
        this.gameOver = true;
      }
    },

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--<style scoped>-->
<!--* {-->
<!--  font-family: Courier New, monospace;-->
<!--}-->

<!--.pongGame {-->
<!--  position: relative;-->
<!--  width: 800px;-->
<!--  height: 600px;-->
<!--  background-color: #000;-->
<!--  margin: 0 auto;-->
<!--  border: 1px solid #fff;-->
<!--}-->
<!--.player {-->
<!--  position: absolute;-->
<!--  width: 20px;-->
<!--  height: 100px;-->
<!--  background-color: #fff;-->
<!--}-->

<!--.player1 {-->
<!--  left: 20px;-->
<!--}-->

<!--.player2 {-->
<!--  right: 20px;-->
<!--}-->

<!--.ball {-->
<!--  position: absolute;-->
<!--  width: 20px;-->
<!--  height: 20px;-->
<!--  background-color: #fff;-->
<!--  border-radius: 50%;-->
<!--}-->

<!--.score {-->
<!--  position: absolute;-->
<!--  top: 20px;-->
<!--  left: 50%;-->
<!--  transform: translateX(-50%);-->
<!--  font-size: 2em;-->
<!--  color: #fff;-->
<!--}-->

<!--.score span {-->
<!--  display: inline-block;-->
<!--  width: 50px;-->
<!--  text-align: center;-->
<!--}-->

<!--.start-screen {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--  height: 100vh;-->
<!--  background-color: black;-->
<!--  color: white;-->
<!--}-->

<!--.start-screen h1 {-->
<!--  font-size: 5rem;-->
<!--  margin-bottom: 3rem;-->
<!--  text-shadow: 2px 2px 4px purple;-->
<!--}-->

<!--.start-screen button {-->
<!--  font-size: 2rem;-->
<!--  padding: 1rem 2rem;-->
<!--  border: none;-->
<!--  background-color: white;-->
<!--  color: black;-->
<!--  cursor: pointer;-->
<!--}-->

<!--.end-screen {-->
<!--  position: absolute;-->
<!--  top: 0;-->
<!--  left: 0;-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--  background-color: black;-->
<!--  color: white;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--}-->

<!--.end-screen h1 {-->
<!--  font-size: 5rem;-->
<!--  text-shadow: 2px 2px 4px purple;-->
<!--}-->

<!--.end-screen h3 {-->
<!--  font-size: 3rem;-->
<!--  text-shadow: 2px 2px 4px purple;-->
<!--}-->

<!--.end-screen button {-->
<!--  font-size: 2rem;-->
<!--  padding: 1rem 2rem;-->
<!--  border: none;-->
<!--  background-color: white;-->
<!--  color: black;-->
<!--  cursor: pointer;-->
<!--}-->
<!--</style>-->
