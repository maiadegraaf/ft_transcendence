import { defineStore } from 'pinia'
import axios from 'axios'
import { io } from 'socket.io-client'
import { useChatStore } from '@/store/channel.store'
import type { IChannels, IMessage, IUser } from '@/types/types'

export const useUserStore = defineStore('user', {
    state: () => ({
        name: '' as string,
        email: '' as string,
        id: 0 as number,
        socket: null as any | null
    }),

    actions: {
        //Load user data from server
        async loadUser() {
            await axios.get('http://localhost:8080/api/auth/profile').then((response) => {
                this.name = response.data.login
                this.email = response.data.email
                this.id = response.data.id
            })
            const socket = await io('http://localhost:8080')
            this.socket = socket
            this.socket.emit('bind', this.id)
            await useChatStore().loadChannels()
            this.socket.emit('joinRooms')
            await this.listen()
        },

        //Listeners for server-sent socket events
        async listen() {
            const chatStore = useChatStore()
            this.socket.on('msgToClient', (message: IMessage) => {
                console.log('Message received!')
                chatStore.receivedMessage(message)
            })
            this.socket.on('addChannelToClient', (channel: IChannels) => {
                console.log('Channel received!')
                console.log(channel)
                chatStore.receivedNewChannel(channel)
            })
            this.socket.on('removeChannelFromClient', (channelId: number) => {
                console.log('Channel removed request! for channel: ' + channelId)
                chatStore.removeChannel(channelId)
            })
            this.socket.on('addUserToChannel', (payload: any) => {
                chatStore.addUserToChannel(payload.channelId, payload.user)
                console.log('User added to channel!')
            })
            this.socket.on('removeUserFromChannel', (payload: any) => {
                chatStore.removeUserFromChannel(payload.channelId, payload.user)
                console.log('User removed from channel!')
            })
            this.socket.on('addAdminToChannel', (payload: any) => {
                chatStore.addAdminToChannel(payload.channelId, payload.user)
                console.log('Admin added to channel!')
            })
            this.socket.on('removeAdminFromChannel', (payload: any) => {
                chatStore.removeAdminFromChannel(payload.channelId, payload.user)
                console.log('Admin removed from channel!')
            })
            this.socket.on('addMutedToChannel', (payload: any) => {
                chatStore.addMutedToChannel(payload.channelId, payload.user)
                console.log('Muted added to channel!')
            })
            this.socket.on('removeMutedFromChannel', (payload: any) => {
                chatStore.removeMutedFromChannel(payload.channelId, payload.user)
                console.log('Muted removed from channel!')
            })
        },

        //Logout
        logOut() {
            this.socket = null
            this.name = ''
            this.email = ''
            this.id = 0
        }
    }
})
