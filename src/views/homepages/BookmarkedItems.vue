<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useFavoriteProudctsStore } from "@/stores/favoriteProducts"
import { useTagStore } from '@stores/tags';
import ItemContainer from '@components/general/ItemContainer.vue';
import ProductCard from '@components/core/ProductCard.vue';
import Pagination from '@components/core/Pagination.vue';
import { useWishlist } from '@composables/wishlist';
import PageFilter from '@components/core/PageFilter.vue';
import { useModuleSettings } from '@composables/modules';
import { useRoute } from 'vue-router';
import { useHelper } from '@composables/helper';
import PostsDetail from '@components/general/PostsDetail.vue';

const route = useRoute()
const { wishlist, dataNotFound } = useWishlist();
const { getLevelOneTagId, getLevelOneTagSlug, removeLevelTwoTag, removeLevelThreeTag, removeLevelFourTag } = useTagStore();
const favoriteProductsStore = useFavoriteProudctsStore();
const { productHeading, itemContainerValidator } = useModuleSettings();
const { resetStringFormat } = useHelper()

const limit = ref(12);
const searchValue = ref('');
const order = ref('desc');
const getType = ref(null);

const productType = computed(() => {
    switch(getType.value) {
        case 'for-sale':
            return 'For Sale';
        case 'for-rent':
            return 'For Rent';
        default:
            return '';
    }
});

const getWishList = async (type = null) => {
    favoriteProductsStore.removeFavoriteProducts();
    await wishlist({
        limit: limit.value,
        keyword: searchValue.value,
        page: favoriteProductsStore.getMeta.current_page,
        type: 'product',
        module: getLevelOneTagId,
        order: order.value,
        with_user_address: true,
        listing_type: type,
        level_two_tag: route.params?.levelTwoslug
    }, 'product');
}

const previousPage = async () => {
    favoriteProductsStore.removeFavoriteProducts()
    favoriteProductsStore.getMeta.current_page--
    await getWishList(getType.value);
}

const nextPage = async () => {
    favoriteProductsStore.removeFavoriteProducts()
    favoriteProductsStore.getMeta.current_page++
    await getWishList(getType.value);
}

const handleSearch = async (data) => {
    if (data) {
        if (data.search !== undefined) {
            searchValue.value = data.search;
        }
        if (data.limit !== undefined) {
            limit.value = data.limit;
        }
        if (data.order !== undefined) {
            order.value = data.order;
        }
        favoriteProductsStore.getMeta.current_page = 1;
        await getWishList(getType.value);
    }
}


onMounted(async () => {
    getType.value = route.params.type ? route.params.type : null;
    removeLevelTwoTag()
    removeLevelThreeTag()
    removeLevelFourTag()
    if (!itemContainerValidator.value('horizontalProductsLayout')) {
        await getWishList(getType.value);
    }
});
watch(
    async () => route.params,
    async (newParams, oldParams) => {
        if (route.name == 'bookmarks') {
            if (!itemContainerValidator.value('horizontalProductsLayout')) {
                await getWishList(getType.value);
            }
        }
    })
</script>


<template>
    <ItemContainer v-if="!itemContainerValidator('horizontalProductsLayout')">
        <template #heading>
            <h4 class="text-capitalize">Bookmarked {{ route.params?.levelTwoslug ? ' ' +
                resetStringFormat(route.params.levelTwoslug) : '' }} {{ productHeading }} {{ productType }}
            </h4>
            <PageFilter @filters="handleSearch" />
        </template>

        <template #content>
            <div v-if="dataNotFound">
                {{ dataNotFound }}
            </div>
            <div v-else>
                <div class="row">
                    <div v-if="route.params.type && route.params.type === 'for-sale'" class="col-lg-3 col-md-6 col-sm-12 mb-4" v-for="saleItem in favoriteProductsStore.getBookmarkedForSale"
                        :key="saleItem">
                        <ProductCard :product="saleItem.product" />
                    </div>
                    <div v-else-if="route.params.type && route.params.type === 'for-rent'" class="col-lg-3 col-md-6 col-sm-12 mb-4" v-for="rentItem in favoriteProductsStore.getBookmarkedForRent"
                        :key="-rentItem">
                        <ProductCard :product="rentItem.product" />
                    </div>
                    <div v-else class="col-lg-3 col-xxl-3 col-md-6 col-sm-12 mb-4" v-for="data in favoriteProductsStore.getFavoriteProducts"
                        :key="data">
                        <ProductCard :product="data.product" />
                    </div>
                </div>
                <div>
                    <Pagination :meta="favoriteProductsStore.getMeta" @previousPage="previousPage" @nextPage="nextPage" />
                </div>
            </div>
        </template>
    </ItemContainer>
    <div v-else>
        <PostsDetail :pageName="'bookmarked'" />
    </div>
</template>