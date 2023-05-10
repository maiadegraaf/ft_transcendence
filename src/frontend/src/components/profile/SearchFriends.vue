<template>
    <div class="search-friends">
        <div class="flex flex-col items-center justify-center">
            <label class="text-2xl mb-2 font-semibold">Search new friends by username:</label>
            <p class="h-1 mb-2 p-2 font-bold text-blush">{{ searchError }}</p>
            <input 
                type="text"
                v-model="searchInput"
                class="border rounded mt-3 appearance-none bg-transparent"
                @keyup.enter="searchForUser"
            />
            <div v-if="searchResult">
                <span>{{ searchResult.login }}</span>
                <button @click="addFriend(searchResult?.id ?? -1)">+</button>
                <button @click="removeFriend(searchResult?.id ?? -1)">-</button>
            </div>
            <!-- <div v-if="searchError">
                <span>{{ searchError }}</span>
            </div> -->
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios';

interface User {
    id: number;
    login: string;
}

export default {
    data() {
        return {
            friends: [] as User[],
            searchInput: '',
            searchResult: null as User | null,
            searchError: null as string | null,
        }
    },
    methods: {
        async addFriend(friendId: number) {
            try {
                await axios.post(`http://localhost:8080/api/user/friends/${friendId}`);
                this.friends.push(this.searchResult as User);
                this.searchResult = null;
                this.searchInput = "";
                this.searchError = null;
            } catch (error) {
                console.error("Failed to add friend", error);
                if (typeof error === "string") {
                    this.searchError = error;
                } else {
                    this.searchError = "Failed to add friend";
                }
            }
        },
        async removeFriend(friendId: number) {
            try {
                await axios.post(`http://localhost:8080/api/user/unfriend/${friendId}`);
                this.friends = this.friends.filter(friend => friend.id !== friendId);
                this.searchResult = null;
                this.searchInput = "";
                this.searchError = null;
            } catch (error) {
                console.error("Failed to remove friend", error);
                if (typeof error === "string") {
                    this.searchError = error;
                } else {
                    this.searchError = "Failed to remove friend";
                }
            }
        },
        async searchForUser() {
            this.searchError = null;
            if (!this.searchInput) {
                this.searchResult = null;
                return;
            }
            try {
                const response = await axios.get(`http://localhost:8080/api/user/search/${this.searchInput}`);
                this.searchResult = response.data;
                this.searchError = null;
            } catch (error) {
                this.searchResult = null;
                this.searchError = `No user found with username "${this.searchInput}"`;
            }
        },
    },
}

</script>
