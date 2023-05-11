<template>
    <div class="text-buff flex h-16 justify-between items-center mb-4">
        <div class="flex items-center">
            <img
                :src="`/api/user/${user.id}/avatar`"
                alt="Avatar"
                class="w-12 h-12 rounded-full object-cover mx-3"
            />
            <h3 class="text-xl font-semibold">Chats</h3>
        </div>
        <button class="hover:opacity-60 transition-opacity" @click="newChannel">
            <PlusIcon class="h-8 w-8 mr-3 text-buff" />
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useUserStore } from '@/store/user.store'
import { PlusIcon } from '@heroicons/vue/24/outline'
import NewChannel from '@/components/Chat/NewChannel.vue'

export default defineComponent({
    name: 'ChannelHeader',
    components: {
        PlusIcon
    },
    setup() {
        const user = useUserStore()
        return { user }
    },
    methods: {
        newChannel(): void {
            this.$emit('switch-chat-right-component', NewChannel)
        }
    }
})
</script>

<style scoped></style>
