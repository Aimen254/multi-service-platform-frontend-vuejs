<script setup>
import { ref, computed, onMounted } from 'vue';
import { useFavoriteBusinessStore } from "@/stores/favoriteBusiness"
import { useTagStore } from '@stores/tags';
import ItemContainer from '@components/general/ItemContainer.vue';
import BusinessCard from '@components/core/BusinessCard.vue';
import Pagination from '@components/core/Pagination.vue';
import { useWishlist } from '@composables/wishlist';
import PageFilter from '@components/core/PageFilter.vue';
import { useModuleSettings } from '@composables/modules';

const { wishlist, dataNotFound } = useWishlist();
const { getLevelOneTagId, getLevelOneTagSlug } = useTagStore();
const favoriteBusinesssStore = useFavoriteBusinessStore();
const { author } = useModuleSettings();

const limit = ref(12);
const searchValue = ref('');
const order = ref('desc');

const getWishList = async (params) => {
    favoriteBusinesssStore.removeFavoriteBusiness();
    await wishlist(params, 'business');
}

const previousPage = async () => {
    favoriteBusinesssStore.removeFavoriteBusiness()
    favoriteBusinesssStore.getMeta.current_page--
    await getWishList({
        limit: limit.value,
        keyword: searchValue.value,
        page: favoriteBusinesssStore.getMeta.current_page,
        type: 'business',
        module: getLevelOneTagId,
        order: order.value
    });
}

const nextPage = async () => {
    favoriteBusinesssStore.removeFavoriteBusiness()
    favoriteBusinesssStore.getMeta.current_page++
    await getWishList({
        limit: limit.value,
        keyword: searchValue.value,
        page: favoriteBusinesssStore.getMeta.current_page,
        type: 'business',
        module: getLevelOneTagId,
        order: order.value
    });
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
        favoriteBusinesssStore.getMeta.current_page = 1;
        await getWishList({
            limit: limit.value,
            keyword: searchValue.value,
            page: favoriteBusinesssStore.getMeta.current_page,
            type: 'business',
            module: getLevelOneTagId,
            order: order.value
        });
    }
}


onMounted(async () => {
    await getWishList({
        limit: limit.value,
        page: favoriteBusinesssStore.getMeta.current_page,
        type: 'business',
        module: getLevelOneTagId,
        order: order.value
    });
});
</script>


<template>
    <ItemContainer>
        <template #heading>
            <h4 class="text-capitalize">Bookmarked {{ author }}</h4>
            <PageFilter @filters="handleSearch" />
        </template>

        <template #content>
            <div v-if="dataNotFound">
                {{ dataNotFound }}
            </div>
            <div v-else>
                <div class="row">
                    <div class="col-lg-3 col-xxl-3 col-md-6 col-sm-12 mb-4" v-for="data in favoriteBusinesssStore.getFavoriteBusiness"
                        :key="data">
                        <BusinessCard :business="data.business" />
                    </div>
                </div>
                <div>
                    <Pagination :meta="favoriteBusinesssStore.getMeta" @previousPage="previousPage" @nextPage="nextPage" />
                </div>
            </div>
        </template>
    </ItemContainer>
</template>