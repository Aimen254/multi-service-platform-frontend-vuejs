<script setup>
import { ref, onMounted, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useHelper } from '@composables/helper';
import DeleteIcon from '@components/icons/DeleteIcon.vue';
import Table from '@components/core/Table.vue';
import Pagination from '@components/core/Pagination.vue';
import TableFilters from '@components/core/TableFilters.vue';
import { useWishlist } from '@composables/wishlist';
import { useTagStore } from '@/stores/tags.js';
import { useModuleSettings } from '@composables/modules';
import { useUserStore } from '@stores/user'

const { itemContainerValidator, author, showPrice, priceTitle, showLocation, singularProductTitle, bookmarkProductsUserTitle } = useModuleSettings()
const { wishlist, favoriteItems, meta, addToWishlist, dataNotFound } = useWishlist()
const { truncate, getImage, removeHtml } = useHelper();
const tagStore = useTagStore()
const userStore = useUserStore()

const route = useRoute()

const limit = ref(10);
const searchValue = ref('');
const currentPage = ref(1);

const filters = (data) => {
    data?.limit
        ? limit.value = data?.limit
        : searchValue.value = data?.search;
}

const deleteProduct = async (product) => {
    await addToWishlist(product, 'product')
    await getWishList()
}

const previousPage = async () => {
    currentPage.value--;
    getWishList(currentPage.value)
}

const nextPage = async () => {
    currentPage.value++;
    getWishList(currentPage.value)
}

const getWishList = async (page = 1) => {
    await wishlist({
        module: route.params?.levelOneslug,
        type: 'product',
        limit: limit.value,
        keyword: searchValue.value,
        page: page
    }, 'product')
}

const setOwner = (owner, type) => {
    owner.type = type
    userStore.saveOwner(owner)
}

onMounted(async () => {
    await getWishList()
});

watch(limit, (newValue, oldValue) => {
    getWishList()
});

watch(searchValue, (newValue, oldValue) => {
    getWishList()
});
</script>

<template>
    <div class="mb-4">
        <Table>
            <template #filters>
                <TableFilters @filters="filters" />
            </template>
            <template #content>
                <thead class="table-light">
                    <tr>
                        <th
                            v-if="(itemContainerValidator('companies') || itemContainerValidator('authors')) && !itemContainerValidator('hideAndShowBusiness')">
                            {{ author }}
                        </th>
                        <th  v-if="!itemContainerValidator('eventPerformer')">{{ singularProductTitle }}</th>
                        <th v-if="itemContainerValidator('eventPerformer')">Title</th>

                        <th v-if="itemContainerValidator('productType')">Type</th>
                        <th v-if="itemContainerValidator('price')">{{ priceTitle }}</th>
                        <th v-if="itemContainerValidator('productYear')">Year</th>
                        <th v-if="itemContainerValidator('location')">Location</th>
                        <th>Category</th>
                        <th v-if="['obituaries'].includes(tagStore.getLevelOneTagSlug)">Date of Birth</th>
                        <th v-if="['obituaries'].includes(tagStore.getLevelOneTagSlug)">Date of Death</th>
                        <th v-if="itemContainerValidator('bookmarkProductsUser')">{{ bookmarkProductsUserTitle }}</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody class="table-border-bottom-0">
                    <tr v-if="dataNotFound" class="text-center">
                        <td colspan="4" class="pt-4">
                            {{ dataNotFound }}
                        </td>
                    </tr>
                    <tr v-for="(bookmark, index) in favoriteItems" :key="index">
                        <td v-if="itemContainerValidator('companies') && !itemContainerValidator('hideAndShowBusiness')">
                            <router-link v-if="bookmark?.product?.business"
                                @click="setOwner(bookmark.product.business, 'business')"
                                :to="{ name: 'owner-level-one', params: { name: bookmark.product.business?.slug, levelOneslug: tagStore.getLevelOneTagSlug } }"
                                class="text-inherit">
                                <div class="d-flex">
                                    <div class="avatar flex-shrink-0 me-3">
                                        <img :src=getImage(bookmark.product.business?.logo) :alt="author" class="rounded" />
                                    </div>
                                    <span class="d-flex align-items-center">{{ truncate(bookmark.product.business?.name)
                                    }}</span>
                                </div>
                            </router-link>
                        </td>
                        <td v-if="itemContainerValidator('authors')">
                            <router-link v-if="bookmark?.product?.user" @click="setOwner(bookmark.product.user, 'user')"
                                :to="{ name: 'owner-level-one', params: { name: bookmark.product.user?.name, levelOneslug: tagStore.getLevelOneTagSlug } }"
                                class="text-inherit">
                                <div class="d-flex">
                                    <div class="avatar flex-shrink-0 me-3">
                                        <img :src=getImage(bookmark.product.user?.avatar) :alt="author" class="rounded" />
                                    </div>
                                    <span class="d-flex align-items-center">{{ truncate(bookmark.product.user?.name)
                                    }}</span>
                                </div>
                            </router-link>
                        </td>
                        <td>
                            <router-link
                                :to="{ name: 'artical-detail', params: { uuid: bookmark?.product?.uuid, levelOneslug: tagStore?.getLevelOneTagSlug } }"
                                class="text-inherit">
                                <div class="d-flex">
                                    <div class="avatar flex-shrink-0 me-3"
                                        v-if="(!(itemContainerValidator('companies') || itemContainerValidator('authors')) || itemContainerValidator('hideAndShowBusiness')) && !itemContainerValidator('noMainImage')">
                                        <img :src=getImage(bookmark.product.main_image) alt="product" class="rounded" />
                                    </div>
                                    <span class="d-flex align-items-center" v-if="bookmark.product.name">
                                        {{ truncate(bookmark.product.name) }}
                                    </span>
                                    <span v-else v-html="truncate(removeHtml(bookmark.product.description), 50)"></span>
                                </div>
                            </router-link>
                        </td>
                        <td v-if="itemContainerValidator('productType')" class="text-capitalize">
                            {{ bookmark.product?.vehicle ? bookmark.product?.vehicle?.type : bookmark.product.type }}
                        </td>
                        <td v-if="itemContainerValidator('price')">
                            ${{ bookmark.product.price }}
                        </td>
                        <td v-if="itemContainerValidator('productYear')">
                            {{ bookmark.product?.vehicle?.year }}
                        </td>
                        <td v-if="itemContainerValidator('location')">
                            {{ truncate(bookmark.product?.user ? bookmark.product?.user.location :
                                bookmark.product?.business.address) }}
                        </td>
                        <td>
                            {{ bookmark.product.level_two_tag?.name }}
                        </td>
                        <td v-if="['obituaries'].includes(tagStore.getLevelOneTagSlug)">
                            {{ bookmark.product.date_of_birth }}
                        </td>
                        <td v-if="['obituaries'].includes(tagStore.getLevelOneTagSlug)">
                            {{ bookmark.product.date_of_death }}
                        </td>
                        <td v-if="itemContainerValidator('bookmarkProductsUser')">
                            {{ bookmark.product.user.name }}
                        </td>
                        <td>
                            <DeleteIcon class="cursor-pointer" @click="deleteProduct(bookmark.product)" />
                        </td>
                    </tr>
                </tbody>
            </template>
            <template #pagination>
                <Pagination class="px-4 mt-2" :meta="meta" @previousPage="previousPage" @nextPage="nextPage" />
            </template>
        </Table>
    </div>
</template>