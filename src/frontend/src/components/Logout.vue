<template>
    <button
        class="mr-10 uppercase font-semibold tracking-wider text-blush hover:text-amaranth-purple px-3 py-2 drop-shadow-2xl"
        @click="destroySession()"
    >
        Log out
    </button>
</template>

<script lang="ts">
import axios from 'axios'
import {defineComponent} from "vue";
import {useUserStore} from "@/store/user.store";

export default defineComponent({
    setup() {
        const user = useUserStore()
        return { user }
    },
    name: 'Logout',
    methods: {
        destroySession() {
            axios.get('/api/auth/logout')
            this.user.socket.disconnect()
            this.$router.push('/')
        }
    }
})
</script>

<style scoped></style>
