<script setup>
import ProductTabs from './ProductTabs.vue';
</script>
<template>
    <div>
        <div class="mt-4">
            <ProductTabs />
        </div>
        <div>
            <RouterView />
        </div>
    </div>
</template>