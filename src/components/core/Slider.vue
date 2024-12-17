
<script setup>
import { useHelper } from '@composables/helper';
import { onMounted, ref } from 'vue';
const { truncate, formatDateTime } = useHelper();
import { useWishlist } from '@/composables/wishlist.js'
import { useTagStore } from '@/stores/tags.js'
import { useModuleSettings } from '@composables/modules.js'

const tagStore = useTagStore()
const { addToWishlist, whlistProduct } = useWishlist()
const { getApectRatio } = useModuleSettings();
import { useRoute } from 'vue-router'
const route = useRoute();
const images = ref([])
const productItem = ref(null)
const params = ref(null)

const props = defineProps({
    product: Object
})
productItem.value = props.product
images.value.push(productItem.value.main_image)
productItem.value.secondary_images.forEach(element => {
    images.value.push(element.image)
});

const addProductTowishList = async (product, type) => {
    await addToWishlist(product, type, params.value)
    productItem.value.in_wishlist = whlistProduct.value
}

onMounted(() => {
    if (route.name == 'level-one-page') {
        params.value = {
            limit: 4,
            type: 'product',
            module: tagStore.getLevelOneTagSlug
        }
    }
})

</script>
<template>
    <div class="card primary-headline-border h-100" v-if="productItem">
        <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
            <ol class="carousel-indicators">
                <li v-for="(image, index) in images" :key="image" data-bs-target="#carouselExample"
                    :data-bs-slide-to="index" :class="{ 'active': index === 0 }"></li>
            </ol>
            <div class="carousel-inner">
                <div class="carousel-item h-100" v-for="(image, index) in images" :key="image"
                    :class="{ 'active': index === 0 }">
                    <router-link
                        :to="{ name: 'artical-detail', params: { uuid: productItem.uuid, levelOneslug: tagStore.getLevelOneTagSlug } }">
                        <img class="d-block w-100 primary-headline-img" :src="image" :alt="'Slide ' + (index + 1)" :style="{ 'aspect-ratio': getApectRatio('product') }"/>
                    </router-link>
                </div>
            </div>
            <a class="carousel-control-prev d-none" href="#carouselExample" role="button" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </a>
            <a class="carousel-control-next d-none" href="#carouselExample" role="button" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </a>
        </div>
        <div class="card-body">
            <div class="card-title header-elements">
                <span class="text d-flex">
                    <strong class="mx-1">Author - </strong>
                    <span class="text-muted">{{ productItem.user.name
                    }}</span>
                    <i class="menu-icon mx-3 my-1 tf-icons bx bx-bookmark cursor-pointer"
                        :class="{ 'bookmark-color bx bxs-bookmark': productItem.in_wishlist }"
                        @click="addProductTowishList(product, type = 'product')"></i>
                </span>
                <div class="card-header-elements ms-auto">

                    <div class="card-header-elements ms-auto">
                        <span class="text d-flex">
                            <strong class="mx-1">Date -</strong>
                            <span class="text-muted">{{ formatDateTime(productItem.created_at) }}</span>
                        </span>
                    </div>
                </div>
            </div>
            <router-link
                :to="{ name: 'artical-detail', params: { uuid: product.uuid, levelOneslug: tagStore.getLevelOneTagSlug } }">
                <h4 class="text">{{ productItem.name }}</h4>
            </router-link>
            <!-- <p class="card-text" v-html="truncate(productItem.description, 150)"></p> -->
        </div>
    </div>
</template>
<style scoped>
.carousel-inner {
    width: 100%;
    height: 440px;
}

.carousel-inner div img {
    width: 100%;
    height: 100%;
}
</style>



