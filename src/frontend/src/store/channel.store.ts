import { defineStore } from 'pinia'
import type {IChannels, IMessage, IUser} from "@/types/types";
import {useUserStore} from "@/store/user.store";



export const useChatStore = defineStore('userChannel', {
    state: () => ({
        invite: '' as string,
        channels: [] as IChannels[] | null,
        channelInView: 0 as number,
        joined: false as boolean,
        groupId: -1 as number,
        groupName: '' as string,
    }),

    getters: {
        getChannelInView(state): IMessage[] {
            //console.log('getChannelInView')
            if (state.channels == null) {
                return []
            }
            const channelIV = state.channels.find(channel => channel.id === state.channelInView)
            if (channelIV == null) {
                return []
            }
            //console.log(channelIV.messages)
            return channelIV.messages
        },
        getProfileByChannelId: (state) => (channelId: number) => {
            if (state.channels == null) {
                return null
            }
            const chnl = state.channels.find(channel => channel.id === channelId)
            if (chnl == null || chnl.profile == null) {
                return null
            }
            return chnl.profile
        },
        getChannelProfileByChannelId: (state) => (channelId: number) => {
            if (state.channels == null) {
                return null
            }
            const chnl = state.channels.find(channel => channel.id === channelId)
            if (chnl == null || chnl.profile == null) {
                return null
            }
            return chnl.profile
        },
        getChannelUsersByChannelId: (state) => (channelId: number) => {
            if (state.channels == null) {
                return null
            }
            const chnl = state.channels.find(channel => channel.id === channelId)
            if (chnl == null || chnl.profile == null) {
                return null
            }
            return chnl.users
        },
        getRole: (state) => (user: IUser) => {
            // werkt voor geen meter godverdomme
            let str = ''
            if (state.channels == null) {
                return str
            }
            const chnl = state.channels.find(channel => channel.id === state.channelInView)
            if (chnl == null || chnl.profile == null) {
                return str
            }
            const profile = chnl.profile
            if (profile) {
                if (profile.owner.id === user.id) {
                    str += ' | (Owner)'
                }
                if (profile.admin.find((adm) => adm.id === user.id)) {
                    str +=  ' | (Admin)'
                }
                if (profile.muted.find((mtd) => mtd.id === user.id)) {
                    str +=  ' | (Muted)';
                }
            }
            return str
        },
        getGroupId(state): number {
            return state.groupId
        },
    },

    actions: {
        async loadChannels() {
            const user = useUserStore()
            const response = await fetch('http://localhost:8080/api/chat/' + user.id)
            this.channels = await response.json()
            if (this.channels == null) { return }
            this.channels.forEach(channel => {
                user.socket.emit('joinRoomById', {channelId: channel.id})
            })
        },
        receivedMessage(message: IMessage) {
            if (this.channels == null) { return }
            const channelIndex: number = this.channels.findIndex(channel => channel.id === message.channel)
            const channel: IChannels | undefined = this.channels[channelIndex]
            if (channel) { channel.messages.push(message);}
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
            user.socket.emit('joinRoomById', {channelId: channel.id})
        },
        async removeChannel(channelID: number) {
            const user = useUserStore()
            const index = this.channels?.findIndex((ch) => ch.id === channelID)
            if (index as number >= 0) {
                this.channels?.splice(index as number, 1);
                user.socket.emit('leaveRoomById', {channelId: channelID})
            }
            else {
                console.log('Channel not found: ' + index)
            }
        },
        async addAdminToChannel(channelId: number, user: IUser) {
            this.channels?.find(channel => channel.id === channelId)?.profile?.admin.push(user)
        },
        async removeAdminFromChannel(channelId: number, user: IUser) {
            this.channels?.find(channel => channel.id === channelId)?.profile?.admin.splice(
                this.channels?.find(channel => channel.id === channelId)?.profile?.admin.findIndex(
                    admin => admin.id === user.id
                ) as number, 1
            )
        },
        async addMutedToChannel(channelId: number, user: IUser) {
            this.channels?.find(channel => channel.id === channelId)?.profile?.muted.push(user)
        },
        async removeMutedFromChannel(channelId: number, user: IUser) {
            this.channels?.find(channel => channel.id === channelId)?.profile?.muted.splice(
                this.channels?.find(channel => channel.id === channelId)?.profile?.muted.findIndex(
                    muted => muted.id === user.id
                ) as number, 1
            )
        },
        setGroupId(groupId: number) {
            this.groupId = groupId
        },
        setGroupName(groupName: string) {
            this.groupName = groupName
        },
        logOut() {
            this.invite = ''
            this.channels = null
            this.channelInView = 0
            this.joined = false
            this.groupId = -1
            this.groupName = ''
        }
    }
})
