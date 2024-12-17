<script setup>
import { ref, onBeforeMount, inject, watch } from 'vue'
import UserProfileHeader from '@components/general/UserProfileHeader.vue';
import BusinessDetailCard from '@components/general/BusinessDetailCard.vue';
import { useTagsApi } from '@composables/tagLevels.js';
import ItemContainer from '@components/general/ItemContainer.vue'
import { useTagStore } from '@stores/tags';
import ProductCard from '@components/core/ProductCard.vue';
import Pagination from '@components/core/Pagination.vue';
import { useUserStore } from '@stores/user.js'
import { useWishlist } from '@composables/wishlist.js'
import { useModuleSettings } from '@composables/modules.js'
import { useFavoriteProudctsStore } from "@/stores/favoriteProducts"
import HorizontalProductsLayout from '@components/general/HorizontalProductsLayout.vue'
import FeaturedCard from '@components/general/FeaturedCard.vue';
import { useRoute } from 'vue-router';
import HorizontalAdCard from '@components/general/HorizontalAdCard.vue';
import { useHelper } from "@composables/helper";
import multiAd from '@/assets/images/Ads/multiAd.png';
const { isLevelPages } = useHelper();

const { productHeading, showBookmarkedProducts, bookmarkedProductsExclude, itemContainerValidator, userName } = useModuleSettings();
const { wishlist } = useWishlist();
const favoriteProductsStore = useFavoriteProudctsStore();
const eventBus = inject('eventBus');
const tagStore = useTagStore();
const { levelTwoTags, meta, levelOneAuthors } = useTagsApi();
const limit = ref(6);
const currentPage = ref(1);
const tags = ref([]);
const userStore = useUserStore()
const activeSection = ref('products');
const route = useRoute();

const levelTwoProducts = async (page = 1) => {
    tags.value = []
    const response = await levelTwoTags(tagStore.getLevelOneTagId, { limit: limit.value, [userStore.getOwner?.type === 'business' ? 'business' : 'user_id']: userStore?.getOwner?.id, unique_users: itemContainerValidator.value('featuredAgents') ? true : false, withProducts: true, page: page, with_user_address: true, productLimit: 4, pagination: true });
    tags.value = response;
}

const toggleSection = (section) => {
    activeSection.value = section;
}

const previousPage = async () => {
    currentPage.value--;
    await levelTwoProducts(currentPage.value);
}

const nextPage = async () => {
    currentPage.value++;
    await levelTwoProducts(currentPage.value);
}

const setLevelsInStore = (tag) => {
    eventBus.emit('levelTwo', {
        tag: tag
    })
}

//get bookmarked products
const bookmarkedProducts = async () => {
    await wishlist({
        limit: 4,
        type: 'product',
        module: tagStore.getLevelOneTagSlug,
        with_user_address: true,
        [userStore.getOwner?.type === 'business' ? 'business' : 'user_id']: userStore?.getOwner?.id
    }, 'product')
}

watch(route, async () => {
    if (!(userStore.getOwner?.type === 'business') && !itemContainerValidator.value('horizontalProductsLayout') && tagStore.getLevelOneTagSlug == 'real-estate') {
        activeSection.value = "products";
    }

    await favoriteProductsStore.removeFavoriteProducts()
    await tagStore.removeTags()

    if (!itemContainerValidator.value('horizontalProductsLayout')) {
        if (bookmarkedProductsExclude()) {
            await bookmarkedProducts()
        }
        await levelTwoProducts();
    }
});


onBeforeMount(async () => {
    await favoriteProductsStore.removeFavoriteProducts()
    await tagStore.removeTags()
    if (!itemContainerValidator.value('horizontalProductsLayout')) {
        if (bookmarkedProductsExclude()) {
            await bookmarkedProducts()
        }
        await levelTwoProducts();
    }
});
</script>

