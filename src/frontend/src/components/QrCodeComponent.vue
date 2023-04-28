<template>
    <div class="h-screen flex flex-col justify-center items-center">
        <div v-if="value" class="flex flex-col justify-center items-center">
            <h1 class="text-4xl font-semibold text-center">Scan the QR code to enable 2FA</h1>
            <h2 class="text-2xl font-semibold text-center">Please use Google Authenticator</h2>
            <h3 class="font-bold text-blush text-center pb-6">
                You will have one chance to save this qrcode!
            </h3>
            <qrcode-vue class="text-center" :value="value" :size="size" level="H" />
        </div>
        <div v-if="!value" class="flex flex-col justify-center items-center">
            <h1 class="text-4xl font-semibold text-center">
                Enter your 2fa token to enter the website:
            </h1>
        </div>
        <div class="mt-10 flex flex-col justify-center items-center">
            <div class="flex flex-col items-center justify-center">
                <label for="token">Enter token:</label>
                <input
                    type="text"
                    v-model="token"
                    class="border rounded mt-3"
                    name="token"
                    id="token"
                />
                <p class="h-1 p-2 font-semibold text-blush">{{ error }}</p>
            </div>
            <button
                @click="verify"
                class="text-xl mt-5 p-2 uppercase font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl"
            >
                verify
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios'
import QrcodeVue from 'qrcode.vue'

export default {
    name: 'qrCodeComponent',
    data() {
        return {
            value: '',
            size: 300,
            token: '',
            error: ''
        }
    },
    created() {
        axios.get('/api/auth/profile').then((response) => {
            if (response.data.isTwoFactorAuthenticationEnabled == false) {
                axios.post('/api/2fa/generate').then((response) => {
                    this.value = response.data.url
                })
            }
        })
    },
    methods: {
        verify() {
            axios
                .post('/api/2fa/verify', {
                    token: this.token
                })
                .then((response) => {
                    if (response.data) this.$router.push('/ChooseUsername')
                    else this.error = 'Wrong Token !'
                })
        }
    },
    components: {
        QrcodeVue
    }
}
</script>

<style scoped></style>
