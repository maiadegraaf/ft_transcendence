<template>
    <!--  create a scrolling list-->
    <div class="flex flex-col justify-center items-center mt-16">
        <div
            class="border-double border-4 text-buff relative border-buff rounded-md w-[50vw] min-w-[600px] pt-10 p-4 bg-dark-purple bg-opacity-60"
        >
            <h1
                class="text-2xl font-bold text-white absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dark-purple rounded-md border-2 border-buff px-4 py-2"
            >
                Members
            </h1>
            <ul>
                <li
                    v-for="(user, index) in getUsersWithRoles"
                    :key="index"
                    class="py-1 px-2 my-2 flex items-center border border-buff rounded-md bg-dark-purple justify-between"
                >
                    <div class="flex items-center">
                        <img
                            class="rounded-full w-8 object-cover mr-3 aspect-square"
                            :src="`api/user/${user.id}/avatar`"
                            alt="avatar"
                        />
                        <a :href="'/profile/' + user.id">{{ user.login }}</a>
                        <p class="pl-2 text-xs opacity-50">{{ getRoleStr(user) }}</p>
                    </div>
                    <div
                        v-if="
                            (userStore.owner || userStore.admin) &&
                            userStore.id !== user.id
                        "
                        class="space-x-4"
                    >
                        <button
                            v-if="user.admin"
                            class="button_role"
                            @click="deleteAdmin(user.login)"
                        >
                            unadmin
                        </button>
                        <button v-else class="button_role" @click="addAdmin(user.login)">
                            admin
                        </button>
                      <button class="button_role" v-if="user.muted" @click="deleteMuted(user.login)">unmute</button>
                      <button class="button_role" v-else @click="addMuted(user.login)">mute</button>
                      <button class="button_role" @click="addBanned(user.login)">ban</button>
                      <button
                          @click="deleteUser(user.login)"
                          class=" text-sm border-blush border-2 border-double text-blush font-bold py-1 px-2 rounded hover:opacity-60 transition-opacity"
                      >
                        REMOVE
                      </button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useChatStore } from '@/store/channel.store'
import { useUserStore } from '@/store/user.store'
import axios from 'axios'
import type { IUser } from '@/types/types'
import type { IProfile } from '@/types/types'

export default defineComponent({
  name: 'GroupSettingUserList',
  setup() {
        const chatStore = useChatStore()
        const userStore = useUserStore()
        return { chatStore, userStore }
    },
    data(): any {
      return {
      }
    },
    computed: {
      getParams(): any {
        const params : any = {
          channelId: this.chatStore.channelInView,
          groupId: this.chatStore.getCurrentGroupId
        }
        return params
      },
      getUsersWithRoles(): IUser[] | null {
          const users = this.chatStore.getCurrentUsers
          const profile = this.chatStore.getCurrentProfile
          if (users == null || profile == null) {
              return null
          } else {
              users.forEach((user: IUser, index: number) => {
                  user.owner = this.checkOwner(user, profile);
                  user.admin = this.checkAdmin(user, profile);
                  user.muted = this.checkMuted(user, profile);
                  if (user.id == this.userStore.id) {
                    this.userStore.owner = user.owner;
                    this.userStore.admin = user.admin;
                    users.unshift(users.splice(index, 1)[0])
                  }
              })
          }
          return users
      },
    },
    methods: {
      addAdmin(login: string): void {
        let params = this.getParams
        params.userName = login
        console.log(params)
        axios
            .post('/api/chat/group/admin', params)
            .then((response) => {
              console.log(response)
            })
            .catch((error) => {
              console.log(error)
              return
            })
      },
      deleteAdmin(login: string): void {
        let params = this.getParams
        params.userName = login
        axios
            .delete('/api/chat/group/admin', { data: params })
            .then(() => {
            })
            .catch((error) => {
              console.log(error)
              return
            })
      },

      addMuted(login: string): void {
        let params = this.getParams
        params.userName = login
        axios
            .post('/api/chat/group/muted', params)
            .then((response) => {
              console.log(response)
            })
            .catch((error) => {
              console.log(error)
              return
            })
      },
      deleteMuted(login: string): void {
        let params = this.getParams
        params.userName = login
        axios
            .delete('/api/chat/group/muted', { data: params })
            .then((response) => {
              console.log(response)
            })
            .catch((error) => {
              console.log(error)
              return
            })
      },
      addBanned(login: string): void {
        let params = this.getParams
        params.userName = login
        axios
            .post('/api/chat/group/banned', params)
            .then((response) => {
              console.log(response)
            })
            .catch((error) => {
              console.log(error)
              return
            })
      },
      deleteUser(login: string): void {
        let params = this.getParams
        params.userName = login
        axios
            .delete('/api/chat/group/user', { data: params})
            .then((response) => {
              console.log(response)
            })
            .catch((error) => {
              console.log(error)
              return
            })
      },
      checkOwner(user: IUser, profile: IProfile) {
        return profile.owner.id === user.id;

      },
      checkAdmin(user: IUser, profile: IProfile) {
        return !!profile.admin.find((adm) => adm.id === user.id);

      },
      checkMuted(user: IUser, profile: IProfile) {
        return !!profile.muted.find((mtd) => mtd.id === user.id);

      },
      getRoleStr(user: IUser) {
        let str = ''
        if (user.owner) {
          str += ' Owner'
        }
        if (user.admin) {
          str += ' Admin'
        }
        if (user.muted) {
          str += ' Muted'
        }
        return str
      },
    }
})
</script>

<style scoped>
.button_role {
    @apply hover:opacity-60 transition-opacity;
}
</style>
