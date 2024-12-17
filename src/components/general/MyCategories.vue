<script setup>
import { computed, inject } from 'vue'
import ItemContainer from '@components/general/ItemContainer.vue'
import EditIcon from '@components/icons/EditIcon.vue'
import DeleteIcon from '@components/icons/DeleteIcon.vue'
import ProductCard from '@components/core/ProductCard.vue'
import { useMessage } from "@composables/message.js"
import { useModuleSettings } from '@composables/modules.js'

import { useRoute } from 'vue-router'

import { useCategoriesApi } from '@composables/categories.js'
const { deleteCategory } = useCategoriesApi()
const { recordNotFound } = useMessage()
const { itemContainerValidator } = useModuleSettings();

import { useTagStore } from '@/stores/tags.js'
const tagStore = useTagStore()
const eventBus = inject('eventBus')

const route = useRoute()

const props = defineProps({
    category: Object
})

// computed property to get dynamic title of category
const categoryTitle = computed(() => {
    let title = props.category.maker.name;
    if (props.category.model.name) {
        title += ' <b>.</b> ' + props.category.model.name;
    }

    if (props.category.level_four_tag?.name) {
        title += ' <b>.</b> ' + props.category.level_four_tag.name;
    }

    if (props.category.from) {
        title += ' <b>&#40;</b> ' + props.category.from + ' <b>-</b> ' + props.category.to + ' &#41;';
    }

    if (props.category.min_price && itemContainerValidator.value("minMaxPrice")) {
        title += ' <b>&#40;</b> $' + props.category.min_price+ ' <b>-</b> $' + props.category.max_price + ' &#41;';
    }
    return title
})

const editCategory = (category) => {
    eventBus.emit('openModal', {
        category: category
    });
}

const setLevelsInStore = (category) => {
    eventBus.emit('levelFour', {
        category: category
    })
}

</script>
<template>
    <ItemContainer>
        <template #heading>
            <div class="py-3 d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <h4 class="text-capitalize category-title" v-html="categoryTitle"></h4>
                    <EditIcon class="ms-3 text-inherit" @click="editCategory(category)"
                        style='font-size: 20px; margin-bottom: 10px;' />
                    <DeleteIcon class="ms-3 text-inherit" @click="deleteCategory(tagStore.getLevelOneTagSlug, category)"
                        style='font-size: 20px; margin-bottom: 10px;' />
                </div>
                <span @click="setLevelsInStore(category)" class="btn btn-outline-primary  mb-2">View All</span>
            </div>
        </template>
        <template #content v-if="category.products.length > 0">
            <div class="row mb-2">
                <div class="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4" v-for="product in category.products" :key="product">
                    <ProductCard :product="product" />
                </div>
            </div>
        </template>
        <template #content v-else>
            {{ recordNotFound() }}
        </template>
    </ItemContainer>
</template>

<style scoped>
.category-title {
    max-width: 700px;
}
</style>