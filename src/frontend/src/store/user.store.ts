import {defineStore} from "pinia";
import axios from "axios";
import {io} from "socket.io-client";
import {useChatStore} from "@/store/channel.store";
import type {IChannels, IMessage} from "@/types/types";

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
                console.log("Message recieved!")
                chatStore.receivedMessage(message)
            })
            this.socket.on('addChannelToClient', (channel: IChannels) => {
                console.log("Channel recieved!")
                chatStore.receivedNewChannel(channel)
            })
            this.socket.on('removeChannelFromClient', (channelId: number) => {
                console.log("Channel removed request!")
                chatStore.removeChannel(channelId)
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