<script setup>
import { ref, onBeforeMount, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import Table from '@components/core/Table.vue'
import TableFilters from '@components/core/TableFilters.vue'
import Pagination from '@components/core/Pagination.vue'
import { useHelper } from '@composables/helper'
import { useUser } from '@composables/user'

import { useTagStore } from '@/stores/tags'
const tagStore = useTagStore()

const { getImage, truncate, formatDateTime } = useHelper()
const { userProducts, meta, productsByUser, dataNotFound } = useUser()
const route = useRoute();

const currentPage = ref(1); // property default selected page
const limitPerPage = ref(10) // property default limit of items
const searchValue = ref('') // property to assign string of search values

/**
 * filter list according to items
 * limit and search data
 */
const filters = (data) => {
    data?.limit
        ? limitPerPage.value = data?.limit
        : searchValue.value = data?.search;
}

// Get articles of reporter
const reporterArticles = async (page = 1) => {
    await productsByUser(tagStore.getLevelOneTagId, {
        limit: limitPerPage.value,
        user_id: route.params.user,
        page: page,
        keyword: searchValue.value,
        filtersTasker: true,
    })
}

/**
 * calling api with current page param
 * for previous page
 */
const previousPage = async () => {
    currentPage.value--;
    await reporterArticles(currentPage.value);
}

/**
 * calling api with current page param
 * for next page
 */
const nextPage = async () => {
    currentPage.value++;
    await reporterArticles(currentPage.value);
}

onBeforeMount(() => {
    reporterArticles();
});

watch(() => route.params, (newValue, oldValue) => {
    reporterArticles()
});

watch(limitPerPage, (newValue, oldValue) => {
    reporterArticles();
});

watch(searchValue, (newValue, oldValue) => {
    reporterArticles();
})
</script>

<template>
    <div>
        <Table>
            <template #filters>
                <TableFilters @filters="filters" />
            </template>
            <template #content>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Published at</th>
                    </tr>
                </thead>
                <tbody class="table-border-bottom-0">
                    <tr v-if="dataNotFound" class="text-center">
                        <td colspan="5" class="pt-4">
                            {{ dataNotFound }}
                        </td>
                    </tr>
                    <tr v-for="(article, index) in userProducts">
                        <td class="w-40">
                            <router-link
                                :to="{ name: 'artical-detail', params: { uuid: article?.uuid, levelOneslug: tagStore?.getLevelOneTagSlug } }"
                                class="d-flex justify-content-start align-items-center text-inherit">
                                <div class="avatar-wrapper">
                                    <div class="avatar flex-shrink-0 me-3">
                                        <img :src="getImage(article?.main_image)" alt="" class="rounded" />
                                    </div>
                                </div>
                                <div class="fw-medium text-inherit">{{ truncate(article?.name) }}</div>
                            </router-link>
                        </td>
                        <td class="w-30">{{ article?.level_two_tag?.name }}</td>
                        <td class="w-30">
                            {{ formatDateTime(article?.published_date) }}
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