<!-- FormSelect.vue -->
<template>
    <label :for="id" class="mb-4 flex items-center">
        <span class="mr-2 text-2xl font-bold text-buff">{{ label }}</span>
        <select
            :id="id"
            :value="value"
            class="w-32 px-4 py-2 text-2xl font-bold text-amaranth-purple focus:text-buff rounded-lg border border-amaranth-purple border-solid focus:outline-none bg-buff focus:outline-none focus:bg-amaranth-purple focus:outline-none focus:border-amaranth-purple"
            @input="(event: Event) => $emit('input', (event.target as HTMLSelectElement).value)"
        >
            <slot></slot>
        </select>
    </label>
</template>

<script lang="ts">
export default {
    name: 'Select',
    props: {
        id: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        value: {
            type: [String, Number],
            default: ''
        }
    }
}
</script>
