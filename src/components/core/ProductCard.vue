<script setup>
// System & Libraries Imports
import { onMounted, ref, inject, computed } from 'vue';
import { useRoute } from 'vue-router'
import StarRating from 'vue-star-rating';

// Composables Imports
import { useHelper } from '@composables/helper';
import { useWishlist } from '@composables/wishlist.js'
import { useModuleSettings } from '@composables/modules.js'

// Stores Imports
import { useTagStore } from '@stores/tags.js'
import { useUserStore } from '@stores/user.js'

const props = defineProps({
    product: Object,
});
const route = useRoute();
const eventBus = inject('eventBus');

const { formatDateTime, resetStringFormat } = useHelper();
const { addToWishlist, whlistProduct } = useWishlist();
const { showRequestButton, requestBtnTitle, productTags, hideShowItemsOnProductCard, itemContainerValidator, priceAfterTitle, singularOwnerTitle, getApectRatio } = useModuleSettings();

const userStore = useUserStore();
const tagStore = useTagStore();

const productItem = ref({});
const params = ref(null);

productItem.value = props.product

const addProductTowishList = async (product, type) => {
    if (itemContainerValidator.value('bookmarkProductsByType')) {
        if (params.value) {
            params.value.listing_type = product.type
        }
    }
    await addToWishlist(product, type, params.value)
    productItem.value.in_wishlist = whlistProduct.value
    if (route.name == 'level-one-page') {
        if (tagStore.getLevelOneTagSlug == 'notices') {
            eventBus.emit('bookmark-tags-products')
        }
        if (itemContainerValidator.value('calendarEvents')) {
            eventBus.emit('bookmarked-events')
        }
    }
}

const setOwner = (owner, type) => {
    owner.type = type
    userStore.saveOwner(owner)
}

const setLevelsInStore = (tag) => {
    if (route.name !== 'level-two-page') {
        eventBus.emit('levelTwo', {
            tag: tag
        })
    }
}

const hasCurrentModule = computed(() => {
    switch (tagStore.getLevelOneTagSlug) {
        case 'marketplace':
        case 'automotive':
            return true;
        default:
            return false;
    }
})

const showBusinessDetails = computed(() => {
    let routesNames = ['owner-level-one', 'owner-level-two', 'owner-level-three', 'owner-level-four'];
    let moduleNames = ['real-estate'];
    let hideBusinessModules = ['events']
    if (routesNames.includes(route?.name) && !moduleNames.includes(tagStore.getLevelOneTagSlug)) {
        return false;
    }
    else if (hideBusinessModules.includes(route?.params?.levelOneslug)) {
        return false
    } else {
        return true
    }
})

onMounted(() => {
    if (route?.name == 'level-one-page') {
        params.value = {
            limit: 4,
            type: 'product',
            module: route?.params?.levelOneslug
        }
    } else if (route?.name == 'bookmarks') {
        params.value = {
            limit: 12,
            type: 'product',
            module: route?.params?.levelOneslug
        }
    } else if (route?.name == 'owner-level-one') {
        params.value = {
            limit: 4,
            type: 'product',
            module: route?.params?.levelOneslug,
            [userStore.getOwner?.type === 'business' ? 'business' : 'user_id']: userStore.getOwner.id
        }
    }
    function shouldBeRendered(attribute) {
        return true;
    }
})

</script>

