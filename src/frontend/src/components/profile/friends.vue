<template>
  <div class="flex flex-col justify-center items-center mt-16">
      <div class="border-double border-4 text-buff relative border-buff rounded-md w-[50vw] min-w-[600px] pt-10 p-4">
        <div v-if="isProfileSession">
          <SearchFriends />
        </div>
        <h1
              class="text-2xl font-bold text-white absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dark-purple rounded-md border-2 border-buff px-4 py-2">
              Friends
          </h1>
          <ListFriends 
            :is-profile-session="isProfileSession"
            :friend-list="friendList"
          />

      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import SearchFriends from "./SearchFriends.vue";
import ListFriends from "./ListFriends.vue";

interface Friend {
    id: number;
    login: string;
    // isOnline: boolean;
}

export default defineComponent({
    name: "Friends",
    props: {
        isProfileSession: {
            type: Boolean,
            required: true,
        },
    },
    components: {
        SearchFriends,
        ListFriends,
    },
    data() {
        return {
            friendList: [] as Friend[],
        };
    },
    async mounted() {
        if (this.isProfileSession) {
            await axios.get('/api/user/friends').then((response) => {
                this.friendList = Array.from(response.data);
            })
            .catch((error) => {
               console.error('Error:', error.message);
            });
        } else {
            const userID = this.$route.params.id;
            await axios.get(`/api/user/friends/${userID}`).then((response) => {
                this.friendList = Array.from(response.data);
            })
            .catch((error) => {
               console.error('Error:', error.message);
            });
        }
    },
});
</script>



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
