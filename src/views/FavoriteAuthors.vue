<script setup>
import { ref, watch, onBeforeMount } from 'vue';
import { useWishlist } from '@composables/wishlist';
import PageFilters from '@components/core/PageFilters.vue';
import ItemContainer from '@components/general/ItemContainer.vue';
import ProductCard from '@components/core/ProductCard.vue';
import Pagination from '@components/core/Pagination.vue';
import { useUserStore } from "@stores/user";
import { useTagStore } from "@stores/tags";
import { useModuleSettings } from '@composables/modules'

const { meta, wishlist, favoriteItems, dataNotFound } = useWishlist();
const { singularOwnerTitle } = useModuleSettings();
const userStore = useUserStore()
const tagStore = useTagStore()

const limitPerPage = ref(4)
const searchValue = ref('');
const currentPage = ref(1);
const order = ref('desc');

const setOwner = (owner) => {
    userStore.saveOwner(owner);
}


const getReporters = async (page = 1) => {
    userStore.removeFavoriteUsers();
    currentPage.value = page;
    await wishlist({
        type: 'user',
        limit: limitPerPage.value,
        keyword: searchValue.value,
        page: page,
        order: order.value,
        with_products: true,
        module: tagStore.getLevelOneTagId
    });
}

const filters = (data) => {
    if (data.search !== undefined) {
        searchValue.value = data.search;
    }
    if (data.limit) {
        limitPerPage.value = data.limit;
    }
    if (data.order) {
        order.value = data.order;
    }
}

const previousPage = async () => {
    currentPage.value--;
    await getReporters(currentPage.value);
}

const nextPage = async () => {
    currentPage.value++;
    await getReporters(currentPage.value);
}

watch(searchValue, async (newValue, oldValue) => {
    await getReporters();
});

watch(limitPerPage, async (newValue, oldValue) => {
    await getReporters();
});

watch(order, async (newValue, oldValue) => {
    await getReporters();
});

onBeforeMount(async () => {
    getReporters();
});
</script>
<template>
    <ItemContainer>
        <template #heading>
            <PageFilters @filters="filters" />
            <h4 class="py-3 text-capitalize">{{ `Favorite ${singularOwnerTitle}'s` }}</h4>
        </template>
        <template #content>
            <div v-if="dataNotFound">
                {{ dataNotFound }}
            </div>
            <div v-else>
                <div class="row" v-for="(data, index) in userStore.getFavoriteUsers" :key="index">
                    <div v-if="data?.user" class="col-12 mb-2 py-3 d-flex align-items-center justify-content-between">
                        <h4 class="text-capitalize">{{ data.user?.name }}</h4>
                        <router-link @click="setOwner(data.user)"
                            :to="{ name: 'owner-level-one', params: { name: data.user?.name, levelOneslug: tagStore.getLevelOneTagSlug } }"
                            class="btn btn-outline-primary  mb-2">View All</router-link>
                    </div>
                    <div class="col-lg-3 col-xxl-3 mb-4 col-md-6 col-sm-12" v-for="(productData, index) in data.user?.products"
                        :key="index">
                        <ProductCard :product="productData" />
                    </div>
                </div>
                <div class="mt-4">
                    <Pagination :meta="meta" @previousPage="previousPage" @nextPage="nextPage" />
                </div>
            </div>
        </template>
    </ItemContainer>
</template>