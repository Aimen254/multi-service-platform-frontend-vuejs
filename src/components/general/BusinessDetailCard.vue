<script setup>
import { ref, onMounted } from 'vue';
import { useTagStore } from '@stores/tags';
import { useHelper } from '@composables/helper';
import { useUserStore } from '@stores/user'
import { useWishlist } from '@composables/wishlist'
import { useBusinessApi } from '@composables/business.js'
import { useModuleSettings } from '@composables/modules';
import { useBusinessStore } from '@stores/business'
import { useRoute } from 'vue-router';

const props = defineProps({
    business: Object,
    user: Object
});

const route = useRoute()
const { getImage } = useHelper();
const businessProfile = ref(null);
const userStore = useUserStore();
const { viewBusiness } = useBusinessApi()
const tagStore = useTagStore();
const { addToWishlist, whlistProduct } = useWishlist();
const { itemContainerValidator, getApectRatio } = useModuleSettings();
const showDetails = ref(false);

const businessStore = useBusinessStore()

const Wishlist = async (business) => {
    await addToWishlist(business, 'business');
    businessProfile.value.in_wishlist = whlistProduct.value;
}

const toggleDetails = () => {
    showDetails.value = !showDetails.value;
}

const setOwner = (owner, type) => {
    owner.type = type
    userStore.saveOwner(owner)
}

onMounted(async () => {
    if (!props.business) {
        if (route?.name === 'owner-level-one') {
            businessStore.removeBusinessDetail()
        } else {
            businessProfile.value = businessStore.getBusinessDetail
        }
        if (!businessProfile.value) {
            businessProfile.value = await viewBusiness(tagStore.getLevelOneTagId, userStore.getOwner?.uuid)
        }
    } else {
        businessProfile.value = props.business
        showDetails.value = !!props.business;
    }
})

</script>

<template>
    <div class="row">
        <div class="col-12" v-if="businessProfile">
            <div class="card mb-4">
                <div class="row" v-if="business">
                    <div class="col-lg-4 col-md-12">
                        <div class="d-flex justify-content-between align-items-center">
                            <div v-if="business">
                                <img :src="businessProfile.logo" alt="business image"
                                    class="d-block h-auto ms-0 ms-sm-4 mt-4 rounded user-profile-img "
                                    style="height: 6.375rem; width: 6.375rem; " />
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-8 col-md-12 mobile d-flex align-items-center justify-content-end pe-3 mt-3">
                        <router-link v-if="business" @click="setOwner(business, 'business')"
                            :to="{ name: 'owner-level-one', params: { name: business?.slug, levelOneslug: route?.params?.levelOneslug } }"
                            class="btn btn-outline-primary mx-2">
                            View Details
                        </router-link>
                        <a href="javascript:void(0)" class="btn btn-primary text-nowrap me-3"
                            @click="Wishlist(businessProfile)">
                            {{ businessProfile.in_wishlist ? 'Remove From Bookmark' : 'Bookmark' }}
                        </a>
                    </div>
                    <div class="col-12">
                        <div class="user-profile-info d-flex justify-content-between ms-4 mt-3">
                            <h4 :class="[!business ? 'mb - 1' : 'mb-3']">{{ businessProfile.name }}</h4>
                            <div class="pe-3">
                                <router-link v-if="itemContainerValidator('productHasBusinessAndUser')"
                                    @click="setOwner(user, 'user')"
                                    :to="{ name: 'owner-level-one', params: { name: user?.name, levelOneslug: route?.params?.levelOneslug } }"
                                    class="me-1">
                                    View Broker's Agent
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="user-profile-header-banner" v-if="!business">
                    <img :src="businessProfile.banner" alt="Banner image" class="rounded-top author-banner"
                        :style="{ 'aspect-ratio': getApectRatio('banner') }" />
                </div>
                <div class="user-profile-header d-flex flex-column flex-sm-row text-sm-start text-center mb-2"
                    v-if="!business">

                    <div class="flex-shrink-0 mt-n5 ms-sm-4 mx-auto author-avatar rounded">
                        <img :src="businessProfile.logo" alt="business logo" class="d-block w-100 ms-0"
                            style="border-radius: 0.06rem;" />
                    </div>
                    <div class="flex-grow-1 mt-3 mt-sm-5">
                        <div
                            class="d-flex align-items-md-end align-items-sm-start align-items-center justify-content-md-between justify-content-start mx-4 flex-md-row flex-column gap-4">
                            <div class="user-profile-info">
                                <h4 :class="{ 'mb-1': !business }">{{ businessProfile.name }}</h4>
                            </div>
                            <div>
                                <a href="javascript:void(0)" class="btn btn-outline-primary mx-2 text-nowrap"
                                    @click="toggleDetails" v-if="!business">
                                    {{ showDetails ? 'Hide Details' : 'View Details' }}
                                </a>
                                <router-link @click="setOwner(business, 'business')"
                                    :to="{ name: 'owner-level-one', params: { name: business?.slug, levelOneslug: route?.params?.levelOneslug } }"
                                    class="btn btn-outline-primary mx-2" v-else>
                                    View Details
                                </router-link>
                                <a href=" javascript:void(0)" class="btn btn-primary text-nowrap"
                                    @click="Wishlist(businessProfile)">
                                    {{ businessProfile.in_wishlist ? `Remove From ${route.params?.levelOneslug ===
            'government' ? 'Favorite' : 'Bookmark'}` : route.params?.levelOneslug ===
                'government' ? 'Favorite' : 'Bookmark'
                                    }}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row px-4" v-if="showDetails">
                    <div class="col-12 d-flex align-items-center mb-2" v-if="itemContainerValidator('businessRating')">
                        <div>
                            <i class='menu-icon tf-icons bx bxs-star text-primary fs-3'></i>
                        </div>
                        <div class="ms-2">
                            {{ `Rated ${businessProfile.reviews_avg} out of 5` }}
                        </div>
                    </div>
                    <div class="col-12"
                        v-if="businessProfile?.phone && !itemContainerValidator('horizontalProductsLayout') && !itemContainerValidator('hidePhoneNo')">
                        <p>
                            <i class=" menu-icon tf-icons bx bxs-phone me-2"></i>
                            {{ businessProfile?.phone }}
                        </p>
                    </div>
                    <div class="col-12"
                        v-if="!itemContainerValidator('horizontalProductsLayout') && !itemContainerValidator('hidePhoneNo')">
                        <p>
                            <i class=" menu-icon tf-icons bx bxs-map cursor-pointer"></i>
                            {{ businessProfile?.address }}
                        </p>
                    </div>
                    <div class="col-12">
                        <p v-html="businessProfile.short_description"></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>