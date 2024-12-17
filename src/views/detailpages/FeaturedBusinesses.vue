<script setup>
import { ref, watch, onMounted } from 'vue';
import { useTagStore } from '@stores/tags';
import { useBusinessApi } from '@composables/business';
import FilterPage from '@components/core/FilterPage.vue'
import BusinessCard from '@components/core/BusinessCard.vue';
import ItemContainer from '@components/general/ItemContainer.vue';
import Pagination from '@components/core/Pagination.vue';
import { useModuleSettings } from '@composables/modules.js'
const limit = ref(12);
const currentPage = ref(1);
const searchValue = ref('');
const order = ref('desc');
const featuredBusinesses = ref(null);
const tagStore = useTagStore();


const { meta, getBusinesses, dataNotFound } = useBusinessApi();
const { author } = useModuleSettings()

const handleSearch = (data) => {
    if (data.search !== undefined) {
        searchValue.value = data.search;
    }
    if (data.limit) {
        limit.value = data.limit;
    }
    if (data.order) {
        order.value = data.order;
    }
}

const getFeaturedBusinesses = async (page = 1) => {
    featuredBusinesses.value = await getBusinesses(tagStore.getLevelOneTagId,
        {
            'is_featured': true,
            'limit': limit.value,
            'keyword': searchValue.value,
            'order': order.value,
            'page': page
        });
}

const previousPage = async () => {
    currentPage.value--;
    getFeaturedBusinesses(currentPage.value);
}

const nextPage = async () => {
    currentPage.value++;
    getFeaturedBusinesses(currentPage.value);
}

watch(searchValue, async (newValue, oldValue) => {
    featuredBusinesses.value = null;
    currentPage.value = 1;
    await getFeaturedBusinesses();
});

watch(order, async (newValue, oldValue) => {
    featuredBusinesses.value = null;
    currentPage.value = 1;
    await getFeaturedBusinesses();
});

watch(limit, async (newValue, oldValue) => {
    featuredBusinesses.value = null;
    currentPage.value = 1;
    await getFeaturedBusinesses();
});

onMounted(async () => {
    getFeaturedBusinesses();
});
</script>
<template>
    <ItemContainer>
        <template #heading>
            <h4 class="text-capitalize">Featured {{ author }}</h4>
            <FilterPage @filters="handleSearch" />
        </template>

        <template #content>
            <div v-if="dataNotFound">
                {{ dataNotFound }}
            </div>
            <div v-else>
                <div class="row">
                    <div class="col-lg-3 col-xxl-3 col-md-6 col-sm-12 mb-4" v-for="(data, index) in featuredBusinesses" :key="index">
                        <BusinessCard :business="data" />
                    </div>
                </div>
                <div>
                    <Pagination :meta="meta" @previousPage="previousPage" @nextPage="nextPage" />
                </div>
            </div>
        </template>
    </ItemContainer>
</template>