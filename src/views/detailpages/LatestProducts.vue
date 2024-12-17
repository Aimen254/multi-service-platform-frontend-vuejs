<script setup>
import { ref, inject, onMounted } from 'vue';
import { useTagStore } from '@stores/tags';
import { useTagsApi } from '@composables/tagLevels';
import ItemContainer from '@components/general/ItemContainer.vue';
import ProductCard from '@components/core/ProductCard.vue';
import { useModuleSettings } from '@composables/modules'
import { useRoute } from 'vue-router';
import { useHelper } from '@composables/helper';
import { useProductApi } from '@composables/products.js'
import PageFilter from '@components/core/PageFilter.vue';
import { useMessage } from "@composables/message.js"
import Pagination from '@components/core/Pagination.vue';

const route = useRoute()
const latest = ref([]);
const tagStore = useTagStore();
const { levelTwoTags, dataNotFound } = useTagsApi();
const eventBus = inject('eventBus')
const { productHeading } = useModuleSettings();
const { resetStringFormat } = useHelper()
const { getProducts, meta } = useProductApi()
const { recordNotFound } = useMessage()
const limit = ref(12);
const searchValue = ref('');
const currentPage = ref(1);
const setLevelsInStore = (tag) => {
    eventBus.emit('levelTwo', {
        tag: tag
    })
}


const getLatestProducts = async (page = 1) => {
    latest.value = await getProducts(tagStore.getLevelOneTagSlug, {
        level_two_tag: route.params.levelTwoslug,
        latest: true, with_user_address: true,
        limit: limit.value,
        keyword: searchValue.value,
        page: page
    })
}

const handleSearch = async (data) => {
    if (data) {
        if (data.search !== undefined) {
            searchValue.value = data.search;
        }
        if (data.limit !== undefined) {
            limit.value = data.limit;
        }
        getLatestProducts(1)
    }
}

const previousPage = async () => {
    currentPage.value--;
    await getLatestProducts(currentPage.value)
}

const nextPage = async () => {
    currentPage.value++;
    await getLatestProducts(currentPage.value)
}

onMounted(async () => {
    if (route.params?.levelTwoslug) {
        await getLatestProducts()
    } else {
        latest.value = await levelTwoTags(tagStore.getLevelOneTagId, { 'latest': true, 'withProducts': true, 'productLimit': 4 });
    }
});
</script>
<template>
    <ItemContainer v-if="route.params?.levelTwoslug">
        <template #heading>
            <h4 class="text-capitalize">Latest {{ route.params?.levelTwoslug ? ' ' +
                resetStringFormat(route.params.levelTwoslug) : '' }}
            </h4>
            <PageFilter @filters="handleSearch" :showOrder="true" />
        </template>
        <template #content>
            <div v-if="latest.length == 0">
                {{ recordNotFound() }}
            </div>
            <div v-else>
                <div class="row">
                    <div class="col-lg-3 col-xxl-3 mb-4 col-md-6 col-sm-12" v-for="(product, index) in latest" :key="index">
                        <ProductCard :product="product" />
                    </div>
                </div>
                <div>
                    <Pagination :meta="meta" @previousPage="previousPage" @nextPage="nextPage" />
                </div>
            </div>
        </template>
    </ItemContainer>

    <ItemContainer v-else>
        <template #heading>
            <h4 class="text-capitalize">Latest {{ productHeading }}</h4>
        </template>

        <template #content>
            <div v-if="dataNotFound">
                {{ dataNotFound }}
            </div>
            <div v-else>
                <div class="row" v-for="(tag, index) in latest" :key="index">
                    <div class="col-12 mb-2 py-3 d-flex align-items-center justify-content-between">
                        <h5 class="text-capitalize">{{ tag.name }}</h5>
                        <div class="btn btn-outline-primary mb-2" data-i18n="Featured" @click="setLevelsInStore(tag)">
                            View All
                        </div>
                    </div>
                    <div class="col-lg-3 col-xxl-3 mb-4 col-md-6 col-sm-12" v-for="(productData, index) in tag.products" :key="index">
                        <ProductCard :product="productData" />
                    </div>
                </div>
            </div>
        </template>
    </ItemContainer>
</template>