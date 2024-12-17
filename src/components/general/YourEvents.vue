<script setup>
import { onMounted, ref, watch } from 'vue';
// import componets
import Calender from '@components/core/Calender.vue';
const props = defineProps({
    events: Array
})

const bookedMarkedEvents = ref([])

watch(() => props.events, (newVal) => {
    bookedMarkedEvents.value = newVal
});
</script>

<template>
    <Calender :yourEvents="bookedMarkedEvents">
    </Calender>
</template>

<style></style>