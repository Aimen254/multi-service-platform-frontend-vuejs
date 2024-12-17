<script setup>
import { ref, onMounted } from 'vue';
import { useTagStore } from '@stores/tags';
import { useTagsApi } from '@composables/tagLevels';
import ItemContainer from '@components/general/ItemContainer.vue';
import ProductCard from '@components/core/ProductCard.vue';
import { useModuleSettings } from '@composables/modules'

const todayArticles = ref(null);
const tagStore = useTagStore();
const { levelTwoTags, dataNotFound } = useTagsApi();
const { productHeading } = useModuleSettings();


onMounted(async () => {
    todayArticles.value = await levelTwoTags(tagStore.getLevelOneTagId, { 'today_products': true, 'withProducts': true, 'productLimit': 8 });
});
</script>
<template>
    <ItemContainer>
        <template #heading>
            <h4 class="text-capitalize">Today's {{ productHeading }}</h4>
        </template>

        <template #content>
            <div v-if="dataNotFound">
                {{ dataNotFound }}
            </div>
            <div v-else>
                <div class="row" v-for="(data, index) in todayArticles" :key="index">
                    <div class="col-12 mb-2 py-3 d-flex align-items-center justify-content-between">
                        <h5 class="text-capitalize">{{ data.name }}</h5>
                    </div>
                    <div class="col-lg-3 col-xxl-3 mb-4 col-md-6 col-sm-12" v-for="(productData, index) in data.products"
                        :key="index">
                        <ProductCard :product="productData" />
                    </div>
                </div>
            </div>
        </template>
    </ItemContainer>
</template>