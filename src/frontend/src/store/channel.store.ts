import { defineStore } from 'pinia'
import type {IChannels, IMessage, IProfile, IUser} from '@/types/types'
import { useUserStore } from '@/store/user.store'

export const useChatStore = defineStore('userChannel', {
    state: () => ({
        channels: [] as IChannels[] | null,
        channelInView: -1 as number,
        dmId: -1 as number,
        dmName: '' as string,
        newGroupName: '' as string,
        newGroupId: -1 as number,
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
            const channelIV = this.getChannelInView
            if (channelIV == null || channelIV.profile == null) {
                return null
            }
            return channelIV.users
        },
        getCurrentGroupId(): number {
            const channelIV = this.getChannelInView
            return channelIV?.profile?.id ?? this.newGroupId
        },
        getCurrentProfile(): IProfile | null {
            const channelIV = this.getChannelInView
            if (channelIV == null || channelIV.profile == null) {
                return null
            }
            console.log('profile changed');
            const profile = channelIV.profile;
            return profile
        },
    },

    actions: {
        //Load channels from server
        async loadChannels() {
            const response = await fetch('http://localhost:8080/api/chat/')
            this.channels = await response.json()
            if (this.channels == null) {
                return
            }
            this.channels.forEach((channel) => {
                this.setChannelName(channel)
            })
        },

        setChannelName(channel: IChannels) {
            const userStore = useUserStore()
            if (channel == null) { return '' }
            if (channel.profile == null) {
                if (channel.users[0].id == userStore.id) {
                    channel.name =  channel.users[1].login
                } else {
                    channel.name =  channel.users[0].login
                }
            } else {
                channel.name = channel.profile.name
            }
        },

        setDmId(dmId: number) {
            this.dmId = dmId
        },

        setDmName(dmName: string) {
            this.dmName = dmName
        },

        setNewGroupName(newGroupName: string) {
            this.newGroupName = newGroupName
        },

        setNewGroupId(newGroupId: number) {
            this.newGroupId = newGroupId
        },

        async setChannelInView(channelId: number) {
            this.channelInView = channelId
        },

        //All socket events
        async receivedMessage(message: IMessage) {
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

        async receivedNewChannel(channel: IChannels) {
            const user = useUserStore()
            this.setChannelName(channel)
            this.channels?.unshift(channel)
        },

        async removeChannel(channelID: number) {
            const user = useUserStore()
            const index = this.channels?.findIndex((ch) => ch.id === channelID)
            if (index !== undefined && index >= 0) {
                this.channels?.splice(index, 1)
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

        //Logout
        logOut() {
            this.channels = []
            this.channelInView = 0
        }
    }
})
