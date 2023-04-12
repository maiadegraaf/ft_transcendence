<template>
  <div
      v-if="!started || startedBy !== currentPlayerId"
      class="mx-auto flex flex-col items-center justify-center w-10/12 aspect-video bg-dark-purple-800"
  >
    <img class="m-8 w-[450px]" src="../assets/images/PONG.gif" alt="PONG" />
    <div class="flex flex-col items-center">
      <label for="winningScore" class="mb-4 flex items-center">
        <span class="mr-2 text-2xl font-bold text-buff">Winning Score:</span>
        <input
            value="10"
            type="number"
            id="winningScore"
            v-model.number="winningScore"
            min="1"
            class="w-16 px-2 py-1 text-2xl font-bold rounded-lg border border-solid border-amaranth-purple bg-buff text-amaranth-purple focus:text-buff focus:bg-amaranth-purple focus:outline-none focus:border-amaranth-purple"
        />
      </label>
      <label for="difficulty" class="mb-4 flex items-center">
        <span class="mr-2 text-2xl font-bold text-buff">Difficulty:</span>
        <select
            id="difficulty"
            v-model="difficulty"
            class="w-32 px-4 py-2 text-2xl font-bold text-amaranth-purple focus:text-buff rounded-lg border border-amaranth-purple border-solid focus:outline-none bg-buff focus:outline-none focus:bg-amaranth-purple focus:outline-none focus:border-amaranth-purple"
        >
          <option value="easy">Easy</option>
          <option value="normal">Normal</option>
          <option value="hard">Hard</option>
          <option value="impossible">Impossible</option>
        </select>
      </label>
      <button @click="start" class="btn">Start Game</button>
    </div>
  </div>
  <div v-else class="mx-auto w-[800px]">
    <div
        class="relative w-full aspect-video border-double border-4 border-buff bg-dark-purple"
        ref="pongGame"
    >
      <div class="absolute left-5 w-5 h-24 bg-white" :style="{ top: player1.y + 'px' }"></div>
      <div
          class="absolute right-5 w-5 h-24 bg-white"
          :style="{ top: player2.y + 'px' }"
      ></div>
      <div
          class="absolute w-5 h-5 bg-white rounded-full"
          :style="{ top: ball.y + 'px', left: ball.x + 'px' }"
      ></div>
      <div
          class="absolute top-2 left-1/2 transform -translate-x-1/2 text-white text-3xl font-bold p-3"
      >
        <span class="p-4">{{ player1.score }}</span>
        <span class="p-4">{{ player2.score }}</span>
      </div>
      <div class="absolute inset-y-0 left-1/2 border-l border-dashed border-buff"></div>
      <div
          v-if="gameOver"
          class="absolute top-0 left-0 w-full h-full bg-dark-purple text-white flex flex-col items-center justify-center"
      >
        <h1 class="text-5xl text-buff font-bold text-shadow-lg mb-8">Game Over</h1>
        <h3 class="text-3xl text-buff font-bold text-shadow-lg mb-8">{{ winner }}</h3>
        <button @click="reset" class="btn">Play Again</button>
      </div>
    </div>
    <div class="mx-auto flex w-2/3 m-2 items-center">
      <div class="flex-auto w-1/3">
        <img
            src="../assets/images/up-down_keys.png"
            alt="Use the up and down keys to control the paddle"
            class="mx-auto my-4"
        />
      </div>
      <div class="text-center">
        <p class="mx-auto w-full text-white text-lg">
          Use the up and down keys to control the paddle
        </p>
      </div>
    </div>
  </div>
  <div>
    <ErrorPopUp ref="errorPopUp" />
  </div>
</template>

<script lang="ts">
import io from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import { VueCookieNext } from 'vue-cookie-next'
import ErrorPopUp from './ErrorPopUp.vue'
import PracticeMatch from '@/components/PracticeMatch.vue'

