<template>
    <div class="h-screen flex justify-center items-center flex-col">
        <h3 class="text-center text-l text-white font-semibold">
            If you activate the Two Factor Authentication there is NO COMING BACK!!!<br />|<br />v
        </h3>
        <button
            @click="redirectCreate()"
            class="text-center text-3xl mt-4 p-2 uppercase border-blush font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl"
        >
            Activate Two Factor Authentication
        </button>
        <button
            @click="redirectHome()"
            class="text-center text-3xl mt-14 p-2 border rounded-md uppercase border-blush font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl"
        >
            Not Now
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'TwoFA',
    created() {},
    methods: {
        redirectHome() {
            this.$router.push('/ChooseUsername')
        },
        redirectCreate() {
            this.$router.push('/2fa/create')
        }
    }
})
</script>
