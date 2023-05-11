<template>
    <!--  create a scrolling list-->
    <div class="bg-dark-purple p-4 rounded-md overflow-y-auto max-h-64">
        <h2 class="h2">Users</h2>
        <ul>
            <li
                v-for="(user, index) in chatStore.getChannelUsersByChannelId(
                    chatStore.channelInView
                )"
                :key="index"
                class="py-1"
            >
                {{ user.login }} {{ chatStore.getRole(user) }}
            </li>
        </ul>
    </div>
</template>

<script lang="ts">

import {defineComponent} from "vue";
import {useChatStore} from "@/store/channel.store";
import {useUserStore} from "@/store/user.store";

export default defineComponent({
  name: "GroupSettingUserList",
  setup() {
    const chatStore = useChatStore()
    const userStore = useUserStore()
    return {chatStore, userStore}
  },

})
</script>
