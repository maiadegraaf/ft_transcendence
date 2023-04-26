<template>
    <div>
      <Nav />
      <Profile />
      <Friends />
    </div>
</template>
  
<script lang="ts">
  import Nav from "@/components/Nav.vue";
  import Profile from "@/components/Profile.vue";
  import Friends from "@/components/profile/friends.vue";
  
  export default {
    components: {
      Nav,
      Profile,
      Friends,
    },
  };
  </script>
  