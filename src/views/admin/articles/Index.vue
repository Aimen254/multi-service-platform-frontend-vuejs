<script setup>
import { ref, watch, onMounted } from 'vue';
import Table from '@components/core/Table.vue';
import Filters from '@components/core/TableFilters.vue';
import { useHelper } from '@composables/helper';
import { useUserStore } from '@stores/user';
import { useProductApi } from '@composables/products';
import Pagination from '@components/core/Pagination.vue';
import { useModuleSettings } from '@composables/modules.js';
import { useTagStore } from '@/stores/tags.js'
import { useRoute } from 'vue-router';

const { meta, products, getProducts, deleteProduct, dataNotFound, transformStatus, updateStatus } = useProductApi();
const { singularProductTitle, priceTitle, dateTitle, itemContainerValidator, author, hideShowItemsOnProductCard, commentsTabTitle, bookmarkProductsUserTitle, btnTitle } = useModuleSettings()
const userStore = useUserStore();
const route = useRoute()
const { truncate, getImage, removeHtml } = useHelper();
const levelOne = route.params?.levelOneslug
const limit = ref(10);
const searchValue = ref('');
const currentPage = ref(1);
const tagStore = useTagStore()

const filters = (data) => {
    data?.limit
        ? limit.value = data?.limit
        : searchValue.value = data?.search;
}

const previousPage = async () => {
    currentPage.value--;
    await getProducts(levelOne, { user_id: userStore.user.id, role: userStore.user.user_type, page: currentPage.value, keyword: searchValue.value, limit: limit.value, is_business: itemContainerValidator.value('businessProducts') ? true : null, disableStatusFilter: true });
}

const nextPage = async () => {
    currentPage.value++;
    await getProducts(levelOne, { user_id: userStore.user.id, role: userStore.user.user_type, page: currentPage.value, keyword: searchValue.value, limit: limit.value, is_business: itemContainerValidator.value('businessProducts') ? true : null, disableStatusFilter: true });
}

const changeStatus = async (e, uuid) => {
    const form = {
        status: e.target.value
    }
    await updateStatus(levelOne, uuid, form)
    // recall api to update list
    await getProducts(levelOne, { user_id: userStore.user.id, role: userStore.user.user_type, page: currentPage.value, limit: limit.value, is_business: itemContainerValidator.value('businessProducts') ? true : null, disableStatusFilter: true });
}

const deleteItem = async (uuid) => {
    await deleteProduct(levelOne, uuid, { user_id: userStore.user.id, page: currentPage.value, keyword: searchValue.value, limit: limit.value, is_business: itemContainerValidator.value('businessProducts') ? true : null, disableStatusFilter: true });
}

const setOwner = (owner) => {
    owner.type = 'business'
    userStore.saveOwner(owner)
}

onMounted(async () => {
    await getProducts(levelOne, { user_id: userStore.user.id, role: userStore.user.user_type, page: currentPage.value, keyword: searchValue.value, limit: limit.value, is_business: itemContainerValidator.value('businessProducts') ? true : null, disableStatusFilter: true });
});

watch(limit, (newValue, oldValue) => {
    getProducts(levelOne, { user_id: userStore.user.id, page: 1, role: userStore.user.user_type, keyword: searchValue.value, limit: limit.value, is_business: itemContainerValidator.value('businessProducts') ? true : null, disableStatusFilter: true });
});


watch(searchValue, (newValue, oldValue) => {
    getProducts(levelOne, { user_id: userStore.user.id, role: userStore.user.user_type, page: 1, keyword: searchValue.value, limit: limit.value, is_business: itemContainerValidator.value('businessProducts') ? true : null, disableStatusFilter: true });
});
</script>

