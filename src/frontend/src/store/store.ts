import { defineStore } from 'pinia'
import {VueCookieNext} from "vue-cookie-next";
import type {Socket} from "socket.io-client";
import {io} from "socket.io-client";
import type {IChannels, IMessage} from "@/store/types";
import {formToJSON} from "axios";


export const UserChatStore = defineStore('userChannel', {
    state: () => ({
        title: 'Nestjs Websockets Chat' as string,
        name: '' as string,
        invite: '' as string,
        channels: [] as IChannels[] | null,
        socket: null as any | null,
        userId: -1 as number,
        channelInView: 0 as number,
        joined: false as boolean,
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
        }
    },

    actions: {
        fetchUserData() {
            const userSession = sessionStorage.getItem('user')
            if (userSession == null) {
                return false
            }
            const user = JSON.parse(userSession).user
            this.userId = user.id
            this.name = user.login
            return true
        },
        async loadChannels() {
            const response = await fetch('http://localhost:8080/api/chat/' + this.userId)
            this.channels = await response.json()
            if (this.channels == null) { return }
            this.channels.forEach(channel => {
                this.socket.emit('joinRoomById', {channelId: channel.id})
            })
        },
        connectSocket() {
            const socket = io('http://localhost:8080', {
                query: {
                    userId: this.userId,
                    name: this.name,
                }
            })
            this.socket = socket
        },
        receivedMessage(message: IMessage) {
            if (this.channels == null) { return }
            const channel = this.channels.find(channel => channel.id === message.channel)
            if (channel) { channel.messages.push(message);}

        },
        async setChannelInView(channelId: number) {
            this.channelInView = channelId
        }
    }
})


