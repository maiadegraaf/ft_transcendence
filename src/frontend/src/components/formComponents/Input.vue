<!-- FormInput.vue -->
<template>
    <label :for="id" class="mb-4 flex items-center">
        <span class="mr-2 text-2xl font-bold text-buff">{{ label }}</span>
        <input
            :id="id"
            :value="value"
            :type="type"
            :min="min"
            class="w-16 px-2 py-1 text-2xl font-bold rounded-lg border border-solid border-amaranth-purple bg-buff text-amaranth-purple focus:text-buff focus:bg-amaranth-purple focus:outline-none focus:border-amaranth-purple"
            @input="(event: Event) => $emit('input', (event.target as HTMLInputElement).value)"
        />
    </label>
</template>

<script lang="ts">
export default {
    name: 'Input',
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
        },
        type: {
            type: String,
            default: 'text'
        },
        min: {
            type: String,
            default: ''
        }
    }
}
</script>
