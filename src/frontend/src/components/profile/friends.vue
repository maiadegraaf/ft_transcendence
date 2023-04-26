<!-- ******** NEED TO CHANGE SCRIPT, IS JUST TO CHECK IF IT WORKS ******** -->

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
    methods: {
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
});
</script>


<template>
    <div class="flex flex-col justify-center items-center mt-16">
        <div class="border-double border-4 text-buff relative border-buff rounded-md w-[50vw] min-w-[600px] pt-10 p-4">
            <h1
                class="text-2xl font-bold text-white absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dark-purple rounded-md border-2 border-buff px-4 py-2">
                Friends
            </h1>
            <div class="flex items-center justify-around">
                <div class="friendDiv">
                    <h3 class="sub1">Check</h3>
                    <h3 class="sub2">
                        Backend-data
                    </h3>
                </div>
                <div class="friendDiv">
                    <h3 class="sub1">Check</h3>
                    <h3 class="sub2">
                        Backend-data
                    </h3>
                </div>
                <div class="friendDiv">
                    <h3 class="sub1">Check</h3>
                    <h3 class="sub2">
                        Backend-data
                    </h3>
                </div>
                <div class="friendDiv">
                    <h3 class="sub1">Check</h3>
                    <h3 class="sub2">
                        Backend-data
                    </h3>
                </div>
            </div>
            <!-- ******** UGGLY BUT JUST TO CHECK IF IT WORKS ******* -->
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
            <!-- ****************************************************** -->
        </div>
    </div>
</template>



<style scoped>
.friendDiv {
    @apply flex flex-col items-center justify-center;
}

.sub2 {
    @apply text-xl text-buff font-bold;
}

.sub1 {
    @apply text-xl text-white font-bold mb-4;
}
</style>



<!-- ********* ALFREDS SCRIPT FOR WIN/LOSS ********* -->
<!-- 
<script lang="ts">
import axios from 'axios'
export default {
    name: 'WinLosses',
    data() {
        return {
            currentUserId: 0,
            scoreData: {
                rating: 0,
                wins: 0,
                losses: 0,
                winStreak: 0
            }
        }
    },
    async mounted() {
        await axios.get('/api/auth/profile').then((response) => {
            this.currentUserId = response.data.id
        })
        axios.get('/api/leaderboard/' + this.currentUserId).then((response) => {
            this.scoreData = response.data
        })
        console.log(this.scoreData)
    }
}
</script> -->
