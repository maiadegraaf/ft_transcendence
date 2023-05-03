import {defineStore} from "pinia";
import axios from "axios";
import {io} from "socket.io-client";
import {useChatStore} from "@/store/channel.store";

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
            useChatStore().loadChannels().then()
            },
        }
})