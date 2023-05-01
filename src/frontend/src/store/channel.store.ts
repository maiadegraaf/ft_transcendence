import { defineStore } from 'pinia'
import {io} from "socket.io-client";
import type {IChannels, IMessage} from "@/store/types";
import {useUserStore} from "@/store/user.store";
import type {IChannels, IMessage, IProfile} from "@/store/types";
import axios, {formToJSON} from "axios";
import MessageList from "@/components/Chat/MessageList.vue";
// import axios from "axios/index";


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
        },
        async receivedNewChannel(channel: IChannels) {
            this.channels?.push(channel)
            await this.setChannelInView(channel.id)
            this.socket.emit('joinRoomById', {channelId: channel.id})
        },
        async removeChannel(channelID: number) {
            const index = this.channels?.findIndex((ch) => ch.id === channelID)
            console.log(channelID)
            console.log('removeChannelindex: ' + index)
            if (index && index != -1) {
                this.channels?.splice(index, 1);
                this.socket.emit('leaveRoomById', {channelId: channelID})
            }
        },
        setGroupId(groupId: number) {
            this.groupId = groupId
        },
        setGroupName(groupName: string) {
            this.groupName = groupName
        }
    }
})
