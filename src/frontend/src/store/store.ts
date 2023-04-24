import { defineStore } from 'pinia'
import {VueCookieNext} from "vue-cookie-next";
import type {Socket} from "socket.io-client";
import {io} from "socket.io-client";
import type {IChannels, IMessage} from "@/store/types";
import axios, {formToJSON} from "axios";
// import axios from "axios/index";


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
        async setupChatStore() {
            await this.fetchUserData()
            this.connectSocket()
            await this.loadChannels()
        },
        async fetchUserData() {
            const response = await fetch('http://localhost:8080/api/auth/profile')
            const user = await response.json()
            this.userId = user.id
            this.name = user.login
            console.log('fetchUserData --> id: ' + this.userId + ' | Login:  ' + this.name)
            if (this.userId == -1) {
                return false
            }
            // const userSession = sessionStorage.getItem('user')
            // if (userSession == null) {
            //     return false
            // }
            // const user = JSON.parse(userSession).user
            // this.userId = user.id
            // this.name = user.login
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
        },
        async receivedNewChannel(channel: IChannels) {
            this.channels?.push(channel)
            await this.setChannelInView(channel.id)
            this.socket.emit('joinRoomById', {channelId: channel.id})
        }
    }
})


