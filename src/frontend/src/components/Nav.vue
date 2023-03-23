<template>
  <nav class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <div class="ml-10 flex items-baseline space-x-4">
        <router-link
            class="uppercase font-semibold tracking-wider text-blush hover:text-amaranth-purple px-3 py-2 drop-shadow-2xl"
            to="/"
        >
          Home
        </router-link>

        <router-link
          class="uppercase font-semibold tracking-wider text-blush hover:text-amaranth-purple px-3 py-2 drop-shadow-2xl"
          to="/Chat"
        >
          Chat
        </router-link>

        <router-link
          class="uppercase font-semibold tracking-wider text-blush hover:text-amaranth-purple px-3 py-2 drop-shadow-2xl"
          to="/Authenticated"
        >
          Auth
        </router-link>

        <router-link
          class="uppercase font-semibold tracking-wider text-blush hover:text-amaranth-purple px-3 py-2 drop-shadow-2xl"
          to="/Pong"
        >
          Pong
        </router-link>
      </div>
      <!--    <nav class="flex justify-center p-3">-->
      <!--      <router-link class="hover:opacity-70 text-blush transition-opacity ease-in-out space-x-4" to="/Chat" exact> Chat </router-link>-->
      <!--      <router-link class="hover:opacity-70 text-blush transition-opacity ease-in-out space-x-4" to="/Home" exact>Home</router-link>-->
      <!--      <router-link class="hover:opacity-70 text-blush transition-opacity ease-in-out space-x-4" to="/Authenticated" exact>Auth</router-link>-->
      <!--      <router-link class="hover:opacity-70 text-blush transition-opacity ease-in-out space-x-4" to="/Login" exact>Login</router-link>-->
      <!--      <router-link class="hover:opacity-70 text-blush transition-opacity ease-in-out space-x-4" to="/Pong" exact>Pong</router-link>-->
      <!--    </nav>-->
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Nav'
}
</script>

<style scoped></style>
