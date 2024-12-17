<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useTagStore } from '@stores/tags';
import { useProductApi } from '@composables/products';
import { useRoute } from 'vue-router';
import FilterPage from '@components/core/FilterPage.vue'
import ProductCard from '@components/core/ProductCard.vue';
import ItemContainer from '@components/general/ItemContainer.vue';
import Pagination from '@components/core/Pagination.vue';
import { useModuleSettings } from '@composables/modules.js'

const limit = ref(12);
const currentPage = ref(1);
const searchValue = ref('');
const order = ref('desc');
const featuredProducts = ref(null);
const tagStore = useTagStore();
const route = useRoute();
const getType = ref(null);
const { productHeading } = useModuleSettings();


const { meta, getProducts, dataNotFound } = useProductApi();


const productType = computed(() => {
    switch (getType.value) {
        case 'for-sale':
            return 'For Sale';
        case 'for-rent':
            return 'For Rent';
        default:
            return '';
    }
});

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

const getFeaturedProducts = async (type, page = 1) => {
    featuredProducts.value = await getProducts(tagStore.getLevelOneTagId,
        {
            'is_featured': true,
            'limit': limit.value,
            'keyword': searchValue.value,
            'order': order.value,
            'page': page,
            'level_two_tag': route.params && route.params.tag ? route.params.tag : null,
            'type': type,
            with_user_address: true
        });
}

const previousPage = async () => {
    currentPage.value--;
    getFeaturedProducts(getType.value, currentPage.value);
}

const nextPage = async () => {
    currentPage.value++;
    getFeaturedProducts(getType.value, currentPage.value);
}

watch(searchValue, async (newValue, oldValue) => {
    featuredProducts.value = null;
    currentPage.value = 1;
    await getFeaturedProducts(getType.value);
});

watch(order, async (newValue, oldValue) => {
    featuredProducts.value = null;
    currentPage.value = 1;
    await getFeaturedProducts(getType.value);
});

watch(limit, async (newValue, oldValue) => {
    featuredProducts.value = null;
    currentPage.value = 1;
    await getFeaturedProducts(getType.value);
});

onMounted(async () => {
    getType.value = route.params && route.params.type ? route.params.type : null;
    getFeaturedProducts(getType.value);
});
</script>
<template>
    <ItemContainer>
        <template #heading>
            <h4 class="text-capitalize">Featured {{ productHeading }} {{ productType }}</h4>
            <FilterPage @filters="handleSearch" />
        </template>

        <template #content>
            <div v-if="dataNotFound">
                {{ dataNotFound }}
            </div>
            <div v-else>
                <div class="row">
                    <div class="col-lg-3 col-xxl-3 col-md-6 col-sm-12 mb-4" v-for="(data, index) in featuredProducts" :key="index">
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