<template>
    <qr-code-component />
</template>

<script lang="ts">
import QrCodeComponent from '@/components/QrCodeComponent.vue'
import { defineComponent } from 'vue'

export default defineComponent({
    name: '2fa.create',
    components: {
        QrCodeComponent
    }
})
</script>