<template>
    <div>
        <div id="owner-container">
            <UserProfileHeader v-if="userStore.getOwner?.type === 'user'" />
            <BusinessDetailCard v-if="userStore.getOwner?.type === 'business'" />
        </div>

        <div v-if="userStore.getOwner?.type === 'business' && !itemContainerValidator('horizontalProductsLayout') && tagStore.getLevelOneTagSlug == 'real-estate'"
            class="py-3">
            <button class="btn btn-outline-dark me-2" :class="{ 'btn btn-primary': activeSection === 'products' }"
                @click="toggleSection('products')">Listings</button>
            <button class="btn btn-outline-dark" :class="{ 'btn btn-primary': activeSection === 'users' }"
                @click="toggleSection('users')">All {{ userName }}</button>
        </div>

        <div v-if="!itemContainerValidator('horizontalProductsLayout') && activeSection === 'products'">
            <!-- display bookmarked items-->
            <ItemContainer
                v-if="favoriteProductsStore?.getFavoriteProducts.length > 0 && itemContainerValidator('storeOrAuthorBookmarked')">
                <template #heading>
                    <div class="py-3  d-flex justify-content-between align-items-center">
                        <h4 class="text-capitalize ">{{ `Bookmarked ${productHeading}` }}</h4>
                        <router-link :to="{ name: 'bookmarks', params: { levelOneslug: tagStore?.getLevelOneTagSlug } }"
                            class="menu-link">
                            <div class="btn btn-outline-primary  mb-2" data-i18n="Bookmarked">View All</div>
                        </router-link>
                    </div>
                </template>

                <template #content>
                    <div class="row mb-2">
                        <div class="col-lg-3 col-xxl-3 col-md-6 col-sm-12 mb-4"
                            v-for="favorite in favoriteProductsStore?.getFavoriteProducts" :key="favorite">
                            <ProductCard :product="favorite.product" />
                        </div>
                    </div>
                </template>
            </ItemContainer>

            <!-- display level two tags -->
            <ItemContainer v-for="(tag, index) in tagStore.getLevelTwoTags" :key="tag">
                <template #heading>
                    <div class="py-3 d-flex justify-content-between align-items-center" @click="setLevelsInStore(tag)">
                        <h4 class="text-capitalize">{{ tag.name }} </h4>
                        <span class="btn btn-outline-primary mb-2">
                            View All
                        </span>
                    </div>
                </template>

                <template #content>
                    <div class="row">
                        <div class="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4" v-for="product in tag.products"
                            :key="product">
                            <ProductCard :product="product" />
                        </div>
                    </div>
                    <div v-if="tagStore.getLevelTwoTags.length > 2 && (index + 1) % 2 === 0" class="col-xxl-12 col-lg-12 col-md-12 col-sm-12 mb-4">
                        <div v-show="!(route.params?.levelOneslug === 'obituaries')">
                            <Transition :duration="550">
                                <HorizontalAdCard class="card-container slide-fade" :imgsrc="multiAd" />
                            </Transition>
                        </div>
                    </div>
                </template>
            </ItemContainer>
            <div v-if="Object.keys(meta).length !== 0">
                <Pagination :meta="meta" @previousPage="previousPage" @nextPage="nextPage" />
            </div>
        </div>
        <div v-if="itemContainerValidator('horizontalProductsLayout')">
            <HorizontalProductsLayout />
        </div>

        <!-- show related users -->
        <div v-if="!itemContainerValidator('horizontalProductsLayout') && activeSection === 'users'">
            <ItemContainer>

                <template #heading>
                    <div class="py-3 d-flex justify-content-between align-items-center">
                        <h4 class="text-capitalize">{{ userName }}</h4>
                    </div>
                </template>

                <template #content>
                    <div class="row mb-2">
                        <div class="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4" v-for="user in levelOneAuthors"
                            :key="user">
                            <FeaturedCard :product="user" type="user" />
                        </div>
                    </div>
                </template>
            </ItemContainer>
        </div>
    </div>
</template>