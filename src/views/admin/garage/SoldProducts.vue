<script setup>
import { ref, watch, onMounted, onBeforeUnmount, inject } from 'vue';
import Table from '@components/core/Table.vue';
import Filters from '@components/core/TableFilters.vue';
import { useHelper } from '@composables/helper';
import { useUserStore } from '@stores/user';
import { useProductApi } from '@composables/products';
import Pagination from '@components/core/Pagination.vue';
import { useModuleSettings } from '@composables/modules.js';
import { useTagStore } from '@/stores/tags.js'

const eventBus = inject('eventBus')

const { meta, products, getProducts, dataNotFound, } = useProductApi();
const { singularProductTitle, itemContainerValidator, hideShowItemsOnProductCard } = useModuleSettings()
const userStore = useUserStore();
const { truncate, getImage } = useHelper();
const levelOne = localStorage.getItem('levelOneId');
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
    await getProducts(levelOne, { user_id: userStore.user.id, page: currentPage.value, limit: limit.value, is_sold: true, order_by_col: 'updated_at' });

}

const nextPage = async () => {
    currentPage.value++;
    await getProducts(levelOne, { user_id: userStore.user.id, page: currentPage.value, limit: limit.value, is_sold: true, order_by_col: 'updated_at' });

}

onMounted(async () => {
    eventBus.on('sold-products', async () => {
        await getProducts(levelOne, { user_id: userStore.user.id, page: 1, limit: limit.value, is_sold: true, order_by_col: 'updated_at' });
    })
    await getProducts(levelOne, { user_id: userStore.user.id, page: currentPage.value, limit: limit.value, is_sold: true, order_by_col: 'updated_at' });
});

onBeforeUnmount(() => {
    eventBus.off('sold-products'); // Remove the event listener
});

watch(limit, (newValue, oldValue) => {
    getProducts(levelOne, { user_id: userStore.user.id, page: 1, keyword: searchValue.value, limit: limit.value, is_sold: true, order_by_col: 'updated_at' });
});


watch(searchValue, (newValue, oldValue) => {
    getProducts(levelOne, { user_id: userStore.user.id, page: 1, keyword: searchValue.value, limit: limit.value, is_sold: true, order_by_col: 'updated_at' });
});

</script>
<template>
    <div class="mb-4">
        <div class="card-header pb-0">
            <h5>Recently Sold</h5>
        </div>
        <Table>
            <template #filters>
                <Filters @filters="filters" />
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
                                <span class="badge bg-label-info">
                                    {{ product.status }}
                                </span>
                            </div>
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

<style></style>