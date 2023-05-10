<template>
    <div class="friends-list">
        <ul>
            <li v-for="friend in friendList" :key="friend.id" class="flex items-center p-2 m-4 border rounded-md border-buff">
                <img :src="`/api/user/${friend.id}/avatar`" alt="Avatar" class="rounded-full w-12">
                <a :href="`/Profile/${friend.id}`" class="pl-2 text-xl font-semibold">{{ friend.login }}</a>
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
</style>
