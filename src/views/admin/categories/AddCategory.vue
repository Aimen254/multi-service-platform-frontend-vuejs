<script setup>
import Button from '@components/core/Button.vue'
import { useTagsApi } from '@composables/tagLevels.js'
import { useToastr } from '@/composables/toastr'
import { onBeforeMount, ref, computed } from 'vue';
import { useModuleSettings } from '@composables/modules';
import VueDatePicker from '@vuepic/vue-datepicker';
import Error from '@components/core/Error.vue';
import { useRoute } from 'vue-router';

const route = useRoute()
// level store tags
import { useTagStore } from '@/stores/tags'
const tagStore = useTagStore()
const levelOne = route.params?.levelOneslug

const { toast } = useToastr()
const { levelTwoTags, levelThreeTags, levelFourTags } = useTagsApi();
const { itemContainerValidator } = useModuleSettings();

import { useCategoriesApi } from '@composables/categories.js'
const { errors, addCategory } = useCategoriesApi()

// level options
const levelTwoTagsOptions = ref([])
const levelThreeTagsOptions = ref([])
const levelFourTagsOptions = ref([])
const selectedLevelFourSlug = ref(null)

// form this name of fields are used by api
const form = ref({
    module: levelOne,
    make_id: null,
    model_id: null,
    level_four_tag_id: null,
    from: null,
    to: null,
    min_price: null,
    max_price: null
})

const buttonDisabled = computed(() => {
    switch (levelOne) {
        case 'automotive':
        case 'boats':
            return !form.value.make_id || !form.value.model_id || !form.value.level_four_tag_id || !form.value.from || !form.value.to;
        case 'real-estate':
            return !form.value.make_id || !form.value.model_id || !form.value.level_four_tag_id || !form.value.min_price || !form.value.max_price;
        default:
            return !form.value.make_id || !form.value.model_id || !form.value.level_four_tag_id;

    }
})

// get level tags functions
const getLevelThreeTags = async (e) => {
    try {
        const result = await levelThreeTags(levelOne, e.id, { limit: 20 }, true)
        levelThreeTagsOptions.value = result
    } catch (error) {
        toast(error, 'error')
    }
}

const getLevelFourTags = async (e) => {
    try {
        const result = await levelFourTags(levelOne, form.value.make_id, e.id, { limit: 20 }, true)
        levelFourTagsOptions.value = result
    } catch (error) {
        toast(error, 'error')
    }
}

const selectedLevelFourtag = (e) => {
    selectedLevelFourSlug.value = e.slug
}

// submit catgories
const submit = async () => {
    if (tagStore.getLevelOneTagSlug == 'automotive' && selectedLevelFourSlug.value == 'all') {
        form.value.level_four_tag_id = null
    }
    try {
        await addCategory(levelOne, form.value)
        form.value.make_id = null
        form.value.model_id = null
        form.value.level_four_tag_id = null
        form.value.from = null
        form.value.to = null
        form.value.min_price = null
        form.value.max_price = null
    } catch (error) {
        toast(error, 'error')
    }
}

onBeforeMount(async () => {
    try {
        const result = await levelTwoTags(levelOne, { limit: 20 })
        levelTwoTagsOptions.value = result
    } catch (error) {
        toast(error, 'error')
    }
})
</script>
<template>
    <div class="my-3">
        <h5 class="card-header">Add Category</h5>
        <div class="card-body">
            <form id="" method="POST" @submit.prevent="submit()">
                <div class="row">
                    <div class="mb-3 col-md-4">
                        <label for="Level Two Tags" class="form-label required">Level Two Tags</label>
                        <Select2 @click="getLevelTwoTags" v-model="form.make_id" :options="levelTwoTagsOptions"
                            @select="getLevelThreeTags" placeholder="Select level two tag">
                        </Select2>
                    </div>
                    <div class="mb-3 col-md-4" v-if="levelThreeTagsOptions.length > 0">
                        <label for="Level Three Tags" class="form-label required">Level Three Tags</label>
                        <Select2 :options="levelThreeTagsOptions" v-model="form.model_id" @select="getLevelFourTags"
                            placeholder="Select level three tag"></Select2>
                    </div>
                    <div class="mb-3 col-md-4" v-if="levelFourTagsOptions.length > 0">
                        <label for="Level Four Tags" class="form-label required">Level Four Tags</label>
                        <Select2 :options="levelFourTagsOptions" v-model="form.level_four_tag_id"
                            @select="selectedLevelFourtag" placeholder="Select level four tag"></Select2>
                    </div>
                    <div class="mb-3 col-md-4"
                        v-if="levelFourTagsOptions.length > 0 && itemContainerValidator('productYear')">
                        <label class="form-label required" for="from">From (year)</label>
                        <VueDatePicker v-model="form.from" year-picker :year-range="[1900, new Date().getFullYear()]"
                            :class="{ 'is-invalid border border-danger': errors?.from }" :placeholder="`Select Year`" />
                        <Error v-if="errors?.from" :message="errors.from[0]"></Error>
                    </div>

                    <div class="mb-3 col-md-4"
                        v-if="levelFourTagsOptions.length > 0 && itemContainerValidator('productYear')">
                        <label class="form-label required" for="to">To (year)</label>
                        <VueDatePicker v-model="form.to" year-picker :year-range="[form.from, new Date().getFullYear()]"
                            :disabled="!form.from" :class="{ 'is-invalid border border-danger': errors?.to }"
                            :placeholder="`Select Year`" />
                        <Error v-if="errors?.to" :message="errors.to[0]"></Error>
                    </div>

                    <div class="mb-3 col-md-4"
                        v-if="levelFourTagsOptions.length > 0 && itemContainerValidator('minMaxPrice')">
                        <label class="form-label required" for="min">Minimum Price</label>
                        <input type="number" v-model="form.min_price" id="min" class="form-control"
                            :class="{ 'is-invalid border border-danger': errors?.min_price }"
                            placeholder="Enter minimum Price" />
                        <Error v-if="errors?.min_price" :message="errors.min_price[0]"></Error>
                    </div>
                    <div class="mb-3 col-md-4"
                        v-if="levelFourTagsOptions.length > 0 && itemContainerValidator('minMaxPrice')">
                        <label class="form-label required" for="max">Maximum Price</label>
                        <input type="number" v-model="form.max_price" id="min" class="form-control"
                            :class="{ 'is-invalid border border-danger': errors?.max_price }"
                            placeholder="Enter minimum Price" />
                        <Error v-if="errors?.max_price" :message="errors.max_price[0]"></Error>
                    </div>
                </div>
                <div class="mt-2">
                    <Button type="submit" :btnClasses="'btn btn-primary me-2'" :disabled="buttonDisabled">Save</Button>
                </div>
            </form>
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

.w-100 {
    width: 6.25rem !important
}
</style>
