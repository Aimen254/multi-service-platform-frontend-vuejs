<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useTagStore } from '@stores/tags';
import { useProductApi } from '@composables/products';
import FilterPage from '@components/core/FilterPage.vue'
import ProductCard from '@components/core/ProductCard.vue';
import ItemContainer from '@components/general/ItemContainer.vue';
import Pagination from '@components/core/Pagination.vue';
import { useModuleSettings } from '@composables/modules'

const limit = ref(12);
const currentPage = ref(1);
const searchValue = ref('');
const popularProducts = ref(null);
const tagStore = useTagStore();
const { productHeading } = useModuleSettings();


const { meta, getProducts, dataNotFound } = useProductApi();

const handleSearch = (data) => {
    if (data.search !== undefined) {
        searchValue.value = data.search;
    }
    if (data.limit) {
        limit.value = data.limit;
    }
}

const getPopularProducts = async (page = 1) => {
    popularProducts.value = []
    popularProducts.value = await getProducts(tagStore.getLevelOneTagId,
        {
            'limit': limit.value,
            'keyword': searchValue.value,
            'popular_product': true,
            'page': page
        });
}

const previousPage = async () => {
    currentPage.value--;
    getPopularProducts(currentPage.value);
}

const nextPage = async () => {
    currentPage.value++;
    getPopularProducts(currentPage.value);
}

watch(searchValue, async (newValue, oldValue) => {
    currentPage.value = 1;
    await getPopularProducts();
});

watch(limit, async (newValue, oldValue) => {
    currentPage.value = 1;
    await getPopularProducts();
});

onMounted(async () => {
    getPopularProducts();
});
</script>
<template>
    <ItemContainer>
        <template #heading>
            <FilterPage @filters="handleSearch" :hideSorting="true" />
            <h4 class="py-3 text-capitalize">Popular {{ productHeading }}</h4>
        </template>

        <template #content>
            <div v-if="dataNotFound">
                {{ dataNotFound }}
            </div>
            <div v-else>
                <div class="row">
                    <div class="col-lg-3 col-xxl-3 col-md-6 col-sm-12 mb-4" v-for="(data, index) in popularProducts" :key="index">
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