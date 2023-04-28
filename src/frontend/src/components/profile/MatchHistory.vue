<template>
    <div class="flex flex-col justify-center items-center mt-16">
        <div
            class="border-double border-4 text-buff relative border-buff rounded-md w-[50vw] min-w-[600px] pt-10 p-4"
        >
            <h1
                class="text-2xl font-bold text-white absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dark-purple rounded-md border-2 border-buff px-4 py-2"
            >
                Match History
            </h1>
          <div v-for="(match, index) in matchHistoryData" class="flex items-center justify-around">
            <div class="border border-buff rounded-md p-2 flex flex-col justify-center items-center w-1/4 ">
              <h2 class="font-bold text-2xl mb-2">Won</h2>
              <h3 class=" text-center break-all leading-4">
                {{match.player1}}<br>vs<br>{{ match.player2 }}
              </h3>
              <h3 class="font-semibold mt-2">
                {{ match.player1Score}} - {{ match.player2Score }}
              </h3>
            </div>
            <div class="border border-blush rounded-md p-2 text-blush flex flex-col justify-center items-center w-1/4">
              <h2 class="font-bold">Lost</h2>
              <h3 class="score text-center break-all">
                Alfred<br>vs<br>Stormmmmmmmmmmmmmmmmmmmmmmm
              </h3>
              <h3 class="score">
                0-10
              </h3>
            </div>
            <div class="border border-buff rounded-md p-2 flex flex-col justify-center items-center w-1/4">
              <h2 class="font-bold">Won</h2>
              <h3 class="score text-center break-all">
                Alfred<br>vs<br>Maia
              </h3>
              <h3 class="score">
                10-4
              </h3>
            </div>

          </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios'

interface User {
  id: number
  login: string
}

interface MatchHistoryData {
  id: number
  player1: User
  player2: User
  player1Score: number
  player2Score: number
}

export default {
  data() {
    return {
      matchHistoryData: [] as MatchHistoryData[],
    }
  },
  mounted()
  {
    axios.get('/api/matchHistory').then((response) => {
      this.matchHistoryData = Array.from(response.data)
    })
  },
  name: 'MatchHistory'
}
</script>

<style scoped>
</style>
