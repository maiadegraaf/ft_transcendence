<template>
    <div class="flex flex-col h-screen w-screen bg-dark-purple font-mono">
        <div class="flex-1 w-full mx-auto bg-gradient-to-r from-transparent via-transparent to-dark-purple">
            <router-view />
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: 'App',
    components: {}
}
</script>

<style scoped>
.bg-gradient-to-r {
    background-image: url('../src/assets/images/gradient_pong_background.png');
    background-size: 200px;
    background-repeat: repeat-x;
    background-position: bottom;
}
</style>
