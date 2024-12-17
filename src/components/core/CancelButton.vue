<script setup>
import { onMounted } from 'vue';

const { url } = defineProps({
    url: {
        type: Object,
        default: {}
    }
});

onMounted(() => {
    console.log(url);
})
</script>

<template>
    <router-link :to="url" class="btn btn-label-secondary">Cancel</router-link>
</template>