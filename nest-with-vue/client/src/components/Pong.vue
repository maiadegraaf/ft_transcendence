<template>
  <div class="pongGame">
    <div class="player player1" :style="{top: player1.y + 'px'}"></div>
    <div class="player player2" :style="{top: player2.y + 'px'}"></div>
    <div class="ball" :style="{left: ball.y + 'px', top: ball.x + 'px'}"></div>
    <div class="score">
      <span>{{ player1.score }}</span>
      <span>{{ player2.score }}</span>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
export default {
    name: 'pongGame',
    data() {
      return {
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
        socket: {},
      }
    },
    mounted() {
        //connect to the servers websocket
        this.socket = io("http://localhost:3000");

        //listen for the state updates from the server
        this.socket.on("state", (state) => {
          this.ball = state.ball;
          this.player1 = state.player1;
          this.player2 = state.player2;
        });

        window.addEventListener('keydown', (event) => {
          switch (event.keyCode) {
            case 38: // up arrow key
              this.socket.emit("move", -1);
              break;
            case 40: // down arrow key
              this.socket.emit("move", 1);
              break;
          }
        });
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pongGame {
  position: relative;
  width: 800px;
  height: 600px;
  background-color: #000;
  margin: 0 auto;
  border: 1px solid #fff;
}
.player {
  position: absolute;
  width: 20px;
  height: 100px;
  background-color: #fff;
}

.player1 {
  left: 20px;
}

.player2 {
  right: 20px;
}

.ball {
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: #fff;
  border-radius: 50%;
}

.score {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2em;
  color: #fff;
}

.score span {
  display: inline-block;
  width: 50px;
  text-align: center;
}
</style>
