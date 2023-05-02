<template>
    <tr>
        <td class="text-dark-purple row-both difficulty">{{ difficulty }}</td>
        <td class="">{{ whitespace }}</td>
        <td class="row-left text-normal border-l-2 border-t-2 border-b-2 bg-dark-purple row-border">
            {{ played }}
        </td>
        <td
            class="row-right text-normal border-r-2 border-t-2 border-b-2 bg-dark-purple row-border"
        >
            {{ wins }}
        </td>
    </tr>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: 'PracticeMatchRow',
    props: ['played', 'wins', 'color', 'whitespace', 'difficulty']
})
</script>

<style scoped>
.difficulty {
    background: v-bind('color');
}
.row-border {
    border-color: v-bind('color');
}
</style>
