<script setup>
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useHelper } from '@composables/helper';
import StarRating from 'vue-star-rating';
import { useTagStore } from '@/stores/tags.js'
import { useUserStore } from '@/stores/user.js'
import { useModuleSettings } from '@composables/modules';
const userStore = useUserStore()
import { useWishlist } from '@/composables/wishlist.js'
const { addToWishlist, whlistProduct } = useWishlist()
const { itemContainerValidator, getApectRatio } = useModuleSettings();

const tagStore = useTagStore()
const { getImage } = useHelper();
const route = useRoute();
const params = ref(null)

const businessItem = ref(null)

const props = defineProps({
    business: Object
})

businessItem.value = props.business

const addBusinessTowishList = async (business, type) => {
    await addToWishlist(business, type, params.value)
    businessItem.value.in_wishlist = whlistProduct.value
}

const setOwner = (owner) => {
    const business = owner
    business.type = 'business';
    userStore.saveOwner(business)
}

onMounted(() => {
    if (route.name == 'level-one-page') {
        params.value = {
            limit: 4,
            type: 'business',
            module: tagStore.getLevelOneTagSlug
        }
    } else if (route.name == 'bookmark-businesses') {
        params.value = {
            limit: 12,
            type: 'business',
            module: tagStore.getLevelOneTagSlug
        }
    }
});
</script>

<style scoped>
.card-img-top {
    width: 100%;
}
</style>

<template>
    <div class="card h-100 product-card" v-if="businessItem">
        <!-- cover -->
        <router-link @click="setOwner(businessItem)"
            :to="{ name: 'owner-level-one', params: { name: businessItem.slug, levelOneslug: tagStore.getLevelOneTagSlug } }">
            <img class="img-fluid business-banner card-img-top"
                :src="getImage(businessItem?.secondary_banner, 'secondaryBanner')"
                :style="{ 'aspect-ratio': getApectRatio('businessImage') }" alt="Card image cap" />
        </router-link>

        <!-- logo -->
        <div class="flex-shrink-0 mt-n5 ms-sm-4 business-logo-avatar rounded border">
            <router-link @click="setOwner(businessItem)"
                :to="{ name: 'owner-level-one', params: { name: businessItem?.slug, levelOneslug: tagStore.getLevelOneTagSlug } }">
                <img :src="getImage(businessItem?.logo, 'avatar')" alt="user image"
                    class="d-block ms-0 rounded border w-100" :style="{ 'aspect-ratio': getApectRatio('logo') }" />
            </router-link>
        </div>

        <div class="card-body">

            <div class="d-flex justify-content-between">
                <!-- title -->
                <router-link @click="setOwner(businessItem)"
                    :to="{ name: 'owner-level-one', params: { name: businessItem?.slug, levelOneslug: tagStore.getLevelOneTagSlug } }">
                    <h5 class="mb-2">{{ businessItem?.name }}</h5>
                </router-link>

                <!-- bookmark option -->
                <div>
                    <i class="menu-icon my-1 tf-icons bx bx-bookmark cursor-pointer"
                        :class="{ 'bookmark-color bx bxs-bookmark': businessItem.in_wishlist }"
                        @click="addBusinessTowishList(businessItem, 'business')"></i>
                </div>
            </div>

            <!-- rating -->
            <div class="mb-2">
                <StarRating v-if="itemContainerValidator('businessRating')" :star-size="20"
                    :rating="businessItem?.reviews_avg" :show-rating="false" :read-only="true" active-color="#ff6846" />
            </div>

            <!-- level two tags -->
            <div class="mb-1">
                <span v-for="(tag, index) in businessItem?.level_two_tags" :key="tag">
                    <span v-if="index < 3">
                        {{ ' ' + tag.name + (businessItem?.level_two_tags?.length > 3 ? index < 2 ? ' .' : '' : index <
        businessItem?.level_two_tags?.length - 1 ? ' .' : '') }} </span>
                    </span>
            </div>

            <!-- separation -->
            <hr>

            <!-- address -->
            <div class="d-flex align-items-center">
                <i class='menu-icon tf-icons bx bxs-map cursor-pointer'></i>
                <span>{{ businessItem?.address }}</span>
            </div>

            <!-- phone -->
            <div class="d-flex align-items-center mt-2" v-if="itemContainerValidator('phone')">
                <i class='menu-icon tf-icons bx bxs-phone cursor-pointer'></i>
                <span>{{ businessItem?.phone }}</span>
            </div>
        </div>
    </div>
</template>