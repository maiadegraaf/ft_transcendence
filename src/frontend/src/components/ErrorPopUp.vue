<template>
    <transition name="ErrorPopUp">
        <div v-if="showPopup" class="fixed inset-0 flex items-center justify-center">
            <div class="fixed inset-0 bg-dark-purple opacity-50"></div>
            <div
                class="relative w-1/3 bg-blush rounded-lg border-4 border-amaranth-purple border-solid shadow-lg text-white flex flex-col items-center justify-center p-8"
                style="z-index: 9999"
            >
                <div
                    class="absolute top-0 -mt-16 left-1/2 transform -translate-x-1/2 flex items-center justify-center rounded-full bg-amaranth-purple w-33px aspect-square"
                >
                    <img
                        src="../assets/images/sad-face-error.png"
                        alt="Sad Face Error"
                        class="w-3/4 h-3/4"
                    />
                </div>
                <h1 class="text-4xl font-bold mb-4 mt-12 text-uppercase">error</h1>
                <h3 class="text-2xl font-bold mb-8 text-center">{{ message }}</h3>
                <button @click="hidePopup" class="btn--error">OK</button>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
export default {
    data() {
        return {
            showPopup: false,
            message: ''
        }
    },
    methods: {
        show(message: any) {
            this.message = message
            this.showPopup = true
        },
        hidePopup() {
            this.showPopup = false
        }
    }
}
</script>
