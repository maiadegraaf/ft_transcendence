<template>
  <div v-if="!started" class="mx-auto flex flex-col items-center justify-center w-10/12 aspect-video bg-dark-purple text-white">
    <h1 class="text-8xl mb-8 font-bold text-buff drop-shadow-lg shadow-vista-blue-500/50">PONG</h1>
    <button v-if="!waiting" @click="setPracticeMode" class="m-4 px-8 py-4 bg-vista-blue hover:text-vista-blue hover:bg-yinmn-blue text-yinmn-blue text-2xl font-bold rounded-lg cursor-pointer border-solid border-4 border-blush border-vista-blue border-red-500">
      Start a Practice Game
    </button>
    <div v-if="practiceMode" class="flex flex-col items-center">
      <label for="winningScore" class="mb-4 flex items-center">
        <span class="mr-2 text-2xl font-bold text-buff">Winning Score:</span>
        <input value="10" type="number" id="winningScore" v-model.number="winningScore" min="1" class="w-16 px-2 py-1 text-2xl font-bold rounded-lg border border-solid border-amaranth-purple bg-buff text-amaranth-purple focus:text-buff focus:bg-amaranth-purple focus:outline-none focus:border-amaranth-purple">
      </label>
      <label for="difficulty" class="mb-4 flex items-center">
        <span class="mr-2 text-2xl font-bold text-buff">Difficulty:</span>
        <select id="difficulty" v-model="difficulty" class="w-32 px-4 py-2 text-2xl font-bold text-amaranth-purple focus:text-buff rounded-lg border border-amaranth-purple border-solid  focus:outline-none bg-buff focus:outline-none focus:bg-amaranth-purple focus:outline-none focus:border-amaranth-purple">
          <option value="easy">Easy</option>
          <option value="normal">Normal</option>
          <option value="hard">Hard</option>
          <option value="impossible">Impossible</option>
        </select>
      </label>
      <button @click="start" class="m-4 px-8 py-4 bg-vista-blue hover:text-vista-blue hover:bg-yinmn-blue text-yinmn-blue text-2xl font-bold rounded-lg cursor-pointer border-solid border-4 border-blush border-vista-blue border-red-500">
          Start Game
      </button>
    </div>
      <div v-else>
        <button v-if="!waiting" @click="joinMatch" class="m-4 px-8 py-4 bg-vista-blue hover:text-vista-blue hover:bg-yinmn-blue text-yinmn-blue text-2xl font-bold rounded-lg cursor-pointer border-solid border-4 border-blush border-vista-blue border-red-500">
          Join Match
        </button>
        <div v-if="waiting">
            <p>Waiting for opponent...</p>
            <button @click="leaveList" class="m-4 px-8 py-4 bg-vista-blue hover:text-vista-blue hover:bg-yinmn-blue text-yinmn-blue text-2xl font-bold rounded-lg cursor-pointer border-solid border-4 border-blush border-vista-blue border-red-500">
              Leave Waitlist
            </button>
        </div>
      </div>
  </div>
  <div v-else class="mx-auto w-[800px]">
    <div class="relative w-full aspect-video border-double border-4 border-buff bg-dark-purple" ref="pongGame">
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
        <button @click="reset" class="m-4 px-8 py-4 bg-vista-blue hover:text-vista-blue hover:bg-yinmn-blue text-yinmn-blue text-2xl font-bold rounded-lg cursor-pointer border-solid border-4 border-blush border-vista-blue border-red-500">
          Play Again
        </button>
      </div>
    </div>
    <div class="mx-auto flex w-2/3 m-2 items-center">
      <div class="flex-auto w-1/3">
        <img src="../assets/images/up-down_keys.png" alt="Use the up and down keys to control the paddle" class="mx-auto my-4"/>
      </div>
      <div class="text-center">
        <p class="mx-auto w-full text-white text-lg"> Use the up and down keys to control the paddle </p>
      </div>
    </div>
  </div>
</template>

<!---->

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
      waiting: false,
      practiceMode: false,
      winningScore: 10,
      difficulty: 'easy',
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
      },
      practiceSettings: {
        score: 10,
        difficulty: 'easy',
      },
      // socket: io("http://localhost:8080"),
      info: {
        matchId: '',
        d: 0,
      }
    }
  },
  created() {
    // this.socket = io("http://localhost:8080");
  },
  mounted() {
    this.socket = io("http://localhost:8080");

    //listen for the state updates from the server
    this.socket.on("state", (state: { ball: any; player1: any; player2: any; gamestate: any; winner: any; }) => {
      this.ball = state.ball;
      this.player1 = state.player1;
      this.player2 = state.player2;
      this.gamestate = state.gamestate;
      this.winner = state.winner;
      if (this.gamestate === 'playing') {
        this.started = true;
      }
    });

    this.socket.on("opponentFound", (matchId: number) => {
      console.log("Opponent found");
      this.info.matchId = matchId;
      this.waiting = false;
      this.started = true;
    });

    window.addEventListener('keydown', (event) => {
      console.log ("Key pressed");
      if (!this.started) {
        console.log("Game not started");
        return ;
      }
      console.log("Game started");
      switch (event.keyCode) {
        case 38: // up arrow key
          this.info.d = -1;
          break;
        case 40: // down arrow key
          this.info.d = 1;
          break;
      }
      if (!this.socket) {
        console.log("Socket not connected");
        return ;
      }
      console.log("Sending move to socket " + this.socket.id)
      this.socket.emit("move", this.info)
    });
  },
  methods: {
    start() {
      this.started = true;
      this.gameOver = false;
      this.winner = "";
      if (this.practiceMode)
      {
        this.practiceSettings.difficulty = this.difficulty;
        this.practiceSettings.score = this.winningScore;
        this.socket.emit("start practice", this.practiceSettings);
        return ;
      }
      this.socket.emit("start");
    },
    reset() {
      this.started = false;
      this.gameOver = false;
      this.practiceMode = false;
      this.winner = "";
    },
    setPracticeMode() {
        this.practiceMode = true;
    },
    joinMatch() {
      console.log("Joining match...")
      this.waiting = true;
      this.socket.emit("joinMatchmaking");
    },
    leaveList() {
      this.waiting = false;
      this.socket.emit("leaveMatchmaking");
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