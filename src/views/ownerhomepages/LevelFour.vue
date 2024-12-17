
<script setup>
import { onBeforeMount, ref, watch } from 'vue'
import { useTagStore } from '@/stores/tags.js'
import BusinessDetailCard from '@components/general/BusinessDetailCard.vue';
import UserProfileHeader from '@components/general/UserProfileHeader.vue';
import Pagination from '@/components/core/Pagination.vue';
import ProductCard from '@/components/core/ProductCard.vue';
import ItemContainer from '@/components/general/ItemContainer.vue'
import { useProductApi } from '@composables/products.js'
import FilterPage from '@/components/core/FilterPage.vue';
import { useRoute } from 'vue-router'
import { useUserStore } from '@stores/user.js'
import AttributeFilters from '@components/core/AttributeFilters.vue';
import { useFilterApi } from '@composables/filter';
import { useModuleSettings } from '@composables/modules';

import HorizontalProductsLayout from '@components/general/HorizontalProductsLayout.vue'

const { getProducts, meta, dataNotFound } = useProductApi();
const { getProductFilters, productFilters } = useFilterApi();
const { itemContainerValidator } = useModuleSettings();
const tagStore = useTagStore()
const route = useRoute();
const currentPage = ref(1);
const searchValue = ref('');
const order = ref('desc');
const limitPerPage = ref(12);
const products = ref([]);
const userStore = useUserStore();
const filterComponent = ref(null);
const priceFilter = ref({});
const filter = ref({
    filters: []
});
const attribute = ref([]);
const selectedFilters = ref([]);

const productsList = async (page = 1) => {
    products.value = [];
    let params = {
        level_two_tag: route.params.levelTwoslug,
        level_three_tag: route.params?.levelThreeslug,
        level_four_tag: route.params.levelFourslug !== 'all' ? route.params.levelFourslug : null,
        limit: limitPerPage.value,
        page: page,
        keyword: searchValue.value,
        order: order.value,
        with_user_address: true,
        [userStore.getOwner?.type === 'business' ? 'business_slug' : 'user_id']: userStore.getOwner?.type === 'business' ? userStore.getOwner?.slug : userStore.getOwner?.id,
        filters: filter.value
    };

    if (priceFilter.value?.min && priceFilter.value?.max) {
        params.min_price = priceFilter.value?.min;
        params.max_price = priceFilter.value?.max;
    }
    products.value = await getProducts(tagStore.getLevelOneTagId, params)
}
const previousPage = async () => {
    currentPage.value--;
    await productsList(currentPage.value)
}

const nextPage = async () => {
    currentPage.value++;
    await productsList(currentPage.value)
}

// search
const handleSearch = async (data) => {
    if (data) {
        if (data.search !== undefined) {
            searchValue.value = data.search;
        }
        if (data.limit !== undefined) {
            limitPerPage.value = data.limit;
        }
        if (data.order !== undefined) {
            order.value = data.order;
        }
        productsList()
    }
}

// get filters
const fetchFilters = async () => {
    await getProductFilters(tagStore.getLevelOneTagId, {
        [userStore.getOwner?.type === 'business' ? 'business_slug' : 'user_id']: userStore.getOwner?.type === 'business' ? userStore.getOwner?.slug : userStore.getOwner?.id,
        level_two_tag: route.params.levelTwoslug,
        level_three_tag: route.params?.levelThreeslug,
        level_four_tag: route.params.levelFourslug !== 'all' ? route.params.levelFourslug : null,
        filters: filter.value
    });
}

// transforms filters
const transform = (filters) => {
    let transformedFilters = [];
    if (filters && Array.isArray(filters)) {
        filters.map((item) => {
            transformedFilters.push(
                {
                    id: item.id,
                    text: item.name
                }
            );
        })
        return transformedFilters;
    }
    return filters;
}

// check if filters exist
const isFilterExist = (data, isSelectedFilter = null) => {
    // check when 'selectedFilters' true
    if (isSelectedFilter) {
        /**
         * check key if its not set then set price manually
         * otherwise set comming filter attribute key 
         */
        const filterType = (data?.key && typeof data?.key !== 'undefined') ? data?.key : 'price';
        // check if filter value already exists in selected filters array
        return selectedFilters.value.findIndex(item => item.type === filterType);
    }

    // check if filter value already exists in filters array
    return filter.value?.filters.findIndex(filteredItem => {
        return Object.keys(filteredItem).includes(data?.key);
    });
}

// set all filters
const setFilters = async (data) => {
    // check when price filter available
    if (data?.min && data?.max) {
        // setting price values
        priceFilter.value.min = data?.min;
        priceFilter.value.max = data?.max;
    }

    let index = null;
    // update filter's value if its exist
    index = isFilterExist(data);
    if (index !== -1 && !data?.min) {
        filter.value.filters[index][data?.key] = data?.value;
    }
    // add filter value if not exists
    else {
        filter.value?.filters.push({ [data?.key]: data?.value });
    }

    // update selected filter's value if its exist
    index = isFilterExist(data, true);
    if (index !== -1) {
        if (data.text) { // update when not a price
            selectedFilters.value[index].type = data?.key;
            selectedFilters.value[index].id = data?.value;
            selectedFilters.value[index].text = data?.text;
        } else { // update when price
            selectedFilters.value[index].type = 'price';
            selectedFilters.value[index].min = data?.min;
            selectedFilters.value[index].max = data?.max;
        }
    }
    // add filter in selected list
    else {
        if (data.text) { // add when not a price
            selectedFilters.value.push({ type: data?.key, id: data?.value, text: data?.text })
        } else { // add when price
            selectedFilters.value.push({ type: 'price', min: data?.min, max: data?.max })
        }
    }

    // push selected filter value
    attribute.value.push(data);

    await productsList();
    await fetchFilters();
}

// reset all selected filters
const resetFilters = () => {
    // reseting filters
    filter.value.filters = [];
    attribute.value = [];
    priceFilter.value = {};
    selectedFilters.value = [];

    productsList(); // refreshing products list
    fetchFilters(); // refreshing filters list

    // reseting filter's input fields
    let count = 0;
    for (var key in productFilters.value) {
        filterComponent.value[count]?.resetInputs()
        count++;
    }
}

// remove single filter from all selected filters
// remove single filter from all selected filters
const removeFilter = (data) => {
    let index = null;
    // removing filter object from 'selectedFilters' list
    index = selectedFilters.value.findIndex(item => item.id === data.id && item.type === data.type);
    if (index !== -1) {
        selectedFilters.value.splice(index, 1);
    }

    // removing filter object from 'filter' list
    index = filter.value?.filters.findIndex(filteredItem => {
        return Object.keys(filteredItem).includes(data?.type);
    });
    if (index !== -1) {
        filter.value.filters.splice(index, 1);
    }

    // removing price filter
    if (data?.type === 'price' && priceFilter.value?.min && priceFilter.value?.max) {
        priceFilter.value.min = null;
        priceFilter.value.max = null;
    }

    // removing filter value from 'attribute' list
    index = attribute.value.findIndex(item => item.value === data.id && item.key === data.type);
    if (index !== -1) {
        attribute.value.splice(index, 1);
    }

    productsList(); // refreshing products list
    fetchFilters(); // refreshing filters list
}


const checkKey = (attribute, index) => {
    const matchingObject = attribute.find(obj => obj.key === index);
    return matchingObject ? matchingObject.value : null
}

onBeforeMount(async () => {
    if (!itemContainerValidator.value('horizontalProductsLayout')) {
        await productsList();
        await fetchFilters();
    }
})

watch(
    () => route.params,
    (newParams, oldParams) => {
        if (route.name == 'owner-level-four') {
            if (!itemContainerValidator.value('horizontalProductsLayout')) {
                resetFilters();
            }
        }
    }
);
</script>

<template>
    <!-- business card -->
    <div id="owner-container">
        <UserProfileHeader v-if="userStore.getOwner?.type === 'user'" />
        <BusinessDetailCard v-if="userStore.getOwner?.type === 'business'" />
    </div>

    <!-- filters -->
    <div v-if="itemContainerValidator('filters')" class="row">
        <!-- Reset Filters -->
        <div class="col-12">
            <div class="d-flex justify-content-end">
                <div class="badge bg-label-primary d-flex justify-content-between align-items-center cursor-pointer"
                    @click="resetFilters()">
                    <span class='tf-icons bx bx-reset fs-5'></span>
                    <span class="ps-1">Reset Filters</span>
                </div>
            </div>
        </div>

        <!-- Selected filters buttons -->
        <div class="my-2" v-if="selectedFilters">
            <button type="button" class="btn btn-primary ms-2 cursor-text" v-for="(filter, index) in selectedFilters"
                :key="index">
                <span v-if="filter.min && filter.max">{{ `${filter.min} - ${filter.max}` }}</span>
                <span v-else>{{ filter.text }}</span>
                <span class="tf-icons bx bx-x ps-2 cursor-default" @click="removeFilter(filter)"></span>
            </button>
        </div>

        <!-- Attribute filters component -->
        <AttributeFilters ref="filterComponent" v-for="(filters, index) in productFilters"
            :attributeFilter="transform(filters)" :attributeName="index" @filter-attributes="setFilters"
            :attribute="checkKey(attribute, index)" :priceRange="priceFilter" />
    </div>

    <!-- products layout -->
    <ItemContainer v-if="!itemContainerValidator('horizontalProductsLayout')">
        <template #content>
            <FilterPage @filters="handleSearch" />
            <div v-if="dataNotFound">
                {{ dataNotFound }}
            </div>
            <div v-else>
                <div class="row">
                    <div class="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4" v-for="(data, index) in products" :key="index">
                        <ProductCard :product="data" />
                    </div>
                </div>
                <div class="row">
                    <Pagination :meta="meta" @previousPage="previousPage" @nextPage="nextPage" />
                </div>
            </div>
        </template>
    </ItemContainer>

    <!-- posts layout -->
    <div v-else>
        <HorizontalProductsLayout :levelTwoTag="tagStore.getLevelTwoTagSlug" :levelThreeTag="tagStore.getLevelThreeTagSlug"
            :levelFourTag="tagStore.getLevelFourTagSlug" />
    </div>
</template>