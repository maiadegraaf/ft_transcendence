<template>
  <div v-if="show2FAForm">
    <h2>Scan QR code</h2>
    <qrcode-stream @decode="onQRCodeScan" />
    <div v-if="secret">
      <h2>Enter 2FA code</h2>
      <otp-input :value="otp" :length="6" @input="onOTPInput" />
      <button @click="verifyOTP">Verify</button>
    </div>
  </div>
</template>

<script lang="ts">
import QrcodeStream from 'vue3-qrcode-reader'
import OtpInput from 'vue-otp-input'

export default {
  components: {
    QrcodeStream,
    OtpInput
  },
  data() {
    return {
      show2FAForm: true,
      secret: null,
      otp: ''
    }
  },
  methods: {
    async onQRCodeScan(data) {
      try {
        const response = await fetch('/auth/2fa/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data })
        })
        const { secret } = await response.json()
        this.secret = secret
      } catch (err) {
        console.error(err)
      }
    },
    onOTPInput(value) {
      this.otp = value
    },
    async verifyOTP() {
      try {
        const response = await fetch('/auth/2fa/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ otp: this.otp })
        })
        if (response.ok) {
          // redirect to dashboard
        } else {
          console.log('Invalid OTP')
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>
