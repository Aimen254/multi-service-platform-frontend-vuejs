<script setup>
import { RouterView } from 'vue-router';
</script>
<template>
    <div class="authentication-wrapper authentication-cover">
        <div class="authentication-inner row m-0">
            <RouterView />
        </div>
    </div>
</template>
<style scoped>
.authentication-wrapper {
    height: 100vh;
}

.authentication-inner {
    height: 100%;
    min-height: 100vh;
}
</style>