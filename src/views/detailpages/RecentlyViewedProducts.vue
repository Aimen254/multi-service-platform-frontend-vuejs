<script setup>
import { ref, watch, onMounted } from 'vue';
import { useTagStore } from '@stores/tags';
import { useProductApi } from '@composables/products';
import FilterPage from '@components/core/FilterPage.vue'
import ProductCard from '@components/core/ProductCard.vue';
import ItemContainer from '@components/general/ItemContainer.vue';
import Pagination from '@components/core/Pagination.vue';

const limit = ref(12);
const currentPage = ref(1);
const searchValue = ref('');
const recentlyViewedProducts = ref(null);
const tagStore = useTagStore();


const { meta, getProducts, dataNotFound } = useProductApi();

const handleSearch = (data) => {
    if (data.search !== undefined) {
        searchValue.value = data.search;
    }
    if (data.limit) {
        limit.value = data.limit;
    }
}

const getRecentlyViewedProducts = async (page = 1) => {
    recentlyViewedProducts.value = []
    recentlyViewedProducts.value = await getProducts(tagStore.getLevelOneTagId,
        {
            'limit': limit.value,
            'keyword': searchValue.value,
            'recently_viewed': true,
            'page': page,
            with_user_address: true 
        });
}

const previousPage = async () => {
    currentPage.value--;
    getRecentlyViewedProducts(currentPage.value);
}

const nextPage = async () => {
    currentPage.value++;
    getRecentlyViewedProducts(currentPage.value);
}

watch(searchValue, async (newValue, oldValue) => {
    currentPage.value = 1;
    await getRecentlyViewedProducts();
});

watch(limit, async (newValue, oldValue) => {
    currentPage.value = 1;
    await getRecentlyViewedProducts();
});

onMounted(async () => {
    getRecentlyViewedProducts();
});
</script>
<template>
    <ItemContainer>
        <template #heading>
            <h4 class="text-capitalize">Recently Viewed</h4>
            <FilterPage @filters="handleSearch" :hideSorting="true" />
        </template>

        <template #content>
            <div v-if="dataNotFound">
                {{ dataNotFound }}
            </div>
            <div v-else>
                <div class="row">
                    <div class="col-lg-3 col-xxl-3 col-md-6 col-sm-12 mb-4" v-for="(data, index) in recentlyViewedProducts"
                        :key="index">
                        <ProductCard :product="data" />
                    </div>
                </div>
                <div class="row">
                    <Pagination :meta="meta" @previousPage="previousPage" @nextPage="nextPage" />
                </div>
            </div>
        </template>
    </ItemContainer>
</template>