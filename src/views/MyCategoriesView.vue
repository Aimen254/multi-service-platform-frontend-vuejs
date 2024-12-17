<script setup>
import { onMounted, watch, inject } from 'vue'
import ItemContainer from '@components/general/ItemContainer.vue'
import MyCategories from '@components/general/MyCategories.vue'
import Pagination from '@components/core/Pagination.vue'
import CategoryModal from '@components/general/CategoryModal.vue'
import { useToastr } from "@/composables/toastr.js"
import { dreamCategoriesStore } from '@/stores/categories'
import { useTagStore } from '@/stores/tags.js'
import { useCategoriesApi } from '@composables/categories.js'

const { toast } = useToastr();
const { getMyCategories, dataNotFound } = useCategoriesApi();
const tagStore = useTagStore();
const categoriesStore = dreamCategoriesStore();
const eventBus = inject('eventBus')

const getCategories = async (page) => {
    try {
        const result = await getMyCategories(tagStore.getLevelOneTagSlug, page)
    } catch (error) {
        toast(error, 'error')
    }
}

// mange prious page
const previousPage = async () => {
    currentPage.value--;
    await getCategories(currentPage.value)
}

// manage next page
const nextPage = async () => {
    currentPage.value++;
    await getCategories(currentPage.value)
}

const addCategory = () => {
    eventBus.emit('openModal');
}

onMounted(async () => {
   tagStore.removeLevelTwoTag()
   tagStore.removeLevelThreeTag()
   tagStore.removeLevelFourTag()
    await getCategories();
});

// watch(async (newParams, oldParams) => {
//     categoriesStore.removeAllCategories()
//     await getCategories()
// });
</script>

<template>
    <div>
        <!-- my categories -->
        <ItemContainer v-if="categoriesStore.getMyCategories.length > 0">
            <template #heading>
                <div class="d-flex align-items-center">
                    <h4 class="text-capitalize" style="padding-top: 6px;">My Categories</h4>
                    <div class="btn btn-outline-primary  ms-5 " @click="addCategory">
                        <i class='menu-icon tf-icons bx bx-plus'></i>
                        Add Category
                    </div>
                </div>
            </template>

            <template #content v-if="categoriesStore.getMyCategories.length > 0">
                <MyCategories v-for="category in categoriesStore.getMyCategories" :key="category" :category="category" />
                <Pagination :meta="categoriesStore.getMeta" @previousPage="previousPage" @nextPage="nextPage" />
            </template>
        </ItemContainer>

        <!-- display this if not found data -->
        <ItemContainer v-if="categoriesStore.getMyCategories.length == 0 && dataNotFound">
            <template #heading>
                <div class="d-flex align-items-center">
                    <h4 class="text-capitalize" style="padding-top: 6px;">My Categories</h4>
                    <div class="btn btn-outline-primary  ms-5 " @click="addCategory">
                        <i class='menu-icon tf-icons bx bx-plus'></i>
                        Add Category
                    </div>
                </div>
            </template>

            <template #content>
                {{ dataNotFound }}
            </template>
        </ItemContainer>
        <CategoryModal />
    </div>
</template>