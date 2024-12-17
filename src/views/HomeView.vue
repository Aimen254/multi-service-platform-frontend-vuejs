<script setup>
import { onBeforeMount, onMounted, ref, inject } from 'vue'
import { useTagsApi } from '@composables/tagLevels.js'
import { useToastr } from '@composables/toastr';
import { useRoute } from 'vue-router'
import { myLvCategoryApi } from '@composables/myLvCategories.js'
import { useHelper } from "@composables/helper";
import { useUserStore } from '@stores/user.js'
import { useTagStore } from '@stores/tags'

const tagStore = useTagStore()
const { showLoading, hideLoading } = useHelper();
const { levelOneTags } = useTagsApi();
const { meta, getMyCategories, productsMeta, categories, products } = myLvCategoryApi()
const userStore = useUserStore();
const isLoadingMore = ref(false);
const { toast } = useToastr();
const route = useRoute()
const categoriesList = ref([])
const myCategorieContainer = ref(null)
const productsList = ref([])
const productsContainer = ref(null)


const getCategories = async (params, container = null) => {
    await getMyCategories(params, container);
    categoriesList.value.push(...categories.value)
}

const getMyLvProducts = async (params, container = null) => {
    await getMyCategories(params, container)
    productsList.value = products.value
}

const checkScrollbarEnd = async (type) => {
    if (type == 'categories') {
        const page = meta.value.current_page + 1
        if (page <= meta.value.total_pages) {
            await getCategories({ limit: 8, 'page': page, type: 'categories' }, myCategorieContainer.value)
        }
    } else {
        if (!isLoadingMore.value) {
            isLoadingMore.value = true;
            const page = productsMeta.value.current_page + 1
            if (page <= productsMeta.value.total_pages) {
                await getMyLvProducts({ limit: 4, page: page, type: 'products', withProducts: true }, productsContainer.value)
                    .finally(() => {
                        isLoadingMore.value = false;
                    });
            } else {
                isLoadingMore.value = false;
            }
        }

    }

}

const setLevelOneTag = (tag) => {
    const levelOneTagId = tag.id
    const levelOneTagSlug = tag.slug
    tagStore.saveLevelOneTag({ levelOneTagId, levelOneTagSlug })
}


const setOwner = (owner, type) => {
    owner.type = type
    userStore.saveOwner(owner)
}

onMounted(async () => {
    showLoading()
    const tags = await levelOneTags();
    await getCategories({ limit: 10, type: 'categories' })
    // get my lv products
    await getMyLvProducts({ limit: 4, type: 'products', withProducts: true })
    hideLoading()
})
</script>
<template>
    <div class="mt-4">
        <!-- main content -->
        <div class="row">
            <div class="col-xl-7 col-lg-7 col-md-7 col-12">
                <perfect-scrollbar @ps-y-reach-end="checkScrollbarEnd('products')">
                    <div class="my-lv-products-height">
                        <div ref="productsContainer" style="position: relative;">
                            <div v-for=" category in productsList" :key="category">
                                <div class="card mb-4 me-md-3" v-for="product in category.products" :key="product">
                                    <div class="card-header flex-grow-0 py-3">
                                        <div class="d-flex">
                                            <div class="owner-logo flex-shrink-0 me-3 ">
                                                <router-link v-if="product?.is_business"
                                                    @click="setOwner(product?.author, 'business')"
                                                    :to="{ name: 'owner-level-one', params: { name: product?.author?.slug, levelOneslug: category?.module?.slug } }">
                                                    <img :src="product?.author?.logo" alt="author" class="rounded" />
                                                </router-link>
                                                <router-link v-else @click="setOwner(product?.author, 'user')"
                                                    :to="{ name: 'owner-level-one', params: { name: product?.author?.name, levelOneslug: category?.module?.slug } }">
                                                    <img :src="product?.author?.logo" alt="author"
                                                        class="rounded-circle" />
                                                </router-link>
                                            </div>
                                            <div class="w-100 flex-wrap gap-1">
                                                <router-link
                                                    :to="{ name: 'artical-detail', params: { uuid: product?.uuid, levelOneslug: category?.module?.slug } }">
                                                    <h5 class="card-title mb-2">
                                                        {{ product?.name }}
                                                    </h5>
                                                </router-link>

                                                <h5 class="card-title mb-2 text-primary" v-if="product?.price">
                                                    {{ '$' + product.price }}
                                                </h5>
                                                <router-link v-if="product?.is_business"
                                                    @click="setOwner(product?.author, 'business')"
                                                    :to="{ name: 'owner-level-one', params: { name: product?.author?.slug, levelOneslug: category?.module?.slug } }">
                                                    <h6 class="mb-1 text-capitalize" style="color: #566A7F;">
                                                        {{ product?.author?.name }}
                                                    </h6>
                                                </router-link>
                                                <router-link v-else @click="setOwner(product?.author, 'user')"
                                                    :to="{ name: 'owner-level-one', params: { name: product?.author?.name, levelOneslug: category?.module?.slug } }">
                                                    <h6 class="mb-1 text-capitalize" style="color: #566A7F;">
                                                        {{ product?.author?.name }}
                                                    </h6>
                                                </router-link>
                                                <div>
                                                    <span>
                                                        <router-link @click="setLevelOneTag(category?.module)"
                                                            :to="{ name: 'level-one-page', params: { levelOneslug: category?.module?.slug } }">
                                                            <span class="tags-color">
                                                                {{ category?.module?.name }}
                                                            </span>
                                                        </router-link> .
                                                        <router-link @click="setLevelOneTag(category?.module)"
                                                            :to="{ name: 'level-two-page', params: { levelOneslug: category?.module?.slug, levelTwoslug: category?.maker?.slug } }">
                                                            <span class="tags-color">
                                                                {{ category?.maker?.name }}
                                                            </span>
                                                        </router-link> .
                                                        <router-link @click="setLevelOneTag(category?.module)"
                                                            :to="{ name: 'level-three-page', params: { levelOneslug: category?.module?.slug, levelTwoslug: category?.maker?.slug, levelThreeslug: category?.model?.slug } }">
                                                            <span class="tags-color">
                                                                {{ category?.model?.name }}
                                                            </span>
                                                        </router-link> .
                                                        <router-link @click="setLevelOneTag(category?.module)"
                                                            :to="{ name: 'level-four-page', params: { levelOneslug: category?.module?.slug, levelTwoslug: category?.maker?.slug, levelThreeslug: category?.model?.slug, levelFourslug: category?.level_four_tag?.slug ? category?.level_four_tag?.slug : 'all' } }">
                                                            <span class="tags-color">
                                                                {{ category?.level_four_tag?.name ?
                    category?.level_four_tag?.name : 'All' }}
                                                            </span>
                                                        </router-link>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <router-link
                                        :to="{ name: 'artical-detail', params: { uuid: product?.uuid, levelOneslug: category?.module?.slug } }">
                                        <img class="card-img-bottom" style="aspect-ratio: 3/2;"
                                            :src="product?.main_image" alt="Card image cap">
                                    </router-link>
                                </div>
                            </div>
                        </div>


                    </div>
                </perfect-scrollbar>
            </div>
            <div class="col-xl-5 col-lg-5 col-md-5 col-12 ps-md-4">

                <!-- weather -->
                <div class="card mb-4 mt-4 mt-md-0">
                    <div class="card-body">
                        <img class="card-img-top rounded my-1" src="@/assets/images/Ads/weather.jpg"
                            alt="Card image cap" />
                    </div>
                </div>

                <!-- favorite categories -->
                <div>
                    <h4 class="text-capitalize">Favorite Categories</h4>
                </div>

                <!-- categories list -->
                <perfect-scrollbar class="mt-4" @ps-y-reach-end="checkScrollbarEnd('categories')">
                    <div class="my-lv-categories-height">
                        <div class="card" ref="myCategorieContainer">
                            <div class="card-body">
                                <ul class="p-0 m-0">
                                    <li class="list-unstyled d-flex justify-content-between"
                                        v-for="category in categoriesList" :key="category">
                                        <div class="pb-3">
                                            <div class="cursor-pointer">
                                                <router-link
                                                    :to="{ name: 'level-one-page', params: { levelOneslug: category?.module?.slug } }">
                                                    <h5 class="mb-1 card-title">
                                                        {{ category?.module?.name }}
                                                    </h5>
                                                </router-link>

                                            </div>
                                            <div>
                                                <span>
                                                    <router-link @click="setLevelOneTag(category?.module)"
                                                        :to="{ name: 'level-one-page', params: { levelOneslug: category?.module?.slug } }">
                                                        <span class="tags-color">
                                                            {{ category?.module?.name }}
                                                        </span>
                                                    </router-link> .
                                                    <router-link @click="setLevelOneTag(category?.module)"
                                                        :to="{ name: 'level-two-page', params: { levelOneslug: category?.module?.slug, levelTwoslug: category?.maker?.slug } }">
                                                        <span class="tags-color">
                                                            {{ category?.maker?.name }}
                                                        </span>
                                                    </router-link> .
                                                    <router-link @click="setLevelOneTag(category?.module)"
                                                        :to="{ name: 'level-three-page', params: { levelOneslug: category?.module?.slug, levelTwoslug: category?.maker?.slug, levelThreeslug: category?.model?.slug } }">
                                                        <span class="tags-color">
                                                            {{ category?.model?.name }}
                                                        </span>
                                                    </router-link> .
                                                    <router-link @click="setLevelOneTag(category?.module)"
                                                        :to="{ name: 'level-four-page', params: { levelOneslug: category?.module?.slug, levelTwoslug: category?.maker?.slug, levelThreeslug: category?.model?.slug, levelFourslug: category?.level_four_tag?.slug ? category?.level_four_tag?.slug : 'all' } }">
                                                        <span class="tags-color">
                                                            {{ category?.level_four_tag?.name ?
                    category?.level_four_tag?.name : 'All' }}
                                                        </span>
                                                    </router-link>
                                                    <span v-if="category?.from"> . {{ `(${category.from} -
                                                        ${category.to}` }}</span>
                                                    <span v-if="category?.min_price"> . {{ `($${category.min_price} -
                                                        $${category.max_price})` }}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </perfect-scrollbar>
            </div>
        </div>
    </div>
</template>

<style scoped></style>