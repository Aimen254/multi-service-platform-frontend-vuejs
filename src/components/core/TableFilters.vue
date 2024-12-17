<script setup>
import { ref } from 'vue';
import { useModuleSettings } from '@composables/modules.js'
const {itemContainerValidator } = useModuleSettings()



const emit = defineEmits();

const limitPerPage = ref(10);
const searchValue = ref('');
const favoriteValue = ref('default')
const category = ref(null)
const timer = ref(null);

const props = defineProps({
    showFilters: Boolean,
    categories: Array
})

const updateLimitPerPage = () => {
    emit("filters", { limit: limitPerPage.value });
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

const updateFavoriteValue = () => {
    emit("filters", { favorite: favoriteValue.value });
}

const changeCategory = () => {
    emit("filters", { category: category.value });
}
</script>

<template>
    <div class="row">
        <div class="col-md-9 mb-3">
            <div class="row">
                <div class="col-md-2">
                    <select class="form-select page-items" v-model="limitPerPage" @change="updateLimitPerPage">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                    </select>
                </div>
                <div class="col-md-3" v-if="showFilters">
                    <Select2 :options="categories" v-model="category" placeholder="Select category"
                        @select="changeCategory"></Select2>
                </div>
                <div class="col-md-3" v-if="showFilters">
                    <select class="form-select page-items" v-model="favoriteValue" @change="updateFavoriteValue">
                        <option value="default">All</option>
                        <option value="favorite">Favorite</option>
                        <option value="not_favorite">Not Favorite</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="col-md-3 mb-3">
            <div class="search input-group input-group-merge float-md-end">
                <span class="input-group-text" id="form-item-search"><i class="bx bx-search"></i></span>
                <input class="form-control" type="text" id="search_input" v-model="searchValue" @keyup="updateSearchValue"
                    placeholder="Type into search" aria-label="Search..." aria-describedby="form-item-search" />
            </div>
        </div>
    </div>
</template>
<style scoped>
::v-deep .select2-container {
    margin: 0;
    width: 100% !important;
    display: inline-block;
    position: relative;
    vertical-align: middle;
    box-sizing: border-box;
}

::v-deep .select2-container--default .select2-selection--single .select2-selection__arrow b {
    margin-top: 3px;
}

::v-deep .select2-container .select2-selection--single {
    box-sizing: border-box;
    cursor: pointer;
    display: block;
    height: 50px;
    user-select: none;
    -webkit-user-select: none;
    border-radius: 6px;
    color: #676767;
    height: calc(1.53em + 0.875rem + 2px);

}

::v-deep .select2-container--default .select2-selection--single .select2-selection__rendered {
    line-height: 2.25rem;
    color: #697a8d;
    padding-left: 0.875rem;
}

.select2-container--default .select2-selection--single .select2-selection__arrow b {
    position: absolute;
    height: 12px;
    width: 17px;
    top: 40%;
    background-repeat: no-repeat;
    background-size: 17px 12px;
}
</style>