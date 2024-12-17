
<template>
    <div class="card h-100 w-100 overflow-hidden">
        <div class="card-body p-0">
            <img class="img-fluid card-img" :src="imgsrc" alt="Card image cap"/>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps({
    imgsrc: String
});
</script>
<style scoped>
.card-img {
    object-fit: cover;
}
</style>
