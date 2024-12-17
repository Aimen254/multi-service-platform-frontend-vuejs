<script setup>
import { ref, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import Table from '@components/core/Table.vue'
import TableFilters from '@components/core/TableFilters.vue'
import Pagination from '@components/core/Pagination.vue'
import { useHelper } from '@composables/helper'
import { useBookings } from '@composables/eventBookings'

import { useTagStore } from '@/stores/tags'
const tagStore = useTagStore()

const { getImage, truncate, formatDateTime, resetStringFormat } = useHelper()
const { getBookings, changeStatus, bookings, meta} = useBookings()
const route = useRoute();

const currentPage = ref(1);
const limitPerPage = ref(10);
const searchValue = ref('');
const currentDate = new Date().toLocaleDateString();
const myTickets = ref(null);
/**
 * filter list according to items
 * limit and search data
 */
const filters = (data) => {
    data?.limit
        ? limitPerPage.value = data?.limit
        : searchValue.value = data?.search;
}

// Get tickets
const listTickets = async (page = 1) => {
    await getBookings(route.params?.levelOneslug, {
        limit: limitPerPage.value,
        user_id: route.params.user,
        page: page,
        keyword: searchValue.value,
        filtersTasker: true,
    }, myTickets.value)
}

/**
 * calling api with current page param
 * for previous page
 */
const previousPage = async () => {
    currentPage.value--;
    await listTickets(currentPage.value);
}

/**
 * calling api with current page param
 * for next page
 */
const nextPage = async () => {
    currentPage.value++;
    await listTickets(currentPage.value);
}

onMounted(() => {
  listTickets();
});

watch(() => route.params, (newValue, oldValue) => {
  listTickets()
});

watch(limitPerPage, (newValue, oldValue) => {
  listTickets();
});

watch(searchValue, (newValue, oldValue) => {
  listTickets();
})
</script>

<template>
    <div ref="myTickets">
        <Table>
            <template #filters>
                <TableFilters @filters="filters" />
            </template>
            <template #content>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Performer</th>
                        <th>Ticket price</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody class="table-border-bottom-0">
                    <tr v-if="bookings.length === 0" class="text-center">
                        <td colspan="5" class="pt-4">
                          <p>There are no database entries that meet your criteria.</p>
                        </td>
                    </tr>
                    <tr v-for="(tickets) in bookings">
                        <td class="w-40">
                            <router-link
                                :to="{ name: 'artical-detail', params: { uuid: tickets?.product?.uuid, levelOneslug: tagStore?.getLevelOneTagSlug } }"
                                class="d-flex justify-content-start align-items-center text-inherit">
                                <div class="avatar-wrapper">
                                    <div class="avatar flex-shrink-0 me-3">
                                        <img :src="getImage(tickets?.product?.main_image)" alt="" class="rounded" />
                                    </div>
                                </div>
                                <div class="fw-medium text-inherit">{{ truncate(tickets?.product?.name) }}</div>
                            </router-link>
                        </td>
                        <td class="w-30">{{ tickets?.product?.event?.performer }}</td>
                        <td class="w-30">{{ tickets?.product?.price }} - {{ tickets?.product?.max_price ?? 100}}</td>
                        <td class="w-30">{{ tickets?.product?.event?.event_location }}</td>
                        <td class="w-30">{{ formatDateTime(tickets?.product?.event?.event_date) }}</td>
                        <td>
                          <template v-if="tickets && tickets.product && tickets.product.event && new Date(tickets.product.event.event_date) > new Date()">
                            <select class="badge rounded-pill " :class="tickets?.status" @change="changeStatus(route.params?.levelOneslug, tickets?.id, $event)">
                              <option value="going" :selected="tickets?.status === 'going'">Going</option>
                              <option value="not_going" :selected="tickets?.status === 'not_going'">Not Going</option>
                              <option value="maybe" :selected="tickets?.status === 'maybe'">Maybe</option>
                            </select>
                          </template>
                          <template v-else>
                            <select class="badge rounded-pill" style="background: gray" disabled>
                              <option>{{resetStringFormat(tickets?.status)}}</option>
                            </select>
                          </template>
                        </td>

                    </tr>
                </tbody>
            </template>
            <template #pagination>
                <Pagination class="px-4" :meta="meta" @previousPage="previousPage" @nextPage="nextPage" />
            </template>
        </Table>
    </div>
</template>

<style scoped>
:root {
  --v-theme-overlay-multiplier: var(--v-theme-secondary-overlay-multiplier);
}

.going {
  background-color: rgb(var(--v-theme-success)) !important;
  color: rgb(var(--v-theme-on-success)) !important;
}

.not_going {
  --bs-bg-opacity: 1;
  background-color: rgba(var(--bs-danger-rgb), var(--bs-bg-opacity)) !important;
}

.maybe {
  background-color: rgb(var(--v-theme-warning)) !important;
  color: rgb(var(--v-theme-on-warning)) !important;
}
</style>
