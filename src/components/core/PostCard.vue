<script setup>
import { ref, inject, onMounted, onBeforeUnmount } from 'vue'
import { useHelper } from "@composables/helper";
import { useWishlist } from '@/composables/wishlist.js'
import { useUserStore } from '@/stores/user.js'
import { useRoute } from 'vue-router';
import { useModuleSettings } from '@composables/modules';

import { useTagStore } from '@/stores/tags.js'

const {  getApectRatio } = useModuleSettings();
const eventBus = inject('eventBus')

const { getImage } = useHelper();
const { addToWishlist, whlistProduct } = useWishlist();
const tagStore = useTagStore();
const userStore = useUserStore();
const route = useRoute();

const productItem = ref({});


const props = defineProps({
    product: Object,
})

productItem.value = props.product

const addProductTowishList = async (product, type) => {
    await addToWishlist(product, type)
    productItem.value.in_wishlist = whlistProduct.value
    if (productItem.value.in_wishlist) {
        productItem.value.likes_count += 1
    } else {
        productItem.value.likes_count -= 1
    }
    // call when book marked posts page is rendered
    eventBus.emit('remove-from-wishlist')
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

const addComment = (product) => {
    eventBus.emit('openCommentModal', {
        module: tagStore.getLevelOneTagSlug,
        product_id: product?.id,
    });
}

onMounted(() => {
    // increase comments count
    eventBus.on('comment-added', (args) => {
        if (productItem.value.id === args.productId) {
            productItem.value.comments_count += 1
        }
    })
})

onBeforeUnmount(() => {
    eventBus.off('comment-added'); // Remove the event listener
});

</script>
<template>
    <div class="card mb-4">
        <div class="card-header py-3 flex-grow-0">
            <div class="d-flex">
                <div v-if="productItem?.business" class="avatar flex-shrink-0 me-3 ">
                    <router-link
                        :to="{ name: 'owner-level-one', params: { name: productItem.business ? productItem.business?.slug : productItem.user.name, levelOneslug: tagStore.getLevelOneTagSlug } }"
                        @click="setOwner(productItem.business ? productItem.business : productItem.user, productItem.business ? 'business' : 'user')">
                        <img :src="getImage(productItem.business ? productItem.business.logo : productItem.user.avatar)"
                            :alt="author" class="rounded" />
                    </router-link>
                </div>
                <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-1">
                    <div class="me-2 post-card-description">
                        <div class="d-flex ">
                            <router-link v-if="productItem?.business"
                                :to="{ name: 'owner-level-one', params: { name: productItem.business ? productItem.business?.slug : productItem.user.name, levelOneslug: tagStore.getLevelOneTagSlug } }"
                                @click="setOwner(productItem.business ? productItem.business : productItem.user, productItem.business ? 'business' : 'user')">
                                <h5 class="mb-0">
                                    {{ productItem.business ? productItem.business.name : productItem.user.name }}
                                </h5>
                            </router-link>
                            <div class="ms-3">
                                <p class="mb-0">{{ productItem.time_since_creation }}</p>
                            </div>
                        </div>
                        <div @click="setLevelsInStore(productItem.level_two_tag)" class="cursor-pointer text-capitalize ">
                            {{ productItem.level_two_tag?.slug }}
                        </div>
                        <router-link
                            :to="{ name: 'artical-detail', params: { uuid: productItem.uuid, levelOneslug: tagStore.getLevelOneTagSlug } }">
                            <p class="text-muted mb-0 truncate-text-3" v-html="productItem.description"></p>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
        <router-link v-if="productItem.main_image"
            :to="{ name: 'artical-detail', params: { uuid: productItem.uuid, levelOneslug: tagStore.getLevelOneTagSlug } }">
            <img class="img-fluid post-card-image" :src="getImage(productItem.main_image)" alt="Post Image" :style="{ 'aspect-ratio': getApectRatio('businessCardImageRatio') }">
        </router-link>
        <div class="card-body py-3">
            <div class="container">
                <div class="row justify-content-between">
                    <a href="javascript:;" class="col-2 text-muted d-flex justify-content-start">
                        <i class="me-1 fs-4" :class="[productItem.in_wishlist ? 'bx bxs-heart' : 'bx bx-heart']"
                            @click="addProductTowishList(productItem, type = 'product')"></i>
                        <span>{{ productItem.likes_count }}</span>
                    </a>
                  <a href="javascript:;" class="col text-muted d-flex justify-content-center">
                    <i class="me-1 fs-4" :class="[productItem.in_wishlist ? 'bx bxs-bookmark' : 'bx bx-bookmark']"
                       @click="addProductTowishList(productItem, type = 'product')"></i>
                    <span>{{ productItem.likes_count }}</span>
                  </a>
                    <a href="javascript:;" @click="addComment(productItem)"
                        class="col text-muted d-flex justify-content-center">
                        <i class="bx bx-message me-1 fs-4"></i>
                        <span>{{ productItem.comments_count }}</span>
                    </a>
                    <a href="javascript:;" class="col text-muted d-flex justify-content-center">
                        <i class='bx bx-show me-1 fs-4'></i>
                        <span>{{ productItem.views_count }}</span>
                    </a>
                    <a href="javascript:;" class="col-2 text-muted d-flex justify-content-end">
                      <i class="bx bx-share-alt me-1 fs-4"></i>
                      <span>share</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>