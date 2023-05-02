<template>
    <!-- MISTAKE HERE, LOOP USING ARRAY -->
    <div class="friends-list">
        <div v-for="friend in friends" :key="friend.id" class="friend-row flex items-center">
            <img :src="`/api/user/${friend.id}/avatar`" alt="Avatar" class="w-10 h-10 rounded-full object-cover mr-4" />
            <h3 class="text-lg">{{ friend.login }}</h3>
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
        };
    },
    props: {
        isProfileSession: {
            type: Boolean,
            required: true,
        },
    },
    async created() {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/user/friends`
            );
            this.friends = response.data;
        } catch (error) {
            console.log(error);
        }
    },
};
</script>
  
<style scoped>
.friend-row:not(:last-child) {
    margin-bottom: 1rem;
}
</style>
  