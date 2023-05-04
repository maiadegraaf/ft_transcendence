<template>
    <div class="friends-list">
        <h2 class="text-2xl font-bold mb-4">Friends</h2>
        <ul>
            <li v-for="friend in friendList" :key="friend.id" class="friend-row">
                <img :src="`/api/user/${friend.id}/avatar`" alt="Avatar" class="avatar">
                <!-- <span class="friend-name">  {{ friend.login  }}</span> -->
                <a :href="`/Profile/${friend.id}`" class="friend-name">{{ friend.login }}</a>
            </li>
        </ul>
    </div>
</template>


<script lang="ts">
import axios from 'axios';

interface Friend {
    id: number;
    login: string;
    // isOnline: boolean;
}

export default {
    props: {
        isProfileSession: {
            type: Boolean,
            required: true,
        },
        friendList: {
            type: Array as () => Friend[],
            required: true,
        },
    },
    data() {
        return {};
    },
};
</script>
  
<style scoped>
.friend-row {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
}

.friend-row:last-child {
    margin-bottom: 0;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 1rem;
    object-fit: cover;
}

.friend-name {
    flex-grow: 1;
    text-align: left;
}
</style>
