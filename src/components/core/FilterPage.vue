<script setup>
import { ref } from 'vue';
import { useModuleSettings } from '@composables/modules';

const emit = defineEmits();

const { itemContainerValidator } = useModuleSettings();

const limitPerPage = ref(12);
const order = ref('desc');
const priceOrder = ref('');
const searchValue = ref('');
const timer = ref(null);

const props = defineProps({
    hideSorting: Boolean
})

const updateLimitPerPage = () => {
    emit("filters", { limit: limitPerPage.value });
};

const updateOrder = () => {
    emit("filters", { order: order.value });
};

const changePriceOrder = () => {
    emit('filters', { priceOrder: priceOrder.value })
}

const updateSearchValue = () => {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        emit("filters", { search: searchValue.value });
        const inputElement = document.querySelector('#search_input');
        if (inputElement) {
            inputElement.blur();
        }
    }, 500);
}
</script>

<template>
    <div class="row my-4">
        <div class="col-md-6">
            <div class="search input-group input-group-merge">
                <span class="input-group-text" id="form-item-search"><i class="bx bx-search"></i></span>
                <input class="form-control" type="text" id="search_input" v-model="searchValue"
                    @keyup="updateSearchValue" placeholder="Type into search" aria-label="Search..."
                    aria-describedby="form-item-search" />
            </div>
        </div>
        <div class="col-md-6 d-flex justify-content-md-end">
            <select class="form-select page-items" style="width: 32% !important;" v-model="priceOrder"
                @change="changePriceOrder" v-if="itemContainerValidator('orderByPrice')">
                <option value="">Default</option>
                <option value="desc">High to low price</option>
                <option value="asc">Low to high price</option>
            </select>
            <select class="form-select page-items" v-if="!hideSorting" v-model="order" @change="updateOrder">
                <option value="desc">Newest</option>
                <option value="asc">Oldest</option>
            </select>
            <select class="form-select" v-model="limitPerPage" @change="updateLimitPerPage">
                <option value="12">Show 12</option>
                <option value="24">Show 24</option>
                <option value="36">Show 36</option>
            </select>
        </div>
    </div>
</template>

<style scoped>
::v-deep.form-select {
    width: 7.3rem !important;
}

::v-deep.page-items {
    margin-right: 10px !important;
}

::v-deep.input-group,
.form-control {
    max-width: 16rem !important;
}
</style>