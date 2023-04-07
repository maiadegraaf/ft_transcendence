<template>
    <body>
        <Nav />
        <Pong />
    </body>
</template>

<script lang="ts">
import Pong from '../components/Pong.vue'
import Nav from '@/components/Nav.vue'

export default {
    name: 'PongGame',
    components: {
        Nav,
        Pong
    }
}
</script>
