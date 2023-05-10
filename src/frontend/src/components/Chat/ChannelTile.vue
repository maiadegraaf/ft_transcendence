<template>
    <div class="h-20 px-2 py-3 flex" :class="{ 'bg-amaranth-purple': isActive }">
        <div class="flex w-full" @click="toView(ch.id)">
            <div class="h-full">
                <img class="rounded-full w-16" :src="`api/user/${avatarId}/avatar`" alt="avatar" />
            </div>
            <div class="flex flex-col w-full pl-3">
                <div class="font-bold">{{ ch.name }} | {{ ch.id }}</div>
                <div class="text-xs">{{ lastMessage }}</div>
            </div>
        </div>
        <div v-if="ch.profile">
            <button
                @click="groupSettings(ch.id, ch.profile.id, ch.profile.name)"
                class="rounded-full hover:shadow-md"
            >
                <Cog6ToothIcon class="h-6 w-6 text-buff" />
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MessageList from '@/components/Chat/MessageList.vue'
import GroupSettings from '@/components/Chat/GroupSettings.vue'
import { useChatStore } from '@/store/channel.store'
import { Cog6ToothIcon } from '@heroicons/vue/24/outline'
import { useUserStore } from '@/store/user.store'
import type { IUser } from '@/types/types'

export default defineComponent({
    name: 'ChannelTile',
    props: ['ch'],
    components: {
        Cog6ToothIcon
    },
    setup() {
        const chatStore = useChatStore()
        const userId = useUserStore().id
        return { chatStore, userId }
    },
    data() {
        return {
            avatarId: 0 as number
        }
    },
    mounted() {
        this.ch.users.forEach((user: IUser) => {
            if (user.id !== this.userId) {
                this.avatarId = user.id
            }
        })
    },
    computed: {
        lastMessage(): string {
            if (this.ch.messages.length > 0) {
                return this.ch.messages[this.ch.messages.length - 1].text
            }
            return 'No messages'
        },
        isActive(): boolean {
            return this.chatStore.channelInView === this.ch.id
        }
    },
    methods: {
        toView(id: number): void {
            this.chatStore.setChannelInView(id)
            this.$emit('switch-chat-right-component', MessageList)
        },
        groupSettings(channelId: number, groupId: number, groupName: string): void {
            this.chatStore.setChannelInView(channelId)
            this.chatStore.setGroupId(groupId)
            this.chatStore.setGroupName(groupName)
            this.$emit('switch-chat-right-component', GroupSettings)
        }
    }
})
</script>

<style scoped></style>
