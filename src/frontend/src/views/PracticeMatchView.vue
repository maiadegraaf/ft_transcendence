<template>
    <body>
        <Nav />
        <PracticeMatch />
    </body>
</template>

<script lang="ts">
import PracticeMatch from '@/components/PracticeMatch.vue'
import Nav from '@/components/Nav.vue'

export default {
    name: 'PracticeMatchView',
    components: {
        PracticeMatch,
        Nav
    }
}
</script>