<template>
    <div class="card h-100 w-100 product product-card">
        <!-- Product Mian Image -->
        <router-link
            :to="{ name: 'artical-detail', params: { uuid: productItem.uuid, levelOneslug: route?.params?.levelOneslug } }">
            <div class="d-flex justify-content-between author-link" v-if="!itemContainerValidator('noMainImage')">
                <img class="card-img-top" :src="productItem.main_image" alt="Card image cap"
                    :style="{ 'aspect-ratio': getApectRatio('product') }" />
            </div>
        </router-link>

        <div class="card-body"
            :class="{ 'pb-0': (itemContainerValidator('resumeModules') && route.name === 'owner-level-one') || hideShowItemsOnProductCard('bottomPadding') }">
            <div class="d-flex justify-content-between">
                <!-- Product Title -->
                <router-link v-if="productItem?.name" class="card-title-width"
                    :to="{ name: 'artical-detail', params: { uuid: productItem.uuid, levelOneslug: route?.params?.levelOneslug } }">
                    <h5 v-if="productItem.name" class="card-title truncate-text-6 card-title-line-height mb-2">{{
                productItem.name }}</h5>
                </router-link>

                <!-- Bookmark Icon Button -->
                <div>
                    <i class="menu-icon me-0 my-1 tf-icons bx bx-bookmark cursor-pointer"
                        v-if="!itemContainerValidator('description')"
                        :class="{ 'bookmark-color bx bxs-bookmark': productItem.in_wishlist }"
                        @click="addProductTowishList(productItem, type = 'product')"></i>
                </div>
            </div>

            <!-- event detail if exist -->
            <div v-if="productItem?.event?.id">
                <!-- price range -->
                <h5 class="card-title text-primary">
                    {{ '$' + productItem?.price }} - {{ '$' + productItem?.max_price }}
                </h5>
                <!-- performer nams -->
                <p class="mb-2">
                    {{ productItem?.event?.performer }}
                    <template v-if="productItem?.event?.away_team">
                        - {{ productItem?.event?.away_team }}
                    </template>
                </p>

                <!-- event date -->
                <p class="mb-2">{{ formatDateTime(productItem?.event?.event_date) }}</p>
                <!-- event location -->
                <p class="d-flex align-items-center mb-2">
                    <i class="menu-icon tf-icons bx bxs-map cursor-pointer"></i>
                    <span>
                        {{ productItem?.event?.event_location }}
                    </span>
                </p>
            </div>

            <!-- Product Condition -->
            <p v-if="itemContainerValidator('conditionTypeAttribute') && productItem?.condition?.name"
                class="card-title small">
                Condition: {{ productItem?.condition?.name }}
            </p>

            <div class="mb-3" v-if="itemContainerValidator('ratingAfterTitle')">
                <star-rating :star-size="20" v-model:rating="productItem.reviews_avg" :show-rating="false"
                    :read-only="true" active-color="#ff6846"></star-rating>
            </div>

            <!-- Product Price & Condition -->
            <div v-if="itemContainerValidator('price') && priceAfterTitle" class="d-flex"
                :class="hideShowItemsOnProductCard('type') ? 'justify-content-between' : 'justify-content-start'">

                <!-- price & price type -->
                <h5 class="card-title text-primary ">
                    {{ '$' + productItem?.price }}
                    <span v-if="hideShowItemsOnProductCard('priceType')">
                        /<small>{{ productItem?.price_type }}</small>
                    </span>
                </h5>
                <!-- product type -->
                <p class="small text-capitalize" v-if="hideShowItemsOnProductCard('type')">
                    {{ productItem.type ? resetStringFormat(productItem.type) : '' }}
                </p>
            </div>

            <!-- condition -->
            <p v-if="itemContainerValidator('conditionTypeProduct') && productItem?.vehicle?.type"
                class="small text-capitalize">
                Condition: {{ productItem?.vehicle?.type }}
            </p>
            <div class="d-flex">
                <!-- Display beds and baths in flex -->
                <template v-for="(attribute) in productItem.attributes" :key="attribute">
                    <div v-if="['bed', 'beds', 'baths', 'bath'].includes(attribute.slug) && attribute.standardTags?.length > 0"
                        class="pe-1 text-capitalize">
                        <span class="text-capitalize">{{ attribute.name }} {{ attribute.standardTags[0]?.name }}</span>
                    </div>
                </template>
            </div>

            <!-- Display square feet in the next line -->

            <template v-for="(attribute) in productItem.attributes" :key="attribute">
                <div v-if="['square-foot', 'square-feet'].includes(attribute.slug) && attribute.standardTags?.length > 0"
                    class="text-capitalize">
                    {{ attribute.name }} {{ attribute.standardTags[0]?.name }}</div>
            </template>

            <!-- Product Level Two Tag under product title -->
            <p v-if="productTags" @click="setLevelsInStore(productItem.level_two_tag)" class="mb-2 cursor-pointer">
                {{ productItem.level_two_tag?.name }}
            </p>

            <!-- Rating & Comments -->
            <div v-if="hideShowItemsOnProductCard('commentsAndRatings') && route?.params?.levelOneslug !== 'marketplace'"
                class="d-flex flex-wrap justify-content-between align-items-center mb-2">
                <div class="avatar flex-shrink-0 comments">
                    <star-rating :star-size="20" v-model:rating="productItem.reviews_avg" :show-rating="false"
                        :read-only="true" active-color="#ff6846"></star-rating>
                </div>
                <div class="d-flex align-items-center comments">
                    <i class='bx bxs-message-dots' style="font-size: 20px; margin-top: 5px; margin-right: 5px;"></i>
                    <span class="author-link comments">{{ productItem.comments_count }}
                    </span>
                </div>
            </div>

            <!-- Publish Date & Wishlist -->
            <div class="pb-2 mb-2"
                :class="[showBusinessDetails || hideShowItemsOnProductCard('displayHr') ? 'border-bottom' : '']"
                v-if="!itemContainerValidator('description')">
                <div class="d-flex align-items-center"
                    :class="hasCurrentModule ? 'justify-content-end' : 'justify-content-between'"
                    v-if="hideShowItemsOnProductCard('publishDateAndWishlist')">
                    <span v-if="hideShowItemsOnProductCard('publishDate')" class="publish-date">
                        {{ formatDateTime(productItem.created_at) }}
                    </span>
                </div>
                <div v-if="hideShowItemsOnProductCard('tagsUnderDate')" class="mt-2">
                    <span @click="setLevelsInStore(productItem.level_two_tag)" class="cursor-pointer">{{
                productItem.level_two_tag?.name }}</span> <span>{{ route?.params?.levelOneslug }}</span>
                </div>
            </div>

            <!-- Product Level Two Tag -->
            <p v-if="!productTags && !hideShowItemsOnProductCard('tagsUnderDate')"
                @click="setLevelsInStore(productItem.level_two_tag)" class="mb-2 cursor-pointer text-capitalize">
                {{ productItem.level_two_tag?.name }} {{ tagStore.getLevelThreeTagSlug }}
            </p>

            <!-- description -->
            <div v-if="productItem.description && itemContainerValidator('description')">
                <div class="d-flex justify-content-between">
                    <router-link class="product-description"
                        :to="{ name: 'artical-detail', params: { uuid: productItem.uuid, levelOneslug: route?.params?.levelOneslug } }">
                        <p v-html="productItem.description" class="truncate-text-6"></p>
                    </router-link>
                    <i class="menu-icon my-1 me-0 tf-icons bx bx-bookmark cursor-pointer"
                        :class="{ 'bookmark-color bx bxs-bookmark': productItem.in_wishlist }"
                        @click="addProductTowishList(productItem, type = 'product')"></i>
                </div>
                <div class="border-top mb-3 p-2" :class="!showBusinessDetails ? '' : 'border-bottom'">
                    <p>
                        {{ formatDateTime(productItem.created_at) }}
                    </p>
                    <p class="mb-0 cursor-pointer">
                        <span @click="setLevelsInStore(productItem.level_two_tag)">{{ productItem.level_two_tag?.name
                            }}</span> <span>{{ tagStore.getLevelThreeTagSlug }}</span>
                    </p>
                </div>
            </div>

            <!-- location / address -->
            <div class="mb-2 d-flex align-items-center"
                v-if="hideShowItemsOnProductCard('location') && showBusinessDetails">
                <div>
                    <i class="menu-icon tf-icons bx bxs-map cursor-pointer"></i>
                </div>
                <div>
                    <span>
                        {{ productItem?.user ? productItem.user.location?.address : productItem?.business.address }}
                    </span>
                </div>
            </div>

            <!-- Owner Details -->
            <div v-if="showBusinessDetails" class="owner-detail p-2 rounded ">
                <div v-if="!hideShowItemsOnProductCard('userWithBusiness')">
                    <div v-if="hideShowItemsOnProductCard('authorDetails')">
                        <span v-if="productItem.user">
                            <router-link @click="setOwner(productItem.user, 'user')"
                                :to="{ name: 'owner-level-one', params: { name: productItem.user?.name, levelOneslug: route?.params?.levelOneslug } }"
                                class="d-flex author-link align-items-center" rounded mx-1>
                                <div class=" avatar flex-shrink-0">
                                    <img class="rounded mx-1" :src="productItem.user?.avatar" />
                                </div>
                                <div class="ms-4">
                                    <span class="text-muted small" v-if="hideShowItemsOnProductCard('displayUsers')">{{
                singularOwnerTitle }}</span>
                                    <p class="mb-0 author-name text-dark-blue"><b>{{ productItem.user?.name }}</b></p>

                                    <!-- User Rating in Case of Marketplace -->
                                    <star-rating v-if="hideShowItemsOnProductCard('showRatings')" :star-size="20"
                                        v-model:rating="productItem.user.reviews_avg" :show-rating="false"
                                        :read-only="true" active-color="#ff6846"></star-rating>
                                </div>
                            </router-link>
                        </span>
                        <span v-else>
                            <router-link v-if="productItem?.business"
                                @click="setOwner(productItem.business, 'business')"
                                :to="{ name: 'owner-level-one', params: { name: productItem.business?.name, levelOneslug: route?.params?.levelOneslug } }"
                                class="d-flex author-link align-items-center">
                                <div class="avatar flex-shrink-0">
                                    <img class="rounded mx-1" :style="{ 'aspect-ratio': getApectRatio('logo') }"
                                        :src="productItem?.business?.logo ?? productItem?.business?.logo" />
                                </div>
                                <div class="ms-4">
                                    <span class="text-muted small">{{ singularOwnerTitle }}</span>
                                    <p class="mb-0 author-name text-dark-blue"><b>{{ productItem.business?.name }}</b>
                                    </p>
                                    <star-rating v-if="hideShowItemsOnProductCard('showRatings')" :star-size="20"
                                        v-model:rating="productItem.business.reviews_avg" :show-rating="false"
                                        :read-only="true" active-color="#ff6846"></star-rating>
                                </div>
                            </router-link>
                        </span>
                    </div>
                    <div v-else class="">
                        <div class="d-flex align-items-center" v-if="productItem.user">
                            <div class="p-1">
                                <i class='bx bxs-book-heart fs-4 d-flex align-items-center'>
                                    <span class="fs-6 p-2">Memories: {{ productItem.comments_count }}</span>
                                </i>
                            </div>
                        </div>
                        <div v-else class="">
                            <router-link v-if="productItem?.business"
                                @click="setOwner(productItem.business, 'business')"
                                :to="{ name: 'owner-level-one', params: { name: productItem.business?.slug, levelOneslug: route?.params?.levelOneslug } }"
                                class="d-flex author-link align-items-center">
                                <div class="rounded border avatar flex-shrink-0">
                                    <img class="rounded" :src="productItem.business?.logo" />
                                </div>
                                <div class="ms-3">
                                    <p class="mb-0 author-name fs-6 text-dark-blue"><b>{{ productItem.business?.name
                                            }}</b>
                                    </p>
                                    <star-rating v-if="itemContainerValidator('businessRating')" :star-size="20"
                                        :rating="productItem.business?.reviews_avg" :show-rating="false"
                                        :read-only="true" active-color="#ff6846"></star-rating>
                                </div>
                            </router-link>
                        </div>

                    </div>
                </div>
                <div v-else>
                    <!-- display agent with broker -->
                    <span v-if="productItem.user">
                        <div class="d-flex author-link align-items-center">
                            <div class=" avatar flex-shrink-0" v-if="userStore.getOwner?.type != 'user'">
                                <router-link @click="setOwner(productItem.user, 'user')"
                                    :to="{ name: 'owner-level-one', params: { name: productItem.user?.name, levelOneslug: route?.params?.levelOneslug } }"
                                    class="author-link">
                                    <img class="rounded mx-1" :src="productItem.user?.avatar" />
                                </router-link>
                            </div>
                            <div class=" avatar flex-shrink-0" v-else>
                                <router-link @click="setOwner(productItem.business, 'business')"
                                    :to="{ name: 'owner-level-one', params: { name: productItem.business?.slug, levelOneslug: route?.params?.levelOneslug } }"
                                    class="author-link">
                                    <img class="rounded" :src="productItem.business?.logo" />
                                </router-link>
                            </div>
                            <div class="ms-4">
                                <span class="text-muted small" v-if="itemContainerValidator('ownerType')">{{
                singularOwnerTitle }}</span>
                                <p class="mb-0 author-name text-dark-blue" v-if="userStore.getOwner?.type != 'user'">
                                    <router-link @click="setOwner(productItem.user, 'user')"
                                        :to="{ name: 'owner-level-one', params: { name: productItem.user?.name, levelOneslug: route?.params?.levelOneslug } }"
                                        class="author-link"> <b v-if="!userStore?.getOwner">{{ productItem.user?.name
                                            }}</b>
                                        <b
                                            v-if="itemContainerValidator('alterUserName') && (userStore?.getOwner && userStore?.getOwner?.type == 'business')">{{
                productItem.user?.first_name }}<br></b>
                                        <b
                                            v-if="itemContainerValidator('alterUserName') && (userStore?.getOwner && userStore?.getOwner?.type == 'business')">{{
                productItem.user?.last_name }}</b>
                                    </router-link>
                                </p>
                                <p class="mb-0" v-if="userStore.getOwner?.type != 'business'">
                                    <router-link @click="setOwner(productItem.business, 'business')"
                                        :to="{ name: 'owner-level-one', params: { name: productItem.business?.slug, levelOneslug: route?.params?.levelOneslug } }"
                                        class="author-link">
                                        {{ productItem.business.name }}
                                    </router-link>
                                </p>
                            </div>
                        </div>
                        <router-link @click="setOwner(productItem.user, 'user')"
                            :to="{ name: 'owner-level-one', params: { name: productItem.user?.name, levelOneslug: route?.params?.levelOneslug } }"
                            class="d-flex author-link align-items-center">

                        </router-link>
                    </span>
                </div>

            </div>
            <div class="d-flex align-items-center" style="font-size: 13px" v-if="hideShowItemsOnProductCard('DOB_DOD')">
                <div class="p-2">{{ productItem.date_of_birth }}</div>
                <div class="ms-auto p-2">{{ productItem.date_of_death }}</div>
            </div>
        </div>
        <!-- card footer -->
        <router-link
            :to="{ name: 'artical-detail', params: { uuid: productItem.uuid, levelOneslug: route?.params?.levelOneslug } }"
            class="btn btn-lg product-card-btn border-radius" v-if="showRequestButton">
            {{ requestBtnTitle }}
        </router-link>
    </div>
</template>

<style scoped>
@media (Max-width: 768px) {
    .card-img-top {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

}

.comments {
    cursor: default !important;
}

:deep(.vue-star-rating .vue-star-rating-star) {
    width: 18px !important;
}

/* .text-primary {
    color: inherit !important;
} */

@media only screen and (min-width: 992px) and (max-width: 1236px) {
    .justify-content-between {
        justify-content: space-between !important;
    }

    .d-flex {
        display: flex !important;
    }

}
</style>