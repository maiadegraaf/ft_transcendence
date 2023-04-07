<template>
  <div class="h-screen flex flex-col justify-center align-center">
    <qrcode-vue :value="value" :size="size" level="H" />
    <form class="mt-10 flex flex-col justify-center align-center" method="POST">
      <div class="flex flex-col align-center justify-center">
        <label for="token">Please enter the code:</label>
        <input class="border rounded mt-3" type="text" name="token" id="token" />
      </div>
      <button @click="verify" class="text-xl  mt-5 p-2 uppercase font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl" @click="verify">verify</button>
    </form>

  </div>
</template>

<script lang="ts">
import axios from "axios";
import QrcodeVue from "qrcode.vue";

export default {
  name: 'qrCodeComponent',
  data() {
    return {
      value: String,
      size: 300
    }
  },
  mounted() {
    axios.post('http://localhost:8080/api/2fa/generate').then((response) => {
      console.log(response.data.url)
      this.value = response.data.url
    })
  },
  methods: {
    verify() {
      axios
          .post('http://localhost:8080/api/2fa/verify', {
            token: '325488'
          })
          .then((response) => {
            console.log(response)
          })
      this.push('/Home');
    }
  },
  components: {
    QrcodeVue
  }
}
</script>

<style scoped>

</style>