import { defineStore } from 'pinia'
import {io} from "socket.io-client";
import type {IChannels, IMessage} from "@/store/types";
import {useUserStore} from "@/store/user.store";


export const useChatStore = defineStore('userChannel', {
    state: () => ({
        invite: '' as string,
        channels: [] as IChannels[] | null,
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
            const channel = this.channels.find(channel => channel.id === message.channel)
            if (channel) { channel.messages.push(message);}

        },
        async setChannelInView(channelId: number) {
            this.channelInView = channelId
        }
    }
})
