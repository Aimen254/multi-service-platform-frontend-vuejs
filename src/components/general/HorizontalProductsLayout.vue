<script setup>
import { onMounted, ref, onBeforeMount, onBeforeUnmount, watch, inject } from 'vue'

// import components
import PostCard from '@components/core/PostCard.vue'
import PremiumCard from '@components/general/PremiumCard.vue'
import ConnectListCard from '@components/general/ConnectListCard.vue'
import CommentModel from './CommentModel.vue'

// import composeables
import { useHelper } from "@composables/helper"
import { useProductApi } from '@composables/products.js'
import { useWishlist } from '@/composables/wishlist.js'

// Stores Imports
import { useTagStore } from '@/stores/tags.js'
import { useUserStore } from '@stores/user.js'

// import route
import { useRoute } from 'vue-router'

// Composables
const { showLoading, hideLoading } = useHelper()
const { getProducts, meta } = useProductApi()
const { wishlist } = useWishlist()

// Stores
const tagStore = useTagStore()
const userStore = useUserStore()

// route
const route = useRoute()

const eventBus = inject('eventBus')
const displayAdBar = ref(false)
const previousScrollPosition = ref(0);
const isLoadingMore = ref(false);
const productsList = ref([])
const favoriteBusiness = ref([])

const props = defineProps({
    levelTwoTag: String,
    levelThreeTag: String,
    levelFourTag: String
})

// get posts/products
const getPosts = async (page = 1) => {
    const newProducts = await getProducts(tagStore.getLevelOneTagSlug, {
        limit: 10,
        level_two_tag: props.levelTwoTag,
        level_three_tag: props.levelThreeTag,
        level_four_tag: props.levelFourTag,
        [localStorage.getItem('business') ? 'business_slug' : userStore.getOwner?.type === 'business' ? 'business_slug' : 'user_id']: localStorage.getItem('business') ? localStorage.getItem('business') : userStore.getOwner?.type === 'business' ? userStore.getOwner?.slug : userStore.getOwner?.id,
        with_user_address: true,
        page: page
    });
    productsList.value.push(...newProducts);
}

const getFavoriteBusiness = async () => {
    favoriteBusiness.value = await wishlist({ limit: 4, type: 'business', module: tagStore.getLevelOneTagSlug }, 'business', false)
}

const filterPostsByBusiness = async (e) => {
    productsList.value = []
    if (e.business) {
        localStorage.setItem('business', e.business?.slug)
    } else {
        localStorage.removeItem('business')
    }
    await getPosts()
}

onBeforeMount(() => {
    const mainSidebarStatus = localStorage.getItem("menu-collapsed");
    displayAdBar.value = mainSidebarStatus !== "true";

    // get favorite business
    if (route.name === 'level-one-page') {
        getFavoriteBusiness()
    }
})


const handleScroll = (e) => {
    const container = document.querySelector('.product-list-container');
    const scrollPosition = e.target.scrollTop || window.scrollY;

    // check if user scrolling down the window
    if (scrollPosition > previousScrollPosition.value) {
        const containerHeight = container.offsetHeight;
        const navbar = document.getElementById('nav-bar-contatiner')
        const tagContainer = document.getElementById('tag-container')
        const ownerContainer = document.getElementById('owner-container')
        const viewportHeight = window.innerHeight;
        var ownerContainerHieght = 0
        if (ownerContainer) {
            ownerContainerHieght = ownerContainer.offsetHeight + 50
        }

        const isNearBottom = scrollPosition + viewportHeight >= containerHeight + navbar.offsetHeight + tagContainer.offsetHeight + ownerContainerHieght + 100;
        if (isNearBottom && !isLoadingMore.value) {
            isLoadingMore.value = true;
            const page = meta.value.current_page + 1
            if (page <= meta.value.total_pages) {
                getPosts(page)
                    .finally(() => {
                        isLoadingMore.value = false;
                    });
            } else {
                isLoadingMore.value = false;
            }

        }
    }
    previousScrollPosition.value = scrollPosition
}

onMounted(async () => {
    if (route.name !== 'level-one-page') {
        localStorage.removeItem('business')
    }
    await getPosts()
    window.addEventListener('scroll', handleScroll);
})
onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});


</script>
<template>
    <div class="d-flex">
        <div :class="[route.name === 'level-one-page' ? 'w-60 padding-right-1-2-5' : 'w-100']">
            <div class="product-list-container">
                <PostCard v-for="product in productsList" :key="product" :product="product" />
            </div>
        </div>
        <div class="w-40" v-if="route.name === 'level-one-page'">
            <Transition :duration="550">
                <div>
                    <h5 class="text-capitalize">Favorite Departments</h5>
                </div>
            </Transition>
            <Transition :duration="550">
                <ConnectListCard @filter-posts="filterPostsByBusiness" :businesses="favoriteBusiness" />
            </Transition>
        </div>
    </div>
    <!-- comment popup modal -->
    <CommentModel />
</template>

<style></style>