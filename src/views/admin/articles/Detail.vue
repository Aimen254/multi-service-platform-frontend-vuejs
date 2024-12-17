<script setup>
import { onBeforeMount, ref, watch, inject } from 'vue'
import { useTagStore } from '@stores/tags';
import { useProductApi } from '@composables/products';
import { useRoute } from 'vue-router';
import { useCommentApi } from '@composables/comment'
import Table from '@components/core/Table.vue';
import Filters from '@components/core/TableFilters.vue';
import { useHelper } from '@composables/helper';
import Pagination from '@components/core/Pagination.vue';
import CommentModal from './CommentModal.vue'
import { useModuleSettings } from '@composables/modules.js'

const route = useRoute();
const  tagStore = useTagStore()
const { editProduct } = useProductApi();
const { singularProductTitle, singularOwnerTitle, priceTitle, itemContainerValidator, productDescriptionTitle, author, commentsTabTitle } = useModuleSettings()
const { comments, dataNotFound, productComments, meta, deleteComment } = useCommentApi();
const { truncate } = useHelper();
const limit = ref(10);
const searchValue = ref('');
const currentPage = ref(1);

const eventBus = inject('eventBus')

const product = ref(null)

const filters = (data) => {
    data?.limit
        ? limit.value = data?.limit
        : searchValue.value = data?.search;
}

const getComments = async (page = 1) => {
    await comments(null, { type: 'product', product_id: product.value.id, keyword: searchValue.value, limit: limit.value, page: page });
}

const removeComment = async (id) => {
    const result = await deleteComment(null, id)
    if (result) {
        await getComments()
    }
}

const previousPage = async () => {
    currentPage.value--;
    await getComments(currentPage.value)
}

const nextPage = async () => {
    currentPage.value++;
    await getComments(currentPage.value)
}

const viewComment = ((comment) => {
    eventBus.emit('openModal', {
        comment: comment
    });
})

watch(limit, async (newValue, oldValue) => {
    await getComments(currentPage.value)
});

watch(searchValue, async (newValue, oldValue) => {
    await getComments(currentPage.value)
});

onBeforeMount(async () => {
    product.value = await editProduct(tagStore.getLevelOneTagId, route.params.uuid);
    await getComments()
})
</script>
<template>
    <div class="">
        <div class="card-header">
            <h5>{{ `${singularProductTitle} Detail` }}</h5>
        </div>
        <div class="card-body" v-if="product">
            <!-- author -->
            <div class="row mb-4" v-if="!itemContainerValidator('organization')">
                <div class="col-md-2">
                    <h6 class="mb-0 mt-2">{{ `${singularOwnerTitle}:` }}</h6>
                </div>
                <div class="col-md-10">
                    <div class="d-flex align-items-center">
                        <div class="avatar flex-shrink-0">
                            <img class="rounded mx-1"
                                :src="product?.business?.logo ? product?.business?.logo : product.user?.avatar" />
                        </div>
                        <div class="ms-4">
                            <p class="mb-0">{{ product.business?.name ? product.business?.name : product.user?.name }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- product image -->
            <div class="row mb-4">
                <div class="col-md-2 d-flex align-items-center">
                    <h6 class="mb-0">Image:</h6>
                </div>
                <div class="col-md-10">
                    <div class="position-relative">
                        <div class="d-flex align-items-start align-items-sm-center gap-4">
                            <img :src="product?.main_image" class="d-block rounded mw-100" height="150" width="230"
                                id="uploadedFile" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- product title -->
            <div class="row mb-4" v-if="itemContainerValidator('productName')">
                <div class="col-md-2 d-flex align-items-center">
                    <h6 class="mb-0">{{ singularProductTitle }} Title:</h6>
                </div>
                <div class="col-md-10 d-flex align-items-center">
                    <div>
                        {{ product?.name }}
                    </div>
                </div>
            </div>

            <!-- product price -->
            <div class="row mb-4" v-if="itemContainerValidator('price')">
                <div class="col-md-2 d-flex align-items-center">
                    <h6 class="mb-0 text-capitalize">{{ priceTitle }}: </h6>
                </div>
                <div class="col-md-10 d-flex align-items-center">
                    <div>
                        ${{ product?.price }} <span v-if="itemContainerValidator('max-price')">- ${{ product.events.max_price }} </span>
                    </div>
                </div>
            </div>
            <!-- product price -->
            <div class="row mb-4" v-if="itemContainerValidator('priceType')">
                <div class="col-md-2 d-flex align-items-center">
                    <h6 class="mb-0 text-capitalize">Price Type:</h6>
                </div>
                <div class="col-md-10 d-flex align-items-center">
                    <div>
                        {{ product?.price_type }}
                    </div>
                </div>
            </div>

            <!-- product type -->

            <div class="row mb-4" v-if="itemContainerValidator('productType')">
                <div class="col-md-2 mt-1">
                    <h6 class="mb-0">Type:</h6>
                </div>
                <div class="col-md-10 d-flex align-items-center">
                    <div>
                        {{ product?.vehicle.lenght > 0 ? product?.vehicle?.type : product.type }}
                    </div>
                </div>
            </div>

            <!-- product description -->
            <div class="row mb-4">
                <div class="col-md-2 mt-1">
                    <h6 class="mb-0">{{ productDescriptionTitle }}:</h6>
                </div>
                <div class="col-md-10 d-flex align-items-center">
                    <div v-html="product.description">
                    </div>
                </div>
            </div>

            <!-- product stock -->
            <div v-if="itemContainerValidator('stock')" class="row mb-4">
                <div class="col-md-2 mt-1">
                    <h6 class="mb-0">Stock:</h6>
                </div>
                <div class="col-md-10 d-flex align-items-center">
                    <div>
                        {{ product.stock }}
                    </div>
                </div>
            </div>

            <!-- product weight -->
            <div v-if="itemContainerValidator('weight')" class="row mb-4">
                <div class="col-md-2 mt-1">
                    <h6 class="mb-0">Weight:</h6>
                </div>
                <div class="col-md-10 d-flex align-items-center">
                    <div v-if="product.weight">
                        {{ `${product.weight} ${product.weight_unit}` }}
                    </div>
                    <div v-else>N/A</div>
                </div>
            </div>

            <!-- product created at -->
            <div class="row">
                <div class="col-md-2 d-flex align-items-center">
                    <h6 class="mb-0">Created At:</h6>
                </div>
                <div class="col-md-10 d-flex align-items-center">
                    <div>
                        {{ product?.created_at }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Comments table -->
        <div v-if="itemContainerValidator('comments')">
            <hr>
            <div class="card-header pb-0">
                <h5>{{ commentsTabTitle }}</h5>
            </div>
            <Table>
                <template #filters>
                    <Filters @filters="filters" />
                </template>
                <template #content>
                    <thead class="table-light">
                        <tr>
                            <th>User</th>
                            <th>{{ commentsTabTitle }}</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody class="table-border-bottom-0">
                        <tr v-if="dataNotFound" class="text-center">
                            <td colspan="4" class="pt-4">
                                {{ dataNotFound }}
                            </td>
                        </tr>
                        <tr v-for="(comment, index) in productComments" :key="index">
                            <td>
                                <div class="d-flex">
                                    <div class="avatar flex-shrink-0 me-3">
                                        <img :src="comment?.user?.avatar" alt="User avatar" class="rounded" />
                                    </div>
                                    <span class="d-flex align-items-center">{{ comment?.user?.name
                                    }}</span>
                                </div>
                            </td>
                            <td>
                                {{ truncate(comment.comment) }}
                            </td>
                            <td class="text-capitalize">
                                {{ comment.created_at }}
                            </td>
                            <td>
                                <div class="d-flex">
                                    <a class="cursor-pointer" @click="viewComment(comment)"><i
                                            class="bx bx-show me-2"></i></a>
                                    <a class="cursor-pointer" @click="removeComment(comment.id)"><i
                                            class="bx bx-trash"></i></a>
                                </div>

                            </td>
                        </tr>
                    </tbody>
                </template>
                <template #pagination>
                    <Pagination :meta="meta" @previousPage="previousPage" @nextPage="nextPage" />
                </template>
            </Table>
            <CommentModal></CommentModal>
        </div>
    </div>
</template>

<style></style>