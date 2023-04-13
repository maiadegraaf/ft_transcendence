<template>
    <div class="h-screen flex justify-center align-center flex-column">
        <button
            @click="redirectCreate()"
            class="text-center text-3xl mt-14 p-2 border rounded-md uppercase border-blush font-semibold hover:border-amaranth-purple hover:text-amaranth-purple tracking-wider text-blush drop-shadow-2xl"
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
export default {
    name: 'TwoFA',
    created() {

    },
    methods: {
        redirectHome() {
            this.$router.push('/Home')
        },
        redirectCreate() {
          this.$router.push('/2fa/create')
        }
    }
}
</script>
