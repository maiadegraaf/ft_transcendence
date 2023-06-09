<template>
    <div class="search-friends">
        <div class="flex flex-col items-center justify-center">
            <label class="text-xl mb-2 font-semibold uppercase"
                >Search new friends by username:</label
            >
            <input
                type="text"
                v-model="searchInput"
                class="border rounded mt-3 appearance-none bg-transparent"
                @keyup.enter="searchForUser"
            />
            <div class="h-10 flex items-center">
                <p v-if="searchError" class="font-bold text-blush">{{ searchError }}</p>
                <span class="pr-3 font-semibold" v-if="searchResult && !searchError">{{
                    searchResult.login
                }}</span>
                <button
                    class="text-xs border rounded-md p-0.5 px-2 border-buff cursor-pointer hover:opacity-60 transition-opacity"
                    v-if="searchResult && !searchError"
                    @click="addFriend(searchResult?.id)"
                >
                    add
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios'
import { defineComponent } from 'vue'
import {useUserStore} from "@/store/user.store";
import type {IFriend} from "@/types/types";

export default defineComponent({
    name: 'SearchFriends',
    data() {
        return {
            friends: [] as IFriend[],
            searchInput: '',
            searchResult: null as IFriend | null,
            searchError: null as string | null
        }
    },
    setup() {
    const user = useUserStore()
      return { user }
    },
    methods: {
        async addFriend(friendId: number) {
            try {
                await axios.post(`/api/user/friends/${friendId}`).then(response => {
                  this.user.addFriend(response.data)
                })
            } catch (error: any) {
                if (error.response) {
                    this.searchError = error.response.data.message
                } else {
                    this.searchError = `An error occured. Please try again later.`
                }
            }
        },
        async searchForUser() {
            this.searchError = null
            if (!this.searchInput) {
                this.searchResult = null
                return
            }
            try {
                const response = await axios.get(
                    `/api/user/search/${this.searchInput}`
                )
                this.searchResult = response.data
                this.searchError = null
            } catch (error) {
                this.searchResult = null
                this.searchError = `No user found with username "${this.searchInput}"`
            }
        }
    }
})
</script>
