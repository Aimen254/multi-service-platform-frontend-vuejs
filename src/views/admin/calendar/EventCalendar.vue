<script setup>
import { inject, onMounted, onBeforeUnmount } from 'vue'
// import components
import Calender from '@components/core/Calender.vue';

// import composable
import { useEvents } from '@composables/events.js'
import { useHelper } from "@composables/helper"

// composables
const { events, getCalendarEvents } = useEvents()
const { showLoading, hideLoading } = useHelper()

// route
import { useRoute } from 'vue-router';
const route = useRoute()

// event bus
const eventBus = inject('eventBus')


// funtions
const getMyEvents = async (module, type = 'week', start = null, end = null, container = null) => {
    await getCalendarEvents(module, { limit: 30, type: type, start: start, end: end }, container)
}

onMounted(async () => {
    showLoading()
    await getMyEvents(route?.params?.levelOneslug)
    hideLoading()

    // event listener
    eventBus.on('calendar-view-name', async (args) => {
        await getMyEvents(route?.params?.levelOneslug, args?.view, args?.start, args?.end, args?.elementRef)
    })
})

onBeforeUnmount(() => {
    eventBus.off('calendar-view-name')
});

</script>

<template>
    <div class="row">
        <div class="col-12">
            <Calender :yourEvents="events" />
        </div>
    </div>
</template>

<style></style>