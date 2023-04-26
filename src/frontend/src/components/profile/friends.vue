<template>
    <div class="friend-list">
        <h2>Your Friends</h2>
        <ul>
            <li v-for="friend in friends" :key="friend.id">{{ friend.login }}</li>
        </ul>

        <h2>Search for friends</h2>
        <div class="search-section">
            <!-- <input type="text" v-model="searchInput" @input="searchForUser" /> -->
            <input type="text" v-model="searchInput" @keyup.enter="searchForUser" />
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
import { defineComponent } from "vue";
import axios from "axios";

interface User {
    id: number;
    login: string;
}

export default defineComponent({
    data() {
        return {
            friends: [] as User[],
            searchInput: "",
            searchResult: null as User | null,
            searchError: null as string | null,
        };
    },
    async created() {
        try {
            const id = 94299; //HARD CODED, NEED TO GET ID WITH USE OF STORE
            const response = await axios.get(`http://localhost:8080/api/user/${id}/friends`);
            this.friends = response.data;
        } catch (error) {
            console.error("Failed to fetch friends", error);
        }
    },
    methods: {
        async searchForUser() {
            // if (!this.searchInput) {
            //     this.searchResult = null;
            //     this.searchError = null;
            //     return;
            // }
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
        async addFriend(friendId: number) {
            try {
                const id = 94299; //HARD CODED, NEED TO GET ID WITH USE OF STORE
                await axios.post(`http://localhost:8080/api/user/${id}/friends/${friendId}`);
                this.friends.push(this.searchResult as User);
                this.searchResult = null;
                this.searchInput = "";
                this.searchError = null;
            } catch (error) {
                console.error("Failed to add friend", error);
            }
        },
    },
});
</script>
  
<style scoped>
.friend-list {
    max-width: 400px;
    margin: 0 auto;
}

ul {
    list-style-type: none;
    padding: 0;
}

.search-section {
    margin-top: 1rem;
}

input {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
}

button {
    background-color: #3498db;
    border: none;
    color: white;
    font-size: 1rem;
    padding: 0.25rem 0.5rem;
    margin-left: 0.5rem;
    cursor: pointer;
}

button:hover {
    background-color: #2980b9;
}
</style>
  