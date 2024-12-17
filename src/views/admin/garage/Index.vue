<script setup>
import { ref, watch, onMounted } from 'vue';
import Table from '@components/core/Table.vue';
import { useHelper } from '@composables/helper';
import { useUserStore } from '@stores/user';
import { useProductApi } from '@composables/products';
import { useModuleSettings } from '@composables/modules.js';
import { useTagStore } from '@/stores/tags.js'
import SoldProducts from './SoldProducts.vue'

const { meta, products, getProducts, deleteProduct, dataNotFound, transformStatus, updateStatus } = useProductApi();
const { singularProductTitle, itemContainerValidator, hideShowItemsOnProductCard } = useModuleSettings()
const userStore = useUserStore();
const { truncate, getImage } = useHelper();
const levelOne = localStorage.getItem('levelOneId');
const currentPage = ref(1);
const tagStore = useTagStore()

const changeStatus = async (e, uuid) => {
    const form = {
        status: e.target.value
    }
    await updateStatus(tagStore.getLevelOneTagId, uuid, form)
    // recall api to update list
    await getProducts(levelOne, { user_id: userStore.user.id, page: currentPage.value, limit: 2, is_garage: true, disableStatusFilter: true });
}

const deleteItem = async (uuid) => {
    await deleteProduct(levelOne, uuid, { user_id: userStore.user.id, page: currentPage.value, limit: 2, is_garage: true, disableStatusFilter: true });
}

onMounted(async () => {
    await getProducts(levelOne, { user_id: userStore.user.id, page: currentPage.value, limit: 2, is_garage: true, disableStatusFilter: true });
});


</script>
<template>
    <div class="">
        <div class="d-flex justify-content-end p-4" v-if="products.length < 2">
            <router-link :to="{ name: 'garage.form' }" class="btn btn-primary">{{ `+ Sell
                ${singularProductTitle}` }}</router-link>
        </div>
        <Table>
            <template #filters>
            </template>
            <template #content>
                <thead class="table-light">
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Type</th>
                        <th>Year</th>
                        <th>Created At</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody class="table-border-bottom-0">
                    <tr v-if="dataNotFound" class="text-center">
                        <td colspan="7" class="pt-4">
                            {{ dataNotFound }}
                        </td>
                    </tr>
                    <tr v-for="(product, index) in products" :key="index">
                        <!-- title -->
                        <td>
                            <div class="d-flex">
                                <div class="avatar flex-shrink-0 me-3">
                                    <img :src=getImage(product.main_image) alt="product" class="rounded" />
                                </div>
                                <span class="d-flex align-items-center">{{ truncate(product.name) }}</span>
                            </div>
                        </td>


                        <!-- price -->
                        <td>
                            ${{ product?.price }}
                        </td>

                        <!-- type -->
                        <td>
                            {{ product?.vehicle?.type }}
                        </td>

                        <td>
                            {{ product?.vehicle?.year }}
                        </td>

                        <!-- Created At Timestamp -->
                        <td>
                            {{ product.created_at }}
                        </td>

                        <!-- status -->
                        <td class="text-capitalize">
                            <div>
                                <span v-if="product.status == 'tags_error'" class="badge bg-label-danger">
                                    {{ 'Tags Error' }}
                                </span>
                                <select v-else class="form-select" @change.prevent="changeStatus($event, product.uuid)"
                                    v-model="product.status">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="sold">Sold</option>
                                </select>
                            </div>
                        </td>

                        <!-- actions -->
                        <td>
                            <div class="dropdown">
                                <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                    <i class="bx bx-dots-vertical-rounded"></i>
                                </button>
                                <div class="dropdown-menu">
                                    <router-link :to="{ name: 'garage.form', params: { uuid: product.uuid } }"
                                        class="dropdown-item"><i class="bx bx-edit-alt me-1"></i>
                                        Edit</router-link>
                                    <router-link :to="{ name: 'garage.view', params: { uuid: product.uuid } }"
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
            </template>
        </Table>
        <hr>
    </div>
    <div>
        <SoldProducts />
    </div>
</template>

<style></style>