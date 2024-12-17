<script setup>
import { ref, onMounted } from 'vue';
import { useProfileApi } from '@composables/profile';
import { useTagStore } from '@stores/tags';
import { useHelper } from '@composables/helper';
import { useUserStore } from '@stores/user'
import { useWishlist } from '@composables/wishlist'
import { useModuleSettings } from '@composables/modules'
import { useRoute } from 'vue-router';

const route = useRoute()
const props = defineProps({
    user: String,
});

const { getImage } = useHelper();
const userStore = useUserStore();
const { viewProfile } = useProfileApi();
const tagStore = useTagStore();
const { addToWishlist, whlistProduct } = useWishlist();
const { productHeading, itemContainerValidator, getApectRatio } = useModuleSettings();
const userProfile = ref(null);
const showDetails = ref(false);

const Wishlist = async (user) => {
    await addToWishlist(user);
    userProfile.value.in_wishlist = whlistProduct.value;
}

const toggleDetails = () => {
    showDetails.value = !showDetails.value;
}

const setOwner = (owner) => {
    owner.type = 'user'
    userStore.saveOwner(owner)
}

onMounted(async () => {
    if (!props.user) {
        userProfile.value = await viewProfile(userStore.getOwner.id, tagStore.getLevelOneTagId);
    } else {
        userProfile.value = props.user;
        showDetails.value = !!props.user;
    }
})

</script>
<template>
    <div class="row">
        <div class="col-12" v-if="userProfile">
            <div class="card my-4">
                <div class="row" v-if="user">
                    <div class="col-lg-3 col-md-3 col-12">
                        <div class="d-flex justify-content-between align-items-center">
                            <div v-if="props.user">
                                <img :src="getImage(userProfile.avatar, 'avatar')" alt="user image"
                                    class="d-block h-auto ms-0 ms-sm-4 mt-4  rounded user-profile-img "
                                    style="height: 6.375rem; width: 6.375rem; " />
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-9 col-md-12 col-12 mt-md-2 d-flex align-items-center justify-content-end pe-3 ">
                        <router-link v-if="props.user" @click="setOwner(props.user)"
                            :to="{ name: 'owner-level-one', params: { name: props.user?.name, levelOneslug: route.params?.levelOneslug } }"
                            class="btn btn-outline-primary mx-2">
                            View Details
                        </router-link>
                        <a href="javascript:void(0)" class="btn btn-primary text-nowrap me-3"
                            @click="Wishlist(userProfile)">
                            {{ userProfile.in_wishlist ? 'Remove From Bookmark' : 'Bookmark' }}
                        </a>
                    </div>
                    <div class="col-12">
                        <div class="ms-4 mt-3">
                            <h4 :class="'mb-1'">{{ userProfile.name }}</h4>
                        </div>
                    </div>
                </div>
                <div class="user-profile-header-banner" v-if="!props.user">
                    <img :src="getImage(userProfile.cover_img, 'cover')" alt="Banner image"
                        class="rounded-top author-banner" :style="{ 'aspect-ratio': getApectRatio('banner') }" />
                </div>
                <div class="user-profile-header d-flex flex-column flex-sm-row text-sm-start text-center mb-4"
                    v-if="!user">

                    <div class="flex-shrink-0 mt-n5 mx-sm-0 mx-auto">
                        <img :src="getImage(userProfile.avatar, 'avatar')" alt="user image"
                            class="d-block h-auto ms-0 ms-sm-4 rounded user-profile-img bg-white author-avatar" />
                    </div>
                    <div class="flex-grow-1 mt-3 mt-sm-5">
                        <div
                            class="d-flex align-items-md-end align-items-sm-start align-items-center justify-content-md-between justify-content-start mx-4 flex-md-row flex-column gap-4">
                            <div class="user-profile-info">
                                <h4 :class="{ 'mb-1': !props.user }">{{ userProfile.name }}</h4>
                            </div>
                            <div>
                                <a href="javascript:void(0)" class="btn btn-outline-primary mx-2 text-nowrap"
                                    @click="toggleDetails" v-if="!props.user">
                                    {{ showDetails ? 'Hide Details' : 'View Details' }}
                                </a>
                                <router-link @click="setOwner(props.user)"
                                    :to="{ name: 'owner-level-one', params: { name: props.user?.name, levelOneslug: route.params?.levelOneslug } }"
                                    class="btn btn-outline-primary mx-2" v-else>
                                    View Details
                                </router-link>
                                <a href="javascript:void(0)" class="btn btn-primary text-nowrap"
                                    @click="Wishlist(userProfile)">
                                    {{ userProfile.in_wishlist ? 'Remove From Bookmark' : 'Bookmark' }}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="showDetails">
                    <div class="row px-4 pt-4">
                        <div :class="itemContainerValidator('rowCol') ? 'col-lg-8' : 'col-lg-12'">
                            <div class="row" v-if="!itemContainerValidator('displayBusinessOnUserCard')">
                                <div class="col-xl-2 col-lg-4 col-md-6 heading">
                                    <h6>{{ `Total ${productHeading} :` }}</h6>
                                </div>
                                <div class="col-xl-9 col-lg-8 col-md-6">
                                    {{ userProfile.products_count }}
                                </div>
                            </div>
                            <div v-if="itemContainerValidator('displayBusinessOnUserCard')">
                                <h4 class="mb-1">{{ userProfile?.business?.name }}</h4>
                                <p>
                                    <span>Phone: {{ userProfile?.business?.phone }}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="row px-4 pb-4">
                        <div class="col-md-12">
                            <p v-html="userProfile.about"></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@media (max-width: 768px) {

    /* Tablet styles */
    .mobile {
        margin-top: 1.875rem;
        margin-left: -5.563rem;
    }

    .user-profile-info {
        margin-right: 23.813rem !important;
    }
}

@media (max-width: 576px) {

    /* Mobile styles */
    .user-profile-info {
        text-align: center;
    }
}

.heading {
    padding-top: 0.063rem;
}
</style>