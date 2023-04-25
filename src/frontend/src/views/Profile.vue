<template>
    <div>
      <Nav />
      <Profile />
    </div>
</template>
  
<script lang="ts">
  import Nav from "@/components/Nav.vue";
  import Profile from "@/components/Profile.vue";
  
  export default {
    components: {
      Nav,
      Profile,
    },
  };
  </script>
  