<template>
    <div>
        <Nav />
        <h1>404 error</h1>
    </div>
</template>

<script lang="ts">
import Nav from '../components/Nav.vue'
import { defineComponent } from 'vue'

export default defineComponent({
    name: '404',
    components: {
        Nav
    }
})
</script>

<style scoped></style>
