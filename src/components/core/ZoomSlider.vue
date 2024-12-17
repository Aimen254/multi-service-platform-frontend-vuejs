<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { useTagStore } from '@stores/tags';
import { useUserStore } from '@stores/user';
import { useHelper } from '@composables/helper';
import { useRouter } from 'vue-router';
import { useWishlist } from '@/composables/wishlist.js'
import { useRoute } from 'vue-router'
import 'swiper/css';
import 'swiper/css/zoom';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { FreeMode, Navigation, Thumbs, Zoom } from 'swiper/modules';
import { useModuleSettings } from '@composables/modules'

const thumbsSwiper = ref(null);
const props = defineProps({
  product: Object,
});

const { addToWishlist, whlistProduct } = useWishlist()
const { formatDateTime } = useHelper();
const { itemContainerValidator, get } = useModuleSettings();
const route = useRoute();
const images = ref([]);
const productItem = ref(null)
const params = ref(null)
const tagStore = useTagStore();
const userStore = useUserStore();
const router = useRouter();
const { hideShowItemsOnProductCard, getApectRatio } = useModuleSettings()


onBeforeMount(async () => {
  const localSecondaryImages = [props.product.main_image, ...props.product.secondary_images];
  images.value = localSecondaryImages;
  await preloadImages(images.value);
});

const setThumbsSwiper = (swiper) => {
  thumbsSwiper.value = swiper;
};

const modules = [Zoom, FreeMode, Navigation, Thumbs];

async function preloadImages(imageUrls) {
  try {
    for (const imageUrl of imageUrls) {
      await loadImage(imageUrl);
    }
  } catch (error) {
    console.error('Failed to preload images:', error);
  }
}

async function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function getImageUrl(image) {
  if (typeof image === 'string') {
    return image;
  } else if (typeof image === 'object' && image.image) {
    return image.image;
  }
  return '';
}

const applyStyles = computed(() => (type = null) => {
  if (tagStore.getLevelOneTagSlug === 'marketplace' && type == 'main-image') {
    return { height: '640px', objectFit: 'contain' };
  } else if (tagStore.getLevelOneTagSlug === 'marketplace') {
    return { height: '230px', objectFit: 'contain' }
  }
});

const setLevelsInStore = (tag, level) => {
  const { level_one_tag, level_two_tag, level_three_tag, level_four_tag } = props.product;

  const removeTags = () => {
    tagStore.removeLevelTwoTag();
    tagStore.removeLevelThreeTag();
    tagStore.removeLevelFourTag();
    userStore.removeOwner();
  };

  removeTags();

  switch (level) {
    case "one":
      tagStore.saveLevelOneTag({
        levelOneTagId: tag.id,
        levelOneTagSlug: tag.slug
      });
      router.push({
        name: 'level-one-page',
        params: {
          levelOneslug: tag.slug,
        }
      });
      break;

    case "two":
      tagStore.saveLevelTwoTag({
        levelTwoTagId: tag.id,
        levelTwoTagSlug: tag.slug
      });
      router.push({
        name: 'level-two-page',
        params: {
          levelOneslug: level_one_tag.slug,
          levelTwoslug: level_two_tag.slug,
        }
      });
      break;

    case "three":
      tagStore.saveLevelTwoTag({
        levelTwoTagId: level_two_tag.id,
        levelTwoTagSlug: level_two_tag.slug
      });
      tagStore.saveLevelThreeTag({
        levelThreeTagId: tag.id,
        levelThreeTagSlug: tag.slug
      });
      router.push({
        name: 'level-three-page',
        params: {
          levelOneslug: level_one_tag.slug,
          levelTwoslug: level_two_tag.slug,
          levelThreeslug: tag.slug,
        }
      });
      break;

    default:
      tagStore.saveLevelTwoTag({
        levelTwoTagId: level_two_tag.id,
        levelTwoTagSlug: level_two_tag.slug
      });
      tagStore.saveLevelThreeTag({
        levelThreeTagId: level_three_tag.id,
        levelThreeTagSlug: level_three_tag.slug
      });
      tagStore.saveLevelFourTag({
        levelFourTagId: tag.id,
        levelFourTagSlug: tag.slug
      });
      router.push({
        name: 'level-four-page',
        params: {
          levelOneslug: level_one_tag.slug,
          levelTwoslug: level_two_tag.slug,
          levelThreeslug: level_three_tag.slug,
          levelFourslug: tag.slug,
        }
      });
  }
};

productItem.value = props.product

const emit = defineEmits();

const deleteFromBookmark = (id) => {
  emit("product-id", id);
}

const addProductTowishList = async (product, type) => {
  if (route.name == 'bookmarks') {
    deleteFromBookmark(product.id)
  } else {
    await addToWishlist(product, type, params.value)
    productItem.value.in_wishlist = whlistProduct.value
  }
}

const setOwner = (owner, type) => {
  owner.type = type
  userStore.saveOwner(owner)
}

</script>

<template>
  <div class="card" style="border-radius: 0px;">
    <div class="card-body py-4">
      <div class="">
        <div class="d-flex justify-content-between">

          <div class="d-flex">

            <!-- user avatar -->
            <div class="avatar rounded me-5 mb-5"
              v-if="productItem.user && !itemContainerValidator('productHasBusinessAndUser')">
              <router-link @click="setOwner(productItem.user, 'user')"
                :to="{ name: 'owner-level-one', params: { name: productItem.user?.name, levelOneslug: route?.params?.levelOneslug } }">

                <img :src="productItem.user?.avatar" alt="User" class="rounded-circle owner-image-dimenssions" />
              </router-link>
            </div>

            <!-- business avatar -->
            <div class="avatar rounded me-5" v-if="productItem.business">
              <router-link @click="setOwner(productItem.business, 'business')"
                :to="{ name: 'owner-level-one', params: { name: productItem.business?.slug, levelOneslug: route?.params?.levelOneslug } }">

                <img :src="productItem.business?.logo" alt="Owner" class="rounded owner-image-dimenssions" />
              </router-link>
            </div>

            <div class="me-5 rounded-top"
              :class="[productItem.user && !itemContainerValidator('productHasBusinessAndUser') ? 'mt-1' : '']">
              <h4 class="top mb-2" v-if="productItem.name">{{ productItem.name }} <span
                  v-if="itemContainerValidator('price')"> -
                  <span class="text-primary">${{ product?.price }}<span
                      v-if="hideShowItemsOnProductCard('priceType')">/<span class="fs-6">{{ productItem?.price_type
                        }}</span></span></span></span></h4>
              <div>
                <div v-if="!itemContainerValidator('hideAuthorInfo')">
                  <div v-if="!itemContainerValidator('productHasBusinessAndUser')">
                    <router-link
                      @click="setOwner(productItem.business ? productItem.business : productItem.user, productItem.business ? 'business' : 'user')"
                      :to="{ name: 'owner-level-one', params: { name: productItem.business ? productItem.business?.slug : productItem.user.name, levelOneslug: route?.params?.levelOneslug } }"
                      class=" author-link">
                      <strong>{{ productItem.business ? productItem.business?.name : productItem.user?.name }} -
                      </strong>
                    </router-link>

                    <span class="text-muted">{{ formatDateTime(productItem.created_at) }}</span>
                  </div>
                  <div v-else>
                    <router-link @click="setOwner(productItem.user, 'user')"
                      :to="{ name: 'owner-level-one', params: { name: productItem.user?.name, levelOneslug: route?.params?.levelOneslug } }"
                      class=" author-link">
                      <strong v-if="!itemContainerValidator('excludeName')">{{ productItem.user?.name }}</strong>
                    </router-link>
                  </div>
                </div>
                <div :class="[!itemContainerValidator('organization') ? 'my-1' : '']">
                  <span class="cursor-pointer" @click="setLevelsInStore(productItem.level_one_tag, 'one')"> {{
                productItem.level_one_tag?.name }} </span> <b> . </b>
                  <span class="cursor-pointer" @click="setLevelsInStore(productItem.level_two_tag, 'two')"> {{
                productItem.level_two_tag?.name }} </span> <b> . </b>
                  <span class="cursor-pointer" @click="setLevelsInStore(productItem.level_three_tag, 'three')"> {{
                productItem.level_three_tag?.name }} </span> <b> . </b>
                  <span class="cursor-pointer" @click="setLevelsInStore(productItem.level_four_tag, 'four')"> {{
                productItem.level_four_tag?.name }} </span>
                </div>
              </div>
            </div>
          </div>

          <i v-if="!itemContainerValidator('horizontalProductsLayout')"
            class="menu-icon mx-3 my-1 ms-auto tf-icons bx bx-bookmark cursor-pointer"
            :class="{ 'bookmark-color bx bxs-bookmark': product.in_wishlist }"
            @click="addProductTowishList(productItem, 'product')"></i>
          <i class="fs-4 cursor-pointer" :class="[productItem.in_wishlist ? 'bx bxs-heart' : 'bx bx-heart']"
            @click="addProductTowishList(productItem, 'product')" v-else></i>
        </div>
      </div>
    </div>
  </div>
  <div v-if="!itemContainerValidator('noMainImage')">
    <swiper :style="{
                ' --swiper-navigation-color': '#fff', '--swiper-pagination-color': '#fff',
              }" :zoom="true" :spaceBetween="10" :navigation="true" :thumbs="{ swiper: thumbsSwiper }"
      :modules="modules" class="mySwiper2">
      <swiper-slide v-for="(image, index) in    images   " :key="index">
        <div class="swiper-zoom-container">
          <img :src="getImageUrl(image)" :style="{ 'aspect-ratio': getApectRatio('product') }" />
        </div>
      </swiper-slide>
    </swiper>
    <swiper @swiper="setThumbsSwiper" :spaceBetween="15" :slidesPerView="4" :freeMode="true" :watchSlidesProgress="true"
      :modules="modules" class="mySwiper">
      <swiper-slide v-for="(   image, index   ) in    images   " :key="index">
        <img :src="getImageUrl(image)" :style="{ 'aspect-ratio': getApectRatio('product') }" />
      </swiper-slide>
    </swiper>
  </div>
</template>



<style scoped>
@import '@assets/scss/main.scss';

.swiper {
  height: 100% !important;
}

.swiper-zoom-container {
  width: 100%;
}

.active-section {
  color: #FF6846 !important;
}

@media (max-width: 1240px) {
  .avatar.rounded {
    margin-bottom: 3rem;
  }
}
</style>