<template>
    <div>
        <NavBar />
        <h1>404 error</h1>
    </div>
</template>

<script lang="ts">
import NavBar from '../components/NavBar.vue'
import { defineComponent } from 'vue'

export default defineComponent({
    name: '404',
    components: {
        NavBar
    }
})
</script>

<style scoped></style>
