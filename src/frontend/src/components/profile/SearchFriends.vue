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
                window.location.reload();
            } catch (error: any) {
                if (error.response) {
                    // request was made, server responded with status code
                    // that falls out of the range 2xx
                    this.searchError = error.response.data.message;
                } else {
                    // someting happend while setting up the request and triggered an error
                    this.searchError = `An error occured. Please try again later.`;
                }
            }
        },
        async removeFriend(friendId: number) {
            try {
                await axios.post(`http://localhost:8080/api/user/unfriend/${friendId}`);
                window.location.reload();
            } catch (error: any) {
                if (error.response) {
                    this.searchError = error.response.data.message;
                } else {
                    this.searchError = `An error occured. Please try again later.`;
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
