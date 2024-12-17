<script setup>
// System & Libraries Imports
import { ref, watch, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';

// Components Imports
import ItemContainer from '@components/general/ItemContainer.vue';
import ProductCard from '@components/core/ProductCard.vue';
import Pagination from '@components/core/Pagination.vue';
import FeaturedCard from '@components/general/FeaturedCard.vue'
import FeaturedContainer from '@components/general/FeaturedContainer.vue'
import BusinessCard from '@components/core/BusinessCard.vue'

// Composables Imports
import { useToastr } from '@/composables/toastr';
import { useTagsApi } from '@composables/tagLevels';
import { useBusinessApi } from '@composables/business.js'
import { useModuleSettings } from '@composables/modules.js'
import { useProductApi } from '@composables/products.js'

// Helpers Import 
import { useHelper } from '@composables/helper.js'

// Stores Imports
import { useTagStore } from '@stores/tags';
import { useProductsStore } from '@stores/products'

// System & Libraries
const route = useRoute();

// Composables
const { toast } = useToastr();
const { meta, levelFourTags, levelThreeAuthors } = useTagsApi();
const { getBusinesses, businesses } = useBusinessApi()
const { author, showFeaturedBusiness, itemContainerValidator, productHeading } = useModuleSettings()
const { getProducts } = useProductApi()

import HorizontalProductsLayout from '@components/general/HorizontalProductsLayout.vue'

// Helpers
const { resetStringFormat } = useHelper()

// Stores
const tagStore = useTagStore();
const productStore = useProductsStore()

// Data Properties
const limit = ref(3);
const tags = ref([]);
const users = ref([]);
const currentPage = ref(1);


const levelFourProducts = async (page = 1) => {
    try {
        const levelOneTagId = tagStore.getLevelOneTagId;
        const levelTwoTagSlug = tagStore.getLevelTwoTagSlug;
        let params = {
            limit: limit.value,
            withProducts: true,
            page: page,
            productLimit: 4,
            unique_users: showFeaturedBusiness() ? itemContainerValidator.value('featuredAgents') ? true : false : true,
            with_user_address: true,
            withBusiness: itemContainerValidator.value('featuredAgents') ? true : false
        };
        if (tagStore.getLevelOneTagSlug == 'taskers') {
            params.getLevelTags = true;
        }
        tags.value = await levelFourTags(levelOneTagId, levelTwoTagSlug, route.params.levelThreeslug, params, true);
        users.value = levelThreeAuthors.value;

    } catch (error) {
        toast(error, 'error');
    }
}
const previousPage = async () => {
    currentPage.value--;
    await levelFourProducts(currentPage.value);
}

const nextPage = async () => {
    currentPage.value++;
    await levelFourProducts(currentPage.value);
}

const setLevelsInStore = (tag) => {
    const levelFourTagId = tag.id;
    const levelFourTagSlug = tag.slug;
    tagStore.removeLevelFourTag()
    tagStore.saveLevelFourTag({ levelFourTagId, levelFourTagSlug });
}

// get featured providers
const getFeaturedBusiness = async () => {
    await getBusinesses(tagStore.getLevelOneTagSlug, {
        is_featured: true,
        withLevelTwoTags: true,
        level_two_tag: route.params?.levelTwoslug,
        level_three_tag: route.params?.levelThreeslug,
        limit: 4
    })
}

// get featured products by type 
const featuredProducts = async (type = null) => {
    await getProducts(tagStore.getLevelOneTagSlug, { level_two_tag: route.params.levelTwoslug, level_three_tag: route.params.levelThreeslug, is_featured: true, limit: 4, with_user_address: true, type: type });
}


watch(
    () => route.params,
    async (newParams, oldParams) => {
        if (route?.name == 'level-three-page') {
            productStore.removeProducts()
            if (!itemContainerValidator.value('horizontalProductsLayout')) {
                if (showFeaturedBusiness()) {
                    await getFeaturedBusiness()
                }
                if (itemContainerValidator.value('featuredProductsByType')) {
                    await featuredProducts('for-sale')
                    await featuredProducts('for-rent')
                }
                if (itemContainerValidator.value('events')) {
                    await featuredProducts()
                }

                await levelFourProducts()
            }
        }
    }
);


onBeforeMount(async () => {
    productStore.removeProducts()
    if (!itemContainerValidator.value('horizontalProductsLayout')) {
        if (showFeaturedBusiness()) {
            await getFeaturedBusiness()
        }
        if (itemContainerValidator.value('featuredProductsByType')) {
            await featuredProducts('for-sale')
            await featuredProducts('for-rent')
        }

        if (itemContainerValidator.value('events')) {
            await featuredProducts()
        }
        await levelFourProducts();
    }

});
</script>

<template>
    <div>
        <div v-if="!itemContainerValidator('horizontalProductsLayout')">
            <!-- featured business section -->
            <div v-if="businesses.length > 0">
                <ItemContainer>
                    <template #heading>
                        <div class="d-flex mb-3 my-4 justify-content-between align-items-center">
                            <h4 class="text-capitalize  ">Featured
                                {{ resetStringFormat(route.params.levelThreeslug) + ' ' + author }}
                            </h4>
                            <router-link
                                :to="{ name: 'featured-businesses', params: { levelOneslug: tagStore?.getLevelOneTagSlug } }"
                                class="menu-link">
                                <div class="btn btn-outline-primary  mb-2" data-i18n="Featured">View All</div>
                            </router-link>
                        </div>
                    </template>

                    <template #content>
                        <div class="row mb-2">
                            <div class="col-lg-3 col-xxl-3 col-md-6 col-sm-12 mb-4 " v-for="business in businesses"
                                :key="business">
                                <BusinessCard :business="business" />
                            </div>
                        </div>
                    </template>
                </ItemContainer>
            </div>

            <!-- featured users -->
            <FeaturedContainer v-if="itemContainerValidator('featuredUsersLevelThree')">

                <template #header>
                    <h4 class="text-capitalize mt-4">
                        {{ itemContainerValidator('featuredAgents') ? `Featured
                        ${resetStringFormat(route.params.levelThreeslug)} Agents` : `Featured ${(author)}` }}
                    </h4>
                </template>

                <template #content>
                    <div class="row">
                        <div class="col-md-4" v-for="product in levelThreeAuthors" :key="product.id">
                            <FeaturedCard :product="product" :type="'user'" />
                        </div>
                    </div>
                </template>
            </FeaturedContainer>

            <!-- featured products/listings for sale -->
            <div v-if="itemContainerValidator('featuredProductsByType')">
                <ItemContainer>

                    <template #heading>
                        <div class="d-flex mb-3 my-4 justify-content-between align-items-center"
                            v-if="productStore.getFeaturedProductsForSale.length > 0">
                            <h4 class="text-capitalize">
                                Featured {{ resetStringFormat(route.params?.levelThreeslug) + ' ' + productHeading }}
                                For
                                Sale
                            </h4>
                            <router-link
                                :to="{ name: 'featured', params: { levelOneslug: tagStore?.getLevelOneTagSlug, type: 'for-sale', tag: route.params.levelTwoslug, l3Tag: route.params.levelThreeslug } }"
                                class="menu-link">
                                <div class="btn btn-outline-primary  mb-2" data-i18n="Featured">View All</div>
                            </router-link>
                        </div>
                    </template>

                    <template #content>
                        <div class="row mb-2">
                            <div class="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4"
                                v-if="productStore.getFeaturedProductsForSale.length > 0"
                                v-for="product in productStore.getFeaturedProductsForSale" :key="index">
                                <ProductCard :product="product" />
                            </div>
                        </div>
                    </template>
                </ItemContainer>
            </div>

            <!-- featured products/listings for rend -->
            <div v-if="itemContainerValidator('featuredProductsByType')">
                <ItemContainer>

                    <template #heading>
                        <div class="d-flex mb-3 my-4 justify-content-between align-items-center"
                            v-if="productStore.getFeaturedProductsForRent.length > 0">
                            <h4 class="text-capitalize">
                                Featured {{ resetStringFormat(route.params?.levelThreeslug) + ' ' + productHeading }}
                                For
                                Rent
                            </h4>
                            <router-link
                                :to="{ name: 'featured', params: { levelOneslug: tagStore?.getLevelOneTagSlug, type: 'for-rent', tag: route.params.levelTwoslug, l3Tag: route.params.levelThreeslug } }"
                                class="menu-link">
                                <div class="btn btn-outline-primary  mb-2" data-i18n="Featured">View All</div>
                            </router-link>
                        </div>
                    </template>

                    <template #content>
                        <div class="row mb-2">
                            <div class="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4"
                                v-if="productStore.getFeaturedProductsForRent.length > 0"
                                v-for="product in productStore.getFeaturedProductsForRent" :key="index">
                                <ProductCard :product="product" />
                            </div>
                        </div>
                    </template>
                </ItemContainer>
            </div>


            <div class="" v-if="itemContainerValidator('featured-events')">
                <ItemContainer>
                    <template #heading>
                        <div class="d-flex mb-3 my-4 justify-content-between align-items-center">
                            <h4 class="text-capitalize  ">
                                Featured {{ resetStringFormat(route.params?.levelThreeslug) + ' ' + productHeading }}
                            </h4>
                            <router-link
                                :to="{ name: 'featured', params: { levelOneslug: tagStore?.getLevelOneTagSlug, tag: route.params.levelTwoslug, l3Tag: route.params.levelThreeslug } }"
                                class="menu-link">
                                <div class="btn btn-outline-primary  mb-2" data-i18n="Featured">View All</div>
                            </router-link>
                        </div>
                    </template>

                    <template #content>
                        <div class="row mb-2">
                            <div class="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4"
                                v-if="productStore.getFeaturedProducts.length > 0"
                                v-for="product in productStore.getFeaturedProducts" :key="index">
                                <ProductCard :product="product" />
                            </div>

                        </div>
                    </template>
                </ItemContainer>
            </div>

            <div v-if="tags.length > 0">
                <ItemContainer v-for="tag in tags" :key="tag">

                    <template #heading>
                        <div>
                        </div>
                        <div class="py-3  d-flex justify-content-between align-items-center">
                            <h4 class="text-capitalize">{{ resetStringFormat(route.params.levelTwoslug) }} <b>.</b>
                                {{ resetStringFormat(route.params.levelThreeslug) }} <b>.</b>
                                {{ tag?.name }}
                            </h4>
                            <RouterLink
                                :to="{ name: 'level-four-page', params: { levelOneslug: tagStore.getLevelOneTagSlug, levelTwoslug: tagStore.getLevelTwoTagSlug, levelThreeslug: tagStore.getLevelThreeTagSlug, levelFourslug: tag.slug } }"
                                class="btn btn-outline-primary mb-2" @click="setLevelsInStore(tag)">
                                View All
                            </RouterLink>
                        </div>
                    </template>

                    <template #content>
                        <div class="row">
                            <div class="col-lg-3 col-xxl-3 col-md-6 col-sm-12 mb-4" v-for="product in tag.products"
                                :key="product">
                                <ProductCard :product="product" />
                            </div>
                        </div>
                    </template>
                </ItemContainer>
                <Pagination :meta="meta" @previousPage="previousPage" @nextPage="nextPage" />
            </div>

        </div>
        <div v-else>
            <HorizontalProductsLayout :levelTwoTag="tagStore.getLevelTwoTagSlug"
                :levelThreeTag="tagStore.getLevelThreeTagSlug" />
        </div>
    </div>
</template>