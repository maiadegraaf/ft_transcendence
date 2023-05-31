<template>
    <div class="flex flex-col justify-center items-center mt-16">
        <div
            class="border-double border-4 text-buff relative border-buff rounded-md w-[50vw] min-w-[600px] pt-10 p-4 bg-dark-purple bg-opacity-60"
        >
          <SearchBlocked/>
          <h1
                class="text-2xl font-bold text-white absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dark-purple rounded-md border-2 border-buff px-4 py-2"
            >
                Blocked User(s)
            </h1>
            <ListBlocked :is-profile-session="isProfileSession" :friend-list="user.getBlocked" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ListBlocked from './ListBlocked.vue'
import { useUserStore } from '@/store/user.store'
import SearchBlocked from "@/components/profile/Blocked/SearchBlocked.vue";

export default defineComponent({
    name: 'BlockedContainer',
    setup() {
        const user = useUserStore()
        return { user }
    },
    props: {
        isProfileSession: {
            type: Boolean,
            required: true
        }
    },
    components: {
        SearchBlocked,
        ListBlocked
    },
})
</script>

<style scoped>
</style>