<template>
    <div class="mb-4">
        <div class="d-flex justify-content-end p-4">
            <router-link :to="{ name: 'articles.form' }" class="btn btn-primary">{{ `+ Add
                ${btnTitle}` }}</router-link>
        </div>
        <Table>
            <template #filters>
                <Filters @filters="filters" />
            </template>

            <template #content>
                <thead class="table-light">
                    <tr>
                        <th v-if="itemContainerValidator('companies') && !itemContainerValidator('hideBusiness')">{{
                author
            }}</th>
                        <th v-if="itemContainerValidator('productName') && !itemContainerValidator('eventPerformer')">{{ singularProductTitle }}</th>
                        <th v-if="itemContainerValidator('eventPerformer')">Title</th>
                        <th v-if="!itemContainerValidator('productName')">{{ singularProductTitle }}</th>
                        <th v-if="itemContainerValidator('eventPerformer')">Performer</th>
                        <th v-if="itemContainerValidator('bookmarkProductsUser')">{{ bookmarkProductsUserTitle }}</th>
                        <th v-if="itemContainerValidator('displayCategory')">Category</th>
                        <th v-if="itemContainerValidator('productType')">Type</th>
                        <th v-if="itemContainerValidator('price') && itemContainerValidator('event_price')">{{priceTitle }}</th>
                        <th v-if="!itemContainerValidator('event_price')">Ticket Price</th>
                        <th v-if="itemContainerValidator('event_location')">Location</th>
                        <th v-if="itemContainerValidator('productYear')">Year</th>
                        <th v-if="itemContainerValidator('condition')">Condition</th>
                        <th v-if="itemContainerValidator('displayCommentsInProductListing')">{{ commentsTabTitle }}</th>
                        <th v-if="hideShowItemsOnProductCard('DOB_DOD')">Date of Birth</th>
                        <th v-if="hideShowItemsOnProductCard('DOB_DOD')">Date of Death</th>
                        <th v-if="!itemContainerValidator('hideDate')||itemContainerValidator('event_location')">{{ dateTitle }}</th>
                        <th v-if="itemContainerValidator('hideStatus')">Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody class="table-border-bottom-0">
                    <tr v-if="dataNotFound" class="text-center">
                        <td :colspan="showCompany ? 7 : 4" class="pt-4">
                            {{ dataNotFound }}
                        </td>
                    </tr>
                    <tr v-for="(product, index) in products" :key="index">
                        <!-- business title -->
                        <td v-if="itemContainerValidator('companies') && !itemContainerValidator('hideBusiness')">
                            <div class="d-flex">
                                <div class="avatar flex-shrink-0 me-3">
                                    <img :src=getImage(product.business?.logo) :alt="author" class="rounded" />
                                </div>
                                <span class="d-flex align-items-center">{{ truncate(product.business?.name)
                                    }}</span>
                            </div>

                        </td>


                        <!-- title -->
                        <td>
                            <div class="d-flex">
                                <div class="avatar flex-shrink-0 me-3"
                                    v-if="!itemContainerValidator('companies') && !itemContainerValidator('noMainImage')">
                                    <img :src=getImage(product.main_image) alt="product" class="rounded" />
                                </div>
                                <span v-if="product.name && !itemContainerValidator('hideTitle')"
                                    class="d-flex align-items-center">{{
                truncate(product.name) }}</span>
                                <span v-else class="d-flex align-items-center"
                                    v-html="truncate(removeHtml(product.description), 50)"></span>
                            </div>
                        </td>
                        <td v-if="itemContainerValidator('eventPerformer')">
                            {{ product?.events?.performer }}
                        </td>

                        <td v-if="itemContainerValidator('bookmarkProductsUser')" :class="[!showCompany ? 'w-30' : '']">
                            {{ product.user?.name }}
                        </td>

                        <td v-if="itemContainerValidator('displayCategory')">
                            {{ product?.level_two_tag?.name }}
                        </td>

                        <td v-if="itemContainerValidator('productType')" class="text-capitalize">
                            {{ product?.vehicle ? product?.vehicle?.type : product.type }}
                        </td>
                        <!-- price -->
                        <td v-if="itemContainerValidator('price')">
                            ${{ product.price }} <span v-if="itemContainerValidator('max-price')">- ${{
                product?.max_price }}</span>
                        </td>


                        <td v-if="itemContainerValidator('event_location')">
                            {{ product?.events?.event_location }}
                        </td>



                        <td v-if="itemContainerValidator('productYear')">
                            {{ product?.vehicle?.year }}
                        </td>

                        <!-- condition -->
                        <td v-if="itemContainerValidator('condition')">
                            {{ product?.condition?.name ?? 'N/A' }}
                        </td>



                        <!-- comments count -->
                        <td v-if="itemContainerValidator('displayCommentsInProductListing')">
                            {{ product?.comments_count }}
                        </td>

                        <!-- Date of birth -->
                        <td v-if="hideShowItemsOnProductCard('DOB_DOD')">
                            {{ product?.date_of_birth }}
                        </td>

                        <!-- Date of death -->
                        <td v-if="hideShowItemsOnProductCard('DOB_DOD')">
                            {{ product?.date_of_death }}
                        </td>

                        <!-- Created At Timestamp -->
                        <td v-if="!itemContainerValidator('hideDate')"
                            :class="[itemContainerValidator('tableTd') !== 'taskers' ? 'w-25' : '']">
                            {{ product?.created_at }}
                        </td>
                        
                        <td v-if="itemContainerValidator('events_date')"
                            :class="[itemContainerValidator('tableTd') !== 'taskers' ? 'w-25' : '']">
                            {{ new Date(product.events?.event_date).toLocaleString() }}
                        </td>

                        <!-- status -->
                        <td class="text-capitalize" v-if="itemContainerValidator('hideStatus')"
                            :class="[itemContainerValidator('tableTd') !== 'taskers' ? 'w-20' : '']">
                            <div v-if="itemContainerValidator('hideAndShowBusiness')">
                                <span v-if="product.status == 'tags_error'" class="badge bg-label-danger">
                                    {{ 'Tags Error' }}
                                </span>

                                <span v-if="product.status == 'sold'" class="badge bg-label-success">
                                    {{ 'sold' }}
                                </span>
                                <span v-if="product.status == 'pending'" class="badge bg-label-danger">
                                    {{ 'pending' }}
                                </span>
                                <select class="form-select" style="width: fit-content;"
                                    @change.prevent="changeStatus($event, product.uuid)" v-model="product.status"
                                    v-if="product.status !== 'sold' && product.status !== 'pending' && product.status !== 'tags_error'">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="sold">Sold</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                            <div v-else>
                                <label class="switch">
                                    <input type="checkbox" class="switch-input"
                                        :checked="transformStatus(product.status)"
                                        @click.prevent="updateStatus($event,levelOne, product.uuid)" />
                                    <span class="switch-toggle-slider">
                                        <span class="switch-on"></span>
                                        <span class="switch-off"></span>
                                    </span>
                                </label>
                            </div>
                        </td>

                        <!-- actions -->
                        <td>
                            <div class="dropdown">
                                <button type="button" class="btn p-0 dropdown-toggle hide-arrow"
                                    data-bs-toggle="dropdown">
                                    <i class="bx bx-dots-vertical-rounded"></i>
                                </button>
                                <div class="dropdown-menu">
                                    <router-link :to="{ name: 'articles.form', params: { uuid: product.uuid } }"
                                        class="dropdown-item" v-if="product.status !== 'sold'"><i
                                            class="bx bx-edit-alt me-1"></i>
                                        Edit</router-link>
                                    <router-link :to="{ name: 'articles.view', params: { uuid: product.uuid } }"
                                        class="dropdown-item cursor-pointer"><i class="bx bx-show me-1"></i>
                                        View</router-link>
                                    <a class="dropdown-item cursor-pointer" @click="deleteItem(product.uuid)"><i
                                            class="bx bx-trash me-1"></i>
                                        Delete</a>
                                </div>
                            </div>
                            <!-- <DeleteIcon class="cursor-pointer" @click="deleteProduct(product.id)" /> -->
                        </td>
                    </tr>
                </tbody>
            </template>

            <template #pagination>
                <Pagination :meta="meta" @previousPage="previousPage" @nextPage="nextPage" />
            </template>
        </Table>
    </div>
</template>

<style scoped>
.bg-label-success {
    color: white !important;
    background-color: #A6A6A6 !important;
}
</style>
