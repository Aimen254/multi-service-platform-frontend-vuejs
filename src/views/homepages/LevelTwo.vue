<script setup>
// System & Libraries Imports
import { ref, onBeforeMount, watch, inject, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Components Imports
import ItemContainer from '@components/general/ItemContainer.vue'
import ProductCard from '@components/core/ProductCard.vue';
import BusinessCard from '@components/core/BusinessCard.vue';
import FeaturedCard from '@components/general/FeaturedCard.vue'
import FeaturedContainer from '@components/general/FeaturedContainer.vue'
import Pagination from '@components/core/Pagination.vue';
import Slider from '@components/core/Slider.vue';

// Composables Imports
import { useTagsApi } from '@composables/tagLevels.js';
import { useToastr } from '@/composables/toastr'
import { useBusinessApi } from '@composables/business.js'
import { useModuleSettings } from '@composables/modules.js'
import { useProductApi } from '@composables/products.js'

// Helpers Import 
import { useHelper } from '@composables/helper.js'

// Stores Imports
import { useTagStore } from '@stores/tags';
import { useHeadlinesStore } from '@stores/headlines.js'
import { useProductsStore } from '@stores/products'
import { useMessage } from "@composables/message";

import HorizontalProductsLayout from '@components/general/HorizontalProductsLayout.vue'


// System & Libraries
const route = useRoute();
const eventBus = inject('eventBus');

// Composables
const { levelThreeTags, levelTwoAuthors, meta } = useTagsApi();
const { toast } = useToastr();
const { getBusinesses, businesses } = useBusinessApi()
const { author, showHeadlines, showFeaturedBusiness, itemContainerValidator, productHeading, toUpperCase } = useModuleSettings()
const { headlineProducts, getProducts } = useProductApi()
const { recordNotFound } = useMessage()

// Helpers
const { resetStringFormat } = useHelper()

// Stores
const tagStore = useTagStore();
const headlineStore = useHeadlinesStore()
const productStore = useProductsStore()

// Data Properties
const limit = ref(6);
const currentPage = ref(1);
const tags = ref([]);
const users = ref([]);


const previousPage = async () => {
    currentPage.value--;
    await levelThreePoducts(currentPage.value);
}

const nextPage = async () => {
    currentPage.value++;
    await levelThreePoducts(currentPage.value);
}


async function levelThreePoducts(page = 1) {
    try {
        tags.value = []
        const levelOneTagId = tagStore.getLevelOneTagId;
        let params = {
            limit: limit.value,
            'level-four-count': true,
            unique_users: showFeaturedBusiness() || itemContainerValidator.value('organization') ? itemContainerValidator.value('featuredAgents') ? true : false : true,
            page: page,
            productLimit: 4,
            with_user_address: true,
            withBusiness: itemContainerValidator.value('featuredAgents') ? true : false
        };
        if (tagStore.getLevelOneTagSlug == 'taskers') {
            params.getLevelTags = true;
        }
        const response = await levelThreeTags(levelOneTagId, route.params.levelTwoslug, params, true);
        users.value = levelTwoAuthors.value;
        tags.value = response;

    } catch (error) {
        toast(error, 'error');
    }
}


const setLevelsInStore = (tag) => {
    eventBus.emit('levelFour', {
        tag: tag
    })
}

const getHeadlines = async () => {
    await headlineProducts(tagStore.getLevelOneTagId, { level_two_tag: route.params?.levelTwoslug })
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
    await getProducts(tagStore.getLevelOneTagSlug, { level_two_tag: route.params.levelTwoslug, is_featured: true, limit: 4, with_user_address: true, type: type });
}

onBeforeMount(async () => {
    tagStore.removeLevelThreeTags()
    productStore.removeProducts()
    await headlineStore.removeHeadLines()
    if (!itemContainerValidator.value('horizontalProductsLayout')) {

        if (showHeadlines()) {
            await getHeadlines()
        }

        if (showFeaturedBusiness()) {
            await getFeaturedBusiness()
        }

        if (itemContainerValidator.value('events')) {
            await featuredProducts();
        }

        if (itemContainerValidator.value('featuredProductsByType')) {
            await featuredProducts('for-sale')
            await featuredProducts('for-rent')
        }

        await levelThreePoducts();
    }
});

watch(
    async () => route.params,
    async (newParams, oldParams) => {
        if (route?.name == 'level-two-page') {
            tagStore.removeLevelThreeTags()
            productStore.removeProducts()
            users.value = []
            if (!itemContainerValidator.value('horizontalProductsLayout')) {
                await headlineStore.removeHeadLines()

                if (showHeadlines()) {
                    await getHeadlines()
                }
                if (showFeaturedBusiness()) {
                    await getFeaturedBusiness()
                }


                if (itemContainerValidator.value('events')) {
                    await featuredProducts();
                }


                if (itemContainerValidator.value('featuredProductsByType')) {
                    await featuredProducts('for-sale')
                    await featuredProducts('for-rent')
                }

                await levelThreePoducts()
            }
        }
    }
);
</script>

<template>
    <div>
        <div v-if="!itemContainerValidator('horizontalProductsLayout')">
            <!--headline items -->
            <div class="row" v-if="headlineStore.getPrimaryHeadline">
                <div class=" col-md-7">
                    <div v-if="headlineStore.getPrimaryHeadline" class="h-100 primary-headline-padding-bottom">
                        <Slider :product="headlineStore.getPrimaryHeadline" />
                    </div>
                </div>
                <FeaturedContainer v-if="headlineStore.getSecondaryHeadline.length > 0">
                    <template #content>
                        <div class="col-md-5">
                            <div v-for="product in headlineStore.getSecondaryHeadline" :key="product.id">
                                <FeaturedCard :product="product" />
                            </div>
                        </div>
                    </template>
                </FeaturedContainer>
            </div>

            <!-- Featured Businesses Section -->
            <div v-if="businesses.length > 0">
                <ItemContainer>

                    <template #heading>
                        <div class="d-flex mb-3 my-4 justify-content-between align-items-center">
                            <h4 class="text-capitalize ">Featured {{ resetStringFormat(toUpperCase) + ' ' + author }}
                            </h4>
                            <router-link
                                :to="{ name: 'featured-businesses', params: { levelOneslug: tagStore?.getLevelOneTagSlug } }"
                                class="menu-link">
                                <div class="btn btn-outline-primary mb-2" data-i18n="Featured">View All</div>
                            </router-link>
                        </div>
                    </template>

                    <template #content>
                        <div class="row mb-2">
                            <div class="col-xxl-3 col-md-6 col-lg-3 col-sm-12 mb-4 " v-for="business in businesses"
                                :key="business">
                                <BusinessCard :business="business" />
                            </div>
                        </div>
                    </template>
                </ItemContainer>
            </div>

            <!-- Featured Users Section -->
            <FeaturedContainer v-if="users.length > 0 && itemContainerValidator('featuredAuthors')">

                <template v-slot:header>
                    <div class="py-3 d-flex justify-content-between align-items-center">
                        <h4 class="text-capitalize">{{ itemContainerValidator('featuredAgents') ? `Featured
                            ${resetStringFormat(route.params.levelTwoslug)} Agents` : `Featured ${(author)}` }}</h4>
                    </div>
                </template>

                <template #content>
                    <div class="row">
                        <div class="col-md-4" v-for="product in users" :key="product.id">
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
                            <h4 class="text-capitalize ">Featured
                                {{ resetStringFormat(route.params?.levelTwoslug) + ' ' + productHeading }} For Sale</h4>
                            <router-link
                                :to="{ name: 'featured', params: { levelOneslug: tagStore?.getLevelOneTagSlug, type: 'for-sale', tag: route.params.levelTwoslug, l3Tag: route.params.levelThreeslug } }"
                                class="menu-link">
                                <div class="btn btn-outline-primary  mb-2" data-i18n="Featured">View All</div>
                            </router-link>
                        </div>
                    </template>

                    <template #content>
                        <div class="row">
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
                            <h4 class="text-capitalize  ">Featured
                                {{ resetStringFormat(route.params?.levelTwoslug) + ' ' + productHeading }} For Rent</h4>
                            <router-link
                                :to="{ name: 'featured', params: { levelOneslug: tagStore?.getLevelOneTagSlug, type: 'for-rent', tag: route.params.levelTwoslug, l3Tag: route.params.levelThreeslug } }"
                                class="menu-link">
                                <div class="btn btn-outline-primary  mb-2" data-i18n="Featured">View All</div>
                            </router-link>
                        </div>
                    </template>

                    <template #content>
                        <div class="row">
                            <div class="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4"
                                v-if="productStore.getFeaturedProductsForRent.length > 0"
                                v-for="product in productStore.getFeaturedProductsForRent" :key="index">
                                <ProductCard :product="product" />
                            </div>
                        </div>
                    </template>
                </ItemContainer>
            </div>

            <!-- featured products -->
            <div v-if="itemContainerValidator('featured-products-LevelTwo')">
                <ItemContainer>

                    <template #heading>
                        <div class="d-flex mb-3 my-4 justify-content-between align-items-center">
                            <h4 class="text-capitalize  ">Featured
                                {{ resetStringFormat(route.params?.levelTwoslug) + ' ' + productHeading }}</h4>
                            <router-link
                                :to="{ name: 'featured', params: { levelOneslug: tagStore?.getLevelOneTagSlug, tag: route.params.levelTwoslug, l3Tag: route.params.levelThreeslug } }"
                                class="menu-link">
                                <div class="btn btn-outline-primary mb-2" data-i18n="Featured">View All</div>
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

            <ItemContainer v-for="tag in tagStore.getLevelThreeTags" :key="tag">

                <template #heading>
                    <div class="py-3 d-flex justify-content-between align-items-center">
                        <h4 class="text-capitalize">
                            {{ resetStringFormat(toUpperCase) }} <b>.</b> {{ tag?.name }} </h4>
                        <span class="btn btn-outline-primary mb-2" @click="setLevelsInStore(tag)">
                            View All
                        </span>
                    </div>
                </template>

                <template #content>
                    <div class="row">
                        <div class="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4" v-for=" product  in  tag.products "
                            :key="product">
                            <ProductCard :product="product" />
                        </div>
                    </div>
                </template>
            </ItemContainer>
            <div v-if="Object.keys(meta).length !== 0">
                <Pagination :meta="meta" @previousPage="previousPage" @nextPage="nextPage" />
            </div>
        </div>
        <div v-else>
            <HorizontalProductsLayout :levelTwoTag="tagStore.getLevelTwoTagSlug" />
        </div>
    </div>
</template>