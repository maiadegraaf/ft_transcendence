<template>
    <div v-if="ch.profile" class="h-20 px-2 py-3 flex" :class="{ 'bg-amaranth-purple': isActive }">
        <div class="flex w-full" @click="toView(ch.id, null, ch.name)">
          <UserGroupIcon class="h-14 w-14 text-buff object-cover aspect-square" />
          <div class="flex flex-col pl-3 truncate">
            <div class="font-bold truncate">{{ ch.name }}</div>
            <div class="text-xs truncate">{{ lastMessage }}</div>
          </div>
        </div>
        <div>
            <button @click="groupSettings(ch.id)" class="rounded-full hover:shadow-md">
                <Cog6ToothIcon class="h-6 w-6 text-buff" />
            </button>
        </div>
    </div>
    <div v-else class="h-20 px-2 py-3 flex" :class="{ 'bg-amaranth-purple': isActive }">
        <div class="flex w-full" @click="toView(ch.id, ch.users, ch.name)">
            <img
                class="rounded-full w-14 object-cover aspect-square"
                :src="`api/user/${avatarId}/avatar`"
                alt="avatar"
            />
            <div class="flex flex-col pl-3 truncate">
                <div class="font-bold truncate">{{ ch.name }}</div>
                <div class="text-xs truncate">{{ lastMessage }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MessageList from '@/components/Chat/Message_panel/MessageList.vue'
import GroupSettings from '@/components/Chat/Group_panel/GroupSettings.vue'
import { useChatStore } from '@/store/channel.store'
import { Cog6ToothIcon } from '@heroicons/vue/24/outline'
import { useUserStore } from '@/store/user.store'
import type { IUser } from '@/types/types'
import { UserGroupIcon } from '@heroicons/vue/20/solid'

export default defineComponent({
    name: 'ChannelTile',
    props: ['ch'],
    components: {
        Cog6ToothIcon,
        UserGroupIcon
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
        if (this.ch.profile == null){
            this.ch.users.forEach((user: IUser) => {
                if (user.id !== this.userId) {
                    this.avatarId = user.id
                }
            })
        }
    },
    computed: {
        lastMessage(): string {
            if (this.ch.messages?.length > 0) {
                return this.ch.messages[this.ch.messages.length - 1].text
            }
            return 'No messages'
        },
        isActive(): boolean {
            return this.chatStore.channelInView === this.ch.id
        }
    },
    methods: {
        toView(id: number, users: any, dmName: string): void {
            if (users)
                for (const user of users) {
                    if (user.login == dmName) {
                        this.chatStore.setDmId(user.id)
                    }
                }
            else this.chatStore.setDmId(-1)
            this.chatStore.setDmName(dmName)
            this.chatStore.setChannelInView(id)
            this.$emit('switch-chat-right-component', MessageList)
        },
        groupSettings(channelId: number): void {
            this.chatStore.setChannelInView(channelId)
            this.$emit('switch-chat-right-component', GroupSettings)
        }
    }
})
</script>

<style scoped></style>
