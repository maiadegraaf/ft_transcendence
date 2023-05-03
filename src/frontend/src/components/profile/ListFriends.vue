<template>
    <div class="friends-list">
        <h2 class="text-2xl font-bold mb-4">Friends</h2>
        <ul>
            <li v-for="friend in friendList" :key="friend.id">
                {{ friend.username  }}
            </li>
        </ul>
    </div>
</template>


<script lang="ts">
import axios from 'axios';

interface User {
    id: number;
    login: string;
}

interface FriendList {
    id: number;
    username: string;
    isOnline: boolean;
    // avatarURL: string;
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
        friendList: {
            type: Array as () => FriendList[],
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
