import { defineStore } from 'pinia'
import type {IChannels, IMessage, IProfile, IUser} from '@/types/types'
import { useUserStore } from '@/store/user.store'
import profile from "@/views/Profile.vue";

export const useChatStore = defineStore('userChannel', {
    state: () => ({
        channels: [] as IChannels[] | null,
        channelInView: 0 as number,
        dmId: -1 as number,
        dmName: '' as string,
        groupId: -1 as number,
        groupName: '' as string
    }),

    getters: {
        getChannelInView(state): IChannels | null {
            const channelIV = state.channels?.find((channel) => channel.id === state.channelInView)
            if (!channelIV) { return null }
            return channelIV
        },
        getCurrentMessages(): IMessage[] {
            const channelIV = this.getChannelInView
            if (channelIV == null) { return [] }
            return channelIV.messages
        },
        getCurrentUsers(): IUser[] | null {
            const chnl = this.getChannelInView
            if (chnl == null || chnl.profile == null) {
                return null
            }
            return chnl.users
        },
        getCurrentProfile(): IProfile | null {
            const chnl = this.getChannelInView
            if (chnl == null || chnl.profile == null) {
                return null
            }
            console.log('profile changed');
            const profile = chnl.profile;
            return profile
        },
        getGroupId(state): number {
            return state.groupId
        }
    },

    actions: {
        async loadChannels() {
            const user = useUserStore()
            const response = await fetch('http://localhost:8080/api/chat/' + user.id)
            console.log(response)
            this.channels = await response.json()
            if (this.channels == null) {
                return
            }
            console.log(this.channels)
            this.channels.forEach((channel) => {
                user.socket.emit('joinRoomById', { channelId: channel.id })
            })
        },
        receivedMessage(message: IMessage) {
            if (this.channels == null) {
                return
            }
            const channelIndex: number = this.channels.findIndex(
                (channel) => channel.id === message.channel
            )
            const channel: IChannels | undefined = this.channels[channelIndex]
            if (channel) {
                channel.messages.push(message)
            }
            this.channels.unshift(channel as IChannels)
            this.channels.splice(channelIndex + 1, 1)
        },
        async setChannelInView(channelId: number) {
            this.channelInView = channelId
        },
        async receivedNewChannel(channel: IChannels) {
            const user = useUserStore()
            this.channels?.push(channel)
            await this.setChannelInView(channel.id)
            user.socket.emit('joinRoomById', { channelId: channel.id })
        },
        async removeChannel(channelID: number) {
            const user = useUserStore()
            const index = this.channels?.findIndex((ch) => ch.id === channelID)
            if (index && index != -1) {
                this.channels?.splice(index, 1)
                user.socket.emit('leaveRoomById', { channelId: channelID })
            }
        },
        async addUserToChannel(channelId: number, user: IUser) {
            this.channels?.find((channel) => channel.id === channelId)?.users.push(user)
        },
        async removeUserFromChannel(channelId: number, user: IUser) {
            this.channels?.find((channel) => channel.id === channelId)?.users?.splice(this.channels?.find((channel) => channel.id === channelId)?.users?.findIndex((u) => u.id === user.id) as number, 1)
        },
        async addAdminToChannel(channelId: number, user: IUser) {
            this.channels?.find((channel) => channel.id === channelId)?.profile?.admin.push(user)
        },
        async removeAdminFromChannel(channelId: number, user: IUser) {
            this.channels
                ?.find((channel) => channel.id === channelId)
                ?.profile?.admin.splice(
                    this.channels
                        ?.find((channel) => channel.id === channelId)
                        ?.profile?.admin.findIndex((admin) => admin.id === user.id) as number,
                    1
                )
        },
        async addMutedToChannel(channelId: number, user: IUser) {
            this.channels?.find((channel) => channel.id === channelId)?.profile?.muted.push(user)
            console.log(this.channels?.find((channel) => channel.id === channelId)?.profile?.muted)
        },
        async removeMutedFromChannel(channelId: number, user: IUser) {
            this.channels
                ?.find((channel) => channel.id === channelId)
                ?.profile?.muted.splice(
                    this.channels
                        ?.find((channel) => channel.id === channelId)
                        ?.profile?.muted.findIndex((muted) => muted.id === user.id) as number,
                    1
                )
        },
        setGroupId(groupId: number) {
            this.groupId = groupId
        },
        setGroupName(groupName: string) {
            this.groupName = groupName
        },
        setDmId(dmId: number) {
            this.dmId = dmId
        },
        setDmName(dmName: string) {
            this.dmName = dmName
        },
        logOut() {
            this.channels = null
            this.channelInView = 0
            this.groupId = -1
            this.groupName = ''
            this.dmId = -1
            this.dmName = ''
        },
    }
})
