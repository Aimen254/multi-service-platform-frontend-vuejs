<script setup>
import { onMounted, ref, onBeforeMount, onBeforeUnmount, watch, inject } from 'vue'

// import components
import PostCard from '@components/core/PostCard.vue'
import PremiumCard from '@components/general/PremiumCard.vue'
import ConnectListCard from '@components/general/ConnectListCard.vue'
import { useWishlist } from '@composables/wishlist';

// import composeables
import { useHelper } from "@composables/helper"


// Stores Imports
import { useTagStore } from '@/stores/tags.js'
import { useUserStore } from '@stores/user.js'

// Composables
const { showLoading, hideLoading } = useHelper()
const { wishlist, dataNotFound, meta } = useWishlist();

// Stores
const tagStore = useTagStore()
const userStore = useUserStore()

const eventBus = inject('eventBus')
const displayAdBar = ref(false)
const previousScrollPosition = ref(0);
const isLoadingMore = ref(false);
const productsList = ref([])

const props = defineProps({
    pageName: String
})

// get posts/products
const getPosts = async (page = 1) => {
    const newProducts = await wishlist({
        limit: 10,
        page: page,
        type: 'product',
        module: tagStore.getLevelOneTagId,
    }, 'product');
    productsList.value.push(...newProducts);
}


onBeforeMount(() => {
    const mainSidebarStatus = localStorage.getItem("menu-collapsed");
    displayAdBar.value = mainSidebarStatus !== "true";
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
    const mainSidebarStatus = localStorage.getItem("menu-collapsed");
    displayAdBar.value = mainSidebarStatus !== "true";
    await getPosts()
    eventBus.on('sidebar-collaps', async (args) => {
        displayAdBar.value = args.displayAdBar
    })
    window.addEventListener('scroll', handleScroll);

    eventBus.on('remove-from-wishlist', async (args) => {
        productsList.value = []
        await getPosts()
    })
})
onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
    eventBus.off('sidebar-collaps'); // Remove the event listener
    eventBus.off('remove-from-wishlist') //remove event listener
});


</script>
<template>
    <div class="d-flex">
        <div :class="[!displayAdBar ? 'w-100 padding-right-1-2-5' : 'w-70 padding-right-1-2-5']">
            <div class="product-list-container">
                <PostCard class="mb-4" v-for="item in productsList" :key="item" :product="item.product" />
            </div>
        </div>
        <div :class="[!displayAdBar ? 'w-0' : 'w-30']" v-show="displayAdBar">
            <Transition :duration="550" v-if="!userStore.getOwner">
                <PremiumCard />
            </Transition>
            <Transition :duration="550">
                <ConnectListCard />
            </Transition>
        </div>
    </div>
</template>

<style></style>