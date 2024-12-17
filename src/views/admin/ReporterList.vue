<script setup>
import { ref, computed, onBeforeMount, watch, inject } from 'vue'
import Table from '@components/core/Table.vue'
import TableFilters from '@components/core/TableFilters.vue'
import Pagination from '@components/core/Pagination.vue'
import { useUser } from '@composables/user'
import { useWishlist } from '@composables/wishlist'
import { useUserStore } from "@/stores/user";
import { useTagsApi } from '@composables/tagLevels.js'
import { useTagStore } from '@/stores/tags'
import { useModuleSettings } from '@composables/modules.js'
import { useRoute } from 'vue-router'

const { author, productHeading } = useModuleSettings()

const eventBus = inject('eventBus')

const userStore = useUserStore();
const { meta, userList, dataNotFound } = useUser();
const { addToWishlist } = useWishlist();
const { levelTwoTags } = useTagsApi();
const tagStore = useTagStore()
const route = useRoute()


const currentPage = ref(1); // property default selected page
const limitPerPage = ref(10) // property default limit of items
const searchValue = ref(''); // property to assign string of search values
const favoriteValue = ref('') //property to assign favorite value
const categoryOptions = ref([]) //property to save array of categories
const categoryValue = ref(null);

const reportres = computed(() => {
    return userStore.users
})


const articleType = computed(() => {
    switch (route.params?.levelOneslug) {
        case 'news':
            return 'Articles';
        case 'blogs':
            return 'Blogs';
        case 'recipes':
            return 'Recipes';
    }
});

const getUserType = computed(() => {
    switch (route.params?.levelOneslug) {
        case 'news':
            return 'Reporter';
        case 'blogs':
            return 'Author';
        case 'recipes':
            return 'Author';
    }
});

/**
 * filter list according to items
 * limit and search data
 */
const filters = (data) => {
    if (data?.favorite) {
        favoriteValue.value = data.favorite != 'default' ? data.favorite : ''
    } else if (data?.limit) {
        limitPerPage.value = data?.limit
    } else if (data?.category) {
        categoryValue.value = data.category
    }
    else {
        searchValue.value = data?.search;
    }
}

// get list of reporters
const getReporters = async (page = 1) => {
    await userList({
        module: route.params?.levelOneslug,
        limit: limitPerPage.value,
        page: page,
        keyword: searchValue.value,
        favorite: favoriteValue.value,
        category: categoryValue.value,
    });
}

// get list of level two categories
const getCategories = async () => {
    categoryOptions.value = await levelTwoTags(route.params?.levelOneslug, { limit: 20 })
    categoryOptions.value.push({ id: 0, text: 'All' })
}

/**
 * calling api with current page param
 * for previous page
 */
const previousPage = async () => {
    currentPage.value--;
    await getReporters(currentPage.value);
}

/**
 * calling api with current page param
 * for next page
 */
const nextPage = async () => {
    currentPage.value++;
    await getReporters(currentPage.value);
}

onBeforeMount(() => {
    getCategories();
    getReporters();
});

watch(limitPerPage, (newValue, oldValue) => {
    getReporters();
});

watch(searchValue, (newValue, oldValue) => {
    getReporters();
});

watch(favoriteValue, (newValue, oldValue) => {
    getReporters();
})
watch(categoryValue, (newValue, oldValue) => {
    getReporters();
})
</script>

<template>
    <div>
        <Table>
            <template #filters>
                <TableFilters @filters="filters" :showFilters="true" :categories="categoryOptions" />
            </template>
            <template #content>
                <thead>
                    <tr>
                        <th>{{ author }}</th>
                        <th>Total {{ productHeading }}</th>
                        <th>Weekly Published</th>
                    </tr>
                </thead>
                <tbody class="table-border-bottom-0">
                    <tr v-if="dataNotFound" class="text-center">
                        <td colspan="5" class="pt-4">
                            {{ dataNotFound }}
                        </td>
                    </tr>
                    <tr v-for="(reporter, index) in reportres" :key="index">
                        <td>
                            <div class="d-flex justify-content-start align-items-center">
                                <div class="cursor-pointer" @click="addToWishlist(reporter)">
                                    <i class=" bx bx-heart me-4 mt-2 table-heart-icon"
                                        :class="{ 'bx bxs-heart heart-color': reporter?.in_wishlist ?? '' }"></i>
                                </div>
                                <div class="avatar-wrapper">
                                    <div class="avatar me-2">
                                        <img :src="reporter?.avatar" alt="" class="rounded-circle" />
                                    </div>
                                </div>
                                <div class="fw-medium">{{ reporter?.name }}</div>
                            </div>
                        </td>
                        <td>
                            {{ reporter?.products_count > 100 ? `${reporter?.products_count} +` : reporter?.products_count
                            }}
                        </td>
                        <td>
                            {{ reporter.weekly_published }}
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