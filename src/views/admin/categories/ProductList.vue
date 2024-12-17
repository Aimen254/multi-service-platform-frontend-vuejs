<script setup>
import { ref, watch } from 'vue'

import Table from '@components/core/Table.vue'
import TableFilters from '@components/core/TableFilters.vue'
import Pagination from '@components/core/Pagination.vue'
import { onBeforeMount } from 'vue';
import { useProductApi } from '@composables/products.js'
import { useModuleSettings } from '@composables/modules';
const { getProducts, meta, products, dataNotFound } = useProductApi()
const { showCompany, author, showPrice, priceTitle, showLocation, itemContainerValidator, singularProductTitle, bookmarkProductsUserTitle } = useModuleSettings()

import { useTagStore } from '@/stores/tags'
const tagStore = useTagStore()

import { useRoute } from 'vue-router';
const route = useRoute();

const limit = ref(10);
const searchValue = ref('');
const currentPage = ref(1);

import { useHelper } from '@composables/helper';
const { truncate, getImage, removeHtml, resetStringFormat } = useHelper();

const productsList = async (page = 1) => {
    try {
        await getProducts(route.params?.levelOneslug, {
            level_two_tag: route.params.levelTwoSlug,
            level_three_tag: route.params.levelThreeSlug,
            level_four_tag: route.params.levelFourSlug,
            limit: limit.value,
            keyword: searchValue.value,
            page: page,
            with_user_address: true,
            from: route.params.from ?? null,
            to: route.params.to ?? null,
            min_price: route.params.min_price ?? null,
            max_price: route.params.max_price ?? null,
        })
    } catch (error) {
        console.log(error);
    }
}

const previousPage = async () => {
    currentPage.value--;
    await productsList(currentPage.value)
}

const nextPage = async () => {
    currentPage.value++;
    await productsList(currentPage.value)
}

const changeValue = (data) => {
    if (data.limit) {
        limit.value = data.limit;
    } else {
        searchValue.value = data.search;
    }
}

const setOwner = (owner) => {
    owner.type = 'business'
    userStore.saveOwner(owner)
}

watch(
    limit,
    (newValue, oldValue) => {
        productsList()
    }
);

watch(searchValue, (newValue, oldValue) => {
    productsList()
});

watch(
    () => route.params,
    (newParams, oldParams) => {
        route.name == 'admin-category' ? productsList() : null;
    }
);

onBeforeMount(() => {
    productsList()
})
</script>
<template>
    <div class="mb-4">
        <Table>
            <template #filters>
                <TableFilters @filters="changeValue" />
            </template>
            <template #content>
                <thead class="table-light">
                    <tr>
                        <th v-if="showCompany && !itemContainerValidator('hideAndShowBusiness')">{{ author }}</th>
                        <th>{{ singularProductTitle }}</th>
                        <th v-if="itemContainerValidator('productType')">Type</th>
                        <th v-if="showPrice">{{ priceTitle }}</th>
                        <th v-if="showLocation && !itemContainerValidator('hideAndShowBusiness')">Location</th>
                        <th v-if="itemContainerValidator('productYear')">Year</th>
                        <th>Category</th>
                        <th v-if="itemContainerValidator('bookmarkProductsUser')">{{ bookmarkProductsUserTitle }}</th>
                    </tr>
                </thead>
                <tbody class="table-border-bottom-0">
                    <tr v-if="dataNotFound" class="text-center">
                        <td colspan="5" class="pt-4">
                            {{ dataNotFound }}
                        </td>
                    </tr>
                    <tr v-for="(product, index) in  products " :key="index">
                        <td v-if="showCompany && !itemContainerValidator('hideAndShowBusiness')">
                            <router-link v-if="product?.business" @click="setOwner(product.business)"
                                :to="{ name: 'owner-level-one', params: { name: product.business?.slug, levelOneslug: tagStore.getLevelOneTagSlug } }"
                                class="text-inherit">
                                <div class="d-flex">
                                    <div class="avatar flex-shrink-0 me-3">
                                        <img :src=getImage(product.business?.logo) :alt="author" class="rounded" />
                                    </div>
                                    <span class="d-flex align-items-center">{{ truncate(product.business?.name)
                                    }}</span>
                                </div>
                            </router-link>
                        </td>
                        <td :class="[!showCompany ? 'w-40' : '']">
                            <RouterLink
                                :to="{ name: 'artical-detail', params: { uuid: product?.uuid, levelOneslug: tagStore?.getLevelOneTagSlug } }"
                                class="d-flex text-inherit">
                                <div class="avatar flex-shrink-0 me-3"
                                    v-if="(!showCompany || itemContainerValidator('hideAndShowBusiness')) && !itemContainerValidator('noMainImage')">
                                    <img :src=getImage(product.main_image) alt="product" class="rounded" />
                                </div>
                                <span class="d-flex align-items-center" v-if="product.name">
                                    {{ truncate(product.name, 50) }}
                                </span>
                                <span class="d-flex align-items-center" v-else
                                    v-html="truncate(removeHtml(product.description))">
                                </span>
                            </RouterLink>
                        </td>
                        <td :class="[!itemContainerValidator('productName') ? 'w-30' : '']" class="text-capitalize"
                            v-if="itemContainerValidator('productType')">
                            {{ product?.vehicle ? product?.vehicle?.type : resetStringFormat(product.type) }}
                        </td>
                        <td v-if="showPrice">
                            ${{ product.price }}
                        </td>
                        <td v-if="itemContainerValidator('productYear')">
                            {{ product?.vehicle?.year }}
                        </td>
                        <td v-if="showLocation && !itemContainerValidator('hideAndShowBusiness')">
                            {{ truncate(product?.business?.address) }}
                        </td>
                        <td :class="[!showCompany && tagStore.getLevelOneTagSlug !== 'taskers' ? 'w-30' : '']">
                            {{ product.level_two_tag?.name }}
                        </td>
                        <td v-if="itemContainerValidator('bookmarkProductsUser')" :class="[!showCompany ? 'w-30' : '']">
                            {{ product.user?.name }}
                        </td>
                    </tr>
                </tbody>
            </template>
            <template #pagination>
                <Pagination class="px-4 mt-2" :meta="meta" @previousPage="previousPage" @nextPage="nextPage" />
            </template>
        </Table>
    </div>
</template>
