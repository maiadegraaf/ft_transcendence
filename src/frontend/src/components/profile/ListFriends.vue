<template>
    <div v-if="friendList.length != 0" class="friends-list">
        <ul>
            <li
                v-for="friend in friendList"
                :key="friend.id"
                class="flex items-center p-2 m-4 border rounded-md border-buff"
            >
                <img
                    :src="`/api/user/${friend.id}/avatar`"
                    alt="Avatar"
                    class="rounded-full w-12 object-cover aspect-square"
                />
                <a :href="`/Profile/${friend.id}`" class="pl-4 text-xl font-semibold">{{
                    friend.login
                }}</a>
                <div
                    v-if="friend.isOnline == true"
                    class="ml-4 w-3 h-3 bg-green-500 rounded-full"
                ></div>
                <div v-else class="ml-4 w-3 h-3 bg-red-500 rounded-full"></div>
                <div class="ml-auto">
                    <button
                        v-if="isProfileSession"
                        @click="removeFriend(friend.id)"
                        class="ml-auto mr-3 border-2 border-blush border-double text-blush font-bold py-2 px-4 rounded hover:opacity-60 transition-opacity"
                    >
                        REMOVE
                    </button>
                    <button
                        v-if="isProfileSession"
                        @click="blockUser(friend.id)"
                        class="ml-auto border-2 border-blush border-double text-blush font-bold py-2 px-4 rounded hover:opacity-60 transition-opacity"
                    >
                        BLOCK
                    </button>
                </div>
            </li>
        </ul>
    </div>
    <div v-else class="text-center m-4">
        <h1 class="text-3xl text-buff font-bold">No friends :((</h1>
    </div>
</template>

<script lang="ts">
import axios from 'axios'
import { defineComponent } from 'vue'

interface Friend {
    id: number
    login: string
    isOnline: boolean
}

export default defineComponent({
    props: {
        isProfileSession: {
            type: Boolean,
            required: true
        },
        friendList: {
            type: Array as () => Friend[],
            required: true
        }
    },
    data() {
        return {
            searchError: ''
        }
    },
    methods: {
        async removeFriend(friendId: number) {
            try {
                await axios.post(`/api/user/unfriend/${friendId}`)
                window.location.reload()
            } catch (error: any) {
                if (error.response) {
                    this.searchError = error.response.data.message
                } else {
                    this.searchError = `An error occured. Please try again later.`
                }
            }
        },
        async blockUser(friendId: number) {
            try {
                await axios.post(`/api/user/block/${friendId}`)
                window.location.reload()
            } catch (error: any) {
                if (error.response) {
                    this.searchError = error.response.data.message
                } else {
                    this.searchError = `An error occured. Please try again later.`
                }
            }
        }
    }
})
</script>
