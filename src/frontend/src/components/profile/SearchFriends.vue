<template>
    <div class="search-friends">
        <h2>Search for friends</h2>
        <div class="search-section">
            <input type="text" v-model="searchInput" @keyup.enter="searchForUser"/>
            <div v-if="searchResult">
                <span>{{ searchResult.login }}</span>
                <button @click="addFriend(searchResult?.id ?? -1)">+</button>
            </div>
            <div v-if="searchError">
                <span>{{ searchError }}</span>
            </div>
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
    // props: {
    //     currentUserId: {
    //         type: Number,
    //         required: true,
    //     },
    // },
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