export default {
    name: 'practiceMatch',
    data(): any {
      return {
      started: false,
      startedBy: '',
      gameOver: false,
      winner: '',
      gamestate: '',
      winningScore: 10,
      difficulty: 'easy',
      multipleConnectionsError: false,
      currentPlayerId: '',
      ball: {
        x: 400,
        y: 300
      },
      player1: {
        y: 250,
        score: 0
      },
      player2: {
        y: 250,
        score: 0
      },
      practiceSettings: {
        score: 10,
        difficulty: 'easy',
        userId: ''
      },
      info: {
        practiceMatchId: '',
        matchId: '',
        d: 0
      }
    }
  },
  components: {
    ErrorPopUp,
  },
  mounted() {
    //from session storage
    const userId = sessionStorage.getItem('user')
    console.log('Session Storage User: ' + userId)
    if (userId === null) {
      this.$router.push('/')
    } else {
      this.currentPlayerId = JSON.parse(userId).user.id
      console.log('Current player id: ' + this.currentPlayerId)
      // console.log('Current player id: ' + this.currentPlayerId)
      this.socket = io('http://localhost:8080', {
        query: {
          userId: this.currentPlayerId
        }
      })
    }

    // from cookies
    // this.socket = io("http://localhost:8080");
    // const userCookie = VueCookieNext.getCookie('user')
    // console.log('userCookie: ' + userCookie)
    // if (userCookie === null) {
    //     this.$router.push('/')
    // } else {
    //     // const user = JSON.parse(userCookie)
    //     this.currentPlayerId = userCookie.user.id
    //     console.log('Current player id: ' + this.currentPlayerId)
    //     this.socket = io('http://localhost:8080', {
    //         query: {
    //             userId: this.currentPlayerId
    //         }
    //     })
    // }

    //listen for the state updates from the server
    this.socket.on(
        'PracticeState',
        (state: { ball: any; player1: any; player2: any; gamestate: any; winner: any }) => {
          this.ball = state.ball
          this.player1 = state.player1
          this.player2 = state.player2
          this.gamestate = state.gamestate
          this.winner = state.winner
          if (this.gamestate === 'playing') {
            this.started = true
          }
        }
    )

    this.socket.on('practiceMatchCreated', (practiceMatchId: number, socketId: string) => {
      // console.log("Practice match created by socket " + socketId);
      // if (socketId !== this.socket.id) {
      //   console.log("Practice match created by other socket");
      //   this.started = false;
      //   return ;
      // }
      console.log('Practice match created')
      this.started = true
      this.info.practiceMatchId = practiceMatchId
    })

    this.socket.on('matchmakingCanceled', () => {
      console.log('Matchmaking canceled')
      this.$refs.errorPopUp.showErrorPopup(
          'You cannot join a match in multiple tabs or windows.'
      )
      this.waiting = false
    })

    window.addEventListener('keydown', (event) => {
      console.log('Key pressed')
      if (!this.started) {
        console.log('Game not started')
        return
      }
      console.log('Game started')
      switch (event.keyCode) {
        case 38: // up arrow key
          this.info.d = -1
          break
        case 40: // down arrow key
          this.info.d = 1
          break
      }
      if (!this.socket) {
        console.log('Socket not connected')
        return
      }
      console.log('Sending move to socket ' + this.socket.id)
      this.socket.emit('move', this.info)
    })
  },
  methods: {
    start() {
      // this.currentPlayerId = sessionStorage.getItem("session_user_id");
      this.startedBy = this.currentPlayerId
      console.log('Starting game by ' + this.startedBy)
      this.gameOver = false
      this.winner = ''
      this.practiceSettings.difficulty = this.difficulty
      this.practiceSettings.score = this.winningScore
      this.practiceSettings.userId = this.currentPlayerId
      this.socket.emit('start practice', this.practiceSettings)
      return
    },
    reset() {
      this.started = false
      this.gameOver = false
      this.practiceMode = false
      this.winner = ''
    },
    setPracticeMode() {
      this.practiceMode = true
    },
    joinMatch() {
      console.log('Joining match...')
      this.waiting = true
      console.log('Current player id: ' + this.currentPlayerId)
      this.socket.emit('joinMatchmaking', this.currentPlayerId)
    },
    leaveList() {
      this.waiting = false
      this.socket.emit('leaveMatchmaking')
    }
  },
  watch: {
    gamestate() {
      if (this.gamestate === 'end') {
        this.gameOver = true
      }
    }
  }
}
</script>
