<template>
  <div class="h-screen flex flex-col justify-center align-center">
    <qrcode-vue :value="value" :size="size" level="H" />
<!--    <img href=":value"/>-->
    <div class="mt-10 flex flex-col justify-center align-center">
      <div class="flex flex-col align-center justify-center">
        <label for="token">Please enter the code:</label>
        <input type="text" v-model="token" class="border rounded mt-3" name="token" id="token" />
        <p class="h-1 p-2 font-semibold text-blush">{{ error }}</p>
      </div>
      <button @click="verify" class="text-xl mt-5 p-2 uppercase font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl">verify</button>
    </div>

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
      size: 300,
      token: '',
      error: '',
    }
  },
  created() {
    axios.post('http://localhost:8080/api/2fa/generate').then((response) => {
      this.value = response.data.url
    })
  },
  methods: {
    verify() {
      axios
          .post('http://localhost:8080/api/2fa/verify', {
            token: this.token,
          })
          .then((response) => {
            if (response.data)
              this.$router.push('/Home');
            else
              this.error = "Wrong Token !"
          })

    }
  },
  components: {
    QrcodeVue
  }
}
</script>

<style scoped>

</style>