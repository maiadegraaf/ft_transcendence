import {defineStore} from "pinia";
import axios from "axios";
import {io} from "socket.io-client";
import {useChatStore} from "@/store/channel.store";
import type {IChannels, IMessage, IUser} from "@/types/types";

export const useUserStore = defineStore('user', {
    state: () => ({
        name: '' as string,
        email: '' as string,
        id: 0 as number,
        socket: null as any | null,
    }),

    actions: {
        async loadUser() {
            await axios.get('http://localhost:8080/api/auth/profile').then((response) => {
                console.log(response.data)
                this.name = response.data.login
                this.email = response.data.email
                this.id = response.data.id
            })
            const socket = await io('http://localhost:8080')
            this.socket = socket
            await useChatStore().loadChannels()
            await this.listen()
            },
        async listen() {
            const chatStore = useChatStore()
            this.socket.on('msgToClient', (message: IMessage) => {
                console.log("Message received!")
                chatStore.receivedMessage(message)
            })
            this.socket.on('addChannelToClient', (channel: IChannels) => {
                console.log("Channel received!")
                chatStore.receivedNewChannel(channel)
            })
            this.socket.on('removeChannelFromClient', (channelId: number) => {
                console.log("Channel removed request!")
                chatStore.removeChannel(channelId)
            })
            this.socket.on('addAdminToChannel', (channelId: number, user: IUser) => {
                chatStore.addAdminToChannel(channelId, user)
                console.log("Admin added to channel!")
            })
            this.socket.on('removeAdminFromChannel', (channelId: number, user: IUser) => {
                chatStore.removeAdminFromChannel(channelId, user)
                console.log("Admin removed from channel!")
                console.log(chatStore.channels)
            })
            this.socket.on('addMutedToChannel', (channelId: number, user: IUser) => {
                chatStore.addMutedToChannel(channelId, user)
                console.log("Muted added to channel!")
                console.log(chatStore.channels)
            })
            this.socket.on('removeMutedFromChannel', (channelId: number, user: IUser) => {
                chatStore.removeMutedFromChannel(channelId, user)
                console.log(chatStore.channels)
                console.log("Muted removed from channel!")
            })
        },

        logOut() {
            this.socket = null
            this.name = ''
            this.email = ''
            this.id = 0
        }
    }
})