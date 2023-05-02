<script lang="ts">
import Nav from '../components/Nav.vue'
import {useUserStore} from "@/store/user.store";
import {defineComponent} from "vue";

export default defineComponent({
  components: {
    Nav
  },
  setup() {
      const user = useUserStore()
      return { user }
    }
})
</script>

<template>
    <div>
        <Nav />
        <main>
            <div v-if="user" class="mt-10 flex flex-col justify-center items-center">
                <h1 class="text-buff text-5xl font-semibold">Welcome, {{ user.login }}</h1>
                <h2 class="text-buff text-xl opacity-70 font-semibold">Ready to play pong ?</h2>
                <p class="mt-10 text-buff container mx-auto">
                    Pong is a classic arcade video game that was first released in 1972 by Atari.
                    The game is played on a two-dimensional table with a simple black and white
                    graphical interface. The objective of the game is to score points by hitting a
                    ball back and forth between two paddles, with the aim of getting the ball past
                    the opponent's paddle.<br /><br />

                    The gameplay of Pong is simple yet addictive. The ball moves at a constant
                    speed, bouncing off the walls and the paddles. The player controls one of the
                    paddles, which moves up and down vertically on one side of the screen. The
                    opponent's paddle is controlled by the computer or another player.<br /><br />

                    To score a point, the player must hit the ball past the opponent's paddle. The
                    game continues until one player reaches a predetermined number of points or
                    until the player decides to end the game. As the game progresses, the ball's
                    speed increases, making it more challenging to hit.<br /><br />

                    Pong has been credited with launching the video game industry and remains a
                    classic and iconic game to this day. Its simplicity, addictiveness, and
                    competitive nature have made it a popular choice for arcade enthusiasts and
                    gamers alike. The game has been remade and reimagined in various forms and
                    platforms, from handheld devices to modern gaming consoles, but the basic
                    gameplay remains the same.<br /><br />

                    Overall, Pong is a timeless classic that continues to capture the hearts and
                    minds of gamers around the world. Its legacy as a pioneer in the video game
                    industry will forever be remembered, and its impact on the medium will continue
                    to inspire future generations of game developers and enthusiasts.
                </p>
            </div>
        </main>
    </div>
</template>

<style scoped></style>
