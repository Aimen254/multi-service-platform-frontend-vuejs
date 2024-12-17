<script setup>
import { ref } from 'vue';

const emit = defineEmits();

const limitPerPage = ref(4);
const order = ref('desc');
const searchValue = ref('');
const timer = ref(null);

const updateLimitPerPage = () => {
    emit("filters", { limit: limitPerPage.value });
};

const updateOrder = () => {
    emit("filters", { order: order.value });
};

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
    <div class="row">
        <div class="col-md-6 mb-3">
            <div class="search input-group input-group-merge">
                <span class="input-group-text" id="form-item-search"><i class="bx bx-search"></i></span>
                <input class="form-control" type="text" id="search_input" v-model="searchValue" @keyup="updateSearchValue"
                    placeholder="Type into search" aria-label="Search..." aria-describedby="form-item-search" />
            </div>
        </div>
        <div class="col-md-6 mb-3 d-flex justify-content-md-end">
            <select class="form-select page-items" v-model="order" @change="updateOrder">
                <option value="desc">Newest</option>
                <option value="asc">Oldest</option>
            </select>
            <select class="form-select" v-model="limitPerPage" @change="updateLimitPerPage">
                <option value="4">Show 4</option>
                <option value="8">Show 8</option>
                <option value="12">Show 12</option>
            </select>
        </div>
    </div>
</template>

<style scoped>
::v-deep.form-select{
    width: 7.3rem !important;
}

::v-deep.page-items {
    margin-right: 10px !important;
}

::v-deep.input-group, .form-control  {
    max-width: 16rem !important;
}
</style>
