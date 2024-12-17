<script setup>
import { computed, defineProps, inject, onBeforeMount } from 'vue';
import StarRating from 'vue-star-rating';
import { useUserStore } from '@/stores/user.js';
import { useWishlist } from '@/composables/wishlist.js';
import { useModuleSettings } from '@composables/modules.js'
import { useHelper } from "@composables/helper"

const userStore = useUserStore();
const { hideShowItemsOnProductCard, itemContainerValidator } = useModuleSettings()
const { resetStringFormat } = useHelper()

import { useTagStore } from '@/stores/tags.js'
const { product, type } = defineProps({
  product: Object,
  type: String
});



const productItem = ref(null);
productItem.value = product
const { addToWishlist, whlistProduct } = useWishlist()
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue';
const route = useRoute();
const params = ref(null)
const tagStore = useTagStore()
const eventBus = inject('eventBus');

const addProductTowishList = async (product, type) => {
  await addToWishlist(product, type, params.value)
  productItem.value.in_wishlist = whlistProduct.value
}
const setOwner = (owner, type) => {
  owner.type = type
  userStore.saveOwner(owner)
}

const setLevelOneTag = (levelOneId, levelOneSlug) => {
  const levelOneTagId = levelOneId
  const levelOneTagSlug = levelOneSlug
  tagStore.saveLevelOneTag({ levelOneTagId, levelOneTagSlug })
  tagStore.removeLevelTwoTag()
  tagStore.removeLevelThreeTag()
  tagStore.removeLevelFourTag()

  // remove owner
  userStore.removeOwner()
}

const setLevelsInStore = (tag) => {
  if (route.name !== 'level-two-page') {
    eventBus.emit('levelTwo', {
      tag: tag
    })
  }
}

// const goToLevelThreeTags = ({levelTwo, levelThree}) => {
//     eventBus.emit('regions', {
//         tag: levelThree,
//         levelTwoTag: levelTwo
//     })
// }

onMounted(() => {
  if (route.name == 'level-one-page') {
    params.value = {
      limit: 4,
      type: 'product',
      module: tagStore.getLevelOneTagSlug
    }
  } else if (route.name == 'bookmarks') {
    params.value = {
      limit: 12,
      type: 'product',
      module: tagStore.getLevelOneTagSlug
    }
  }
})

</script>

<template>
  <div class=" card card-deck  mb-3" :style="{ marginBottom: type === 'user' ? '0' : '20px' }">
    <div class="row">

      <div class="position-relative col-sm-4" v-if="type === 'user'">
        <router-link @click="setOwner(productItem, 'user')"
          :to="{ name: 'owner-level-one', params: { name: productItem?.name, levelOneslug: tagStore.getLevelOneTagSlug } }">
          <img :src="productItem.avatar" class="card-img fit-cover    h-100" alt="Avatar Image">
        </router-link>
      </div>

      <div class=" position-relative col-sm-4" v-else>
        <router-link
          :to="{ name: 'artical-detail', params: { uuid: product.uuid, levelOneslug: tagStore.getLevelOneTagSlug } }">
          <img :src="productItem.main_image" class="card-img fit-cover  h-100 " alt="Main Image">
        </router-link>
      </div>

      <div class="col-sm-8 h-100"
        :class="{ 'fetured-card': itemContainerValidator('fetured-card'), 'fetured-card-min-height': !itemContainerValidator('fetured-card') }">

        <div class="card-body justify-content-between align-items-center ps-2 pe-2 py-2">

          <div class="d-flex justify-content-between">
            <h5 class="card-title mb-1" style="line-height: 1.5;">
              <router-link v-if="type != 'user'"
                :to="{ name: 'artical-detail', params: { uuid: product.uuid, levelOneslug: tagStore.getLevelOneTagSlug } }">
                <span class="link-dark text-decoration-none text-capitalize  truncate-text-1"
                data-bs-toggle="tooltip" :title="productItem.name">{{ productItem.name
                  }}</span>
              </router-link>
              <router-link v-else @click="setOwner(productItem, 'user')"
                :to="{ name: 'owner-level-one', params: { name: productItem?.name, levelOneslug: tagStore.getLevelOneTagSlug } }">
                <span class="truncate-text-1 link-dark text-decoration-none text-capitalize  "
                data-bs-toggle="tooltip" :title="productItem.name">{{ productItem.name
                  }}</span>
              </router-link>
            </h5>
            <i class='menu-icon mx-1 my-1 tf-icons bx bx-bookmark cursor-pointer' v-if="type == 'user'"
              :class="{ 'bookmark-color bx bxs-bookmark': productItem.in_wishlist }"
              @click="addProductTowishList(productItem, type === 'user' ? 'user' : 'product')"></i>
          </div>

          <div class="d-flex align-items-center" style="font-size: 13px" v-if="hideShowItemsOnProductCard('DOB_DOD')">
            <div class="p-2 ps-0">{{ productItem.date_of_birth }}</div>
            <div>|</div>
            <div class="p-2">{{ productItem.date_of_death }}</div>
          </div>

          <div v-if="type == 'user'">
            <router-link @click="setLevelOneTag(tagStore?.getLevelOneTagId, tagStore?.getLevelOneTagSlug)"
              class="link-dark text-decoration-none text-capitalize "
              :to="{ name: 'level-one-page', params: { levelOneslug: tagStore?.getLevelOneTagSlug } }">
              {{ resetStringFormat(tagStore?.getLevelOneTagSlug) ?? '' }}
            </router-link>

            <span v-if="tagStore?.getLevelTwoTagSlug && tagStore.getLevelOneTagSlug !== 'taskers'" class="text-dark"> .
            </span>
            <span class="text-dark cursor-pointer text-capitalize"
              v-if="tagStore?.getLevelTwoTagSlug && tagStore.getLevelOneTagSlug !== 'taskers'"
              @click="setLevelsInStore({ id: tagStore?.getLevelTwoTagId, slug: tagStore?.getLevelTwoTagSlug })">
              {{ tagStore?.getLevelTwoTagSlug ?? '' }}
            </span>
            <!-- show level <two, three> tags in case of taskers -->
            <span v-if="tagStore.getLevelOneTagSlug === 'taskers'">
              <!-- level two -->
              <span v-if="productItem.level_two_tag" class="text-dark"> . </span>
              <router-link class="text-dark text-decoration-none text-capitalize"
                @click="setLevelsInStore(productItem.level_two_tag)"
                :to="{ name: 'level-two-page', params: { 'levelOneSlug': productItem.level_one_tag.slug, 'levelTwoslug': productItem.level_two_tag.slug } }"
                v-if="productItem.level_two_tag">
                {{ productItem.level_two_tag.name }}
              </router-link>

              <!-- level three -->
              <!-- @click="goToLevelThreeTags({ levelTwo: productItem?.level_two_tag, levelThree: productItem?.level_three_tag })" -->
              <span v-if="productItem.level_three_tag" class="text-dark"> . </span>
              <span class="text-dark cursor-pointer text-capitalize" v-if="productItem.level_three_tag">
                {{ productItem.level_three_tag.name }}
              </span>
            </span>
            <div v-if="productItem?.business">
              <router-link @click="setOwner(productItem.business, 'business')" class="text-dark"
                :to="{ name: 'owner-level-one', params: { name: productItem.business.slug, levelOneslug: tagStore.getLevelOneTagSlug } }">
                {{ productItem.business.name }}
              </router-link>
            </div>
          </div>

          <div v-if="itemContainerValidator('ratings')" style="margin-top: 5px;">
            <star-rating :rating="productItem.reviews_avg" :read-only="true" :star-size="20" :show-rating="false"
              active-color="#ff6846"></star-rating>
          </div>

          <p class="card-text text-height" v-if="productItem?.level_two_tag && tagStore.getLevelOneTagSlug !== 'taskers'">
            <router-link class="text-inherit"
              :to="{ name: 'level-two-page', params: { levelOneslug: tagStore?.getLevelOneTagSlug, levelTwoslug: product?.level_two_tag?.slug } }"
              @click="setLevelsInStore(product?.level_two_tag)">
              {{ product?.level_two_tag?.name }}
            </router-link>
          </p>

        </div>
      </div>
    </div>
  </div>
</template>
  

<style scoped>
.fit-cover {
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 6px 0 0 6px;
}




@media (min-width: 768px) {
  .fit-cover {
    position: absolute;
  }
}

.fetured-card {
  aspect-ratio: 2/1;
  min-height: 8rem;
}

.text-height {
  margin-top: 14px;
}
</style>