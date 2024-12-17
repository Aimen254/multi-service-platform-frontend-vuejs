<script setup>
import { ref, onBeforeMount, watch, onMounted, inject } from 'vue'
import { useTagsApi } from '@composables/tagLevels.js';
import BusinessDetailCard from '@components/general/BusinessDetailCard.vue';
import UserProfileHeader from '@components/general/UserProfileHeader.vue';
import { useToastr } from '@/composables/toastr'
import { useRoute } from 'vue-router'
import ItemContainer from '@components/general/ItemContainer.vue'
import { useTagStore } from '@stores/tags';
import ProductCard from '@components/core/ProductCard.vue';
import Pagination from '@components/core/Pagination.vue';
import { useUserStore } from '@stores/user';
import HorizontalProductsLayout from '@components/general/HorizontalProductsLayout.vue';
import FeaturedCard from '@components/general/FeaturedCard.vue';
import { useHelper } from '@composables/helper.js'
import HorizontalAdCard from '@components/general/HorizontalAdCard.vue';
import multiAd from '@/assets/images/Ads/multiAd.png';

import { useModuleSettings } from '@composables/modules.js'

const { itemContainerValidator, showFeaturedBusiness, userName } = useModuleSettings();

const { levelThreeTags, meta, levelTwoAuthors } = useTagsApi();
const limit = ref(6);
const currentPage = ref(1);
const route = useRoute();
const { toast } = useToastr();
const tagStore = useTagStore();
const tags = ref([]);
const eventBus = inject('eventBus')
const userStore = useUserStore()
const activeSection = ref('products');
const { resetStringFormat, isLevelPages } = useHelper()

const toggleSection = (section) => {
    activeSection.value = section;
}

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
        const response = await levelThreeTags(levelOneTagId, route.params?.levelTwoslug, { limit: limit.value, 'level-four-count': true, page: page, with_user_address: true, unique_users: itemContainerValidator.value('featuredAgents') ? true : false, productLimit: 4, [userStore.getOwner?.type === 'business' ? 'business' : 'user_id']: userStore.getOwner.id }, true);
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

onBeforeMount(async () => {
    if (!itemContainerValidator.value('horizontalProductsLayout')) {
        await levelThreePoducts();
    }
});

watch(
    () => route.params,
    (newParams, oldParams) => {
        if (route?.name == 'owner-level-two') {
            if (!itemContainerValidator.value('horizontalProductsLayout')) {
                levelThreePoducts()
            }
        }
    }
);

</script>

<template>
    <div>
        <!-- business card -->
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

        <!-- other modules or products layouts -->
        <div v-if="!itemContainerValidator('horizontalProductsLayout')  && activeSection === 'products'">
            <ItemContainer v-for="(tag,index) in tags" :key="tag">
                <template #heading>
                    <div class="py-3 d-flex justify-content-between align-items-center">
                        <h4 class="text-capitalize">
                            {{ resetStringFormat(route.params.levelTwoslug) }} <b>.</b> {{ tag.name }}
                        </h4>
                        <span class="btn btn-outline-primary mb-2" @click="setLevelsInStore(tag)">
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
                        <div v-show="isLevelPages(route.name) && !(route.params?.levelOneslug === 'obituaries')">
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

        <!-- posts layout -->
        <div v-if="itemContainerValidator('horizontalProductsLayout')">
            <HorizontalProductsLayout :levelTwoTag="tagStore.getLevelTwoTagSlug" />
        </div>

        <!-- show related users -->
        <div v-if="!itemContainerValidator('horizontalProductsLayout') && activeSection === 'users'">
            <ItemContainer>

                <template #heading>
                    <div class="py-3  d-flex justify-content-between align-items-center">
                        <h4 class="text-capitalize ">{{ userName }}</h4>
                    </div>
                </template>

                <template #content>
                    <div class="row mb-2">
                        <div class="col-lg-4 col-md-6 col-sm-12 mb-4" v-for="user in levelTwoAuthors" :key="user">
                            <FeaturedCard :product="user" type="user" />
                        </div>
                    </div>
                </template>
            </ItemContainer>
        </div>
    </div>
</template>

<style></style>