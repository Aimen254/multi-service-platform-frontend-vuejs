<script setup>
import { ref, computed, inject, onMounted, onBeforeUnmount } from 'vue';
import Modal from '../core/Modal.vue';
import { useTagStore } from '@/stores/tags'
import { useTagsApi } from '@composables/tagLevels.js'
import { useToastr } from '@/composables/toastr'
import { useCategoriesApi } from '@composables/categories.js'
import { useModuleSettings } from '@composables/modules';
import VueDatePicker from '@vuepic/vue-datepicker'
import Error from '@components/core/Error.vue';


const eventBus = inject('eventBus')
const tagStore = useTagStore()
const { errors, addCategory, editMyCategory } = useCategoriesApi()
const { levelTwoTags, levelThreeTags, levelFourTags } = useTagsApi();
const { itemContainerValidator } = useModuleSettings();
const { toast } = useToastr()

const showModal = ref(false)
// level options
const levelTwoTagsOptions = ref([])
const levelThreeTagsOptions = ref([])
const levelFourTagsOptions = ref([])
const myCategoryModal = ref(null)
const selectedLevelFourSlug = ref(null)
const theAllTag = ref(null)

const category = ref(null)
const levelOne = ref(tagStore.getLevelOneTagSlug)

// form this name of fields are used by api
const form = ref({
    module: levelOne.value,
    make_id: null,
    model_id: null,
    level_four_tag_id: null
})

const closeModal = () => {
    const modal = document.getElementById('modalCenter')
    showModal.value = false
    modal.classList.remove('show');
    modal.style.display = 'none'

    category.value = null
    // emptiy form
    form.value.module = levelOne.value
    form.value.make_id = null
    form.value.model_id = null
    form.value.level_four_tag_id = null
    levelThreeTagsOptions.value = [];
    levelFourTagsOptions.value = [];
}

// get level tags functions
const getLevelThreeTags = async () => {
    levelThreeTagsOptions.value = [];
    levelFourTagsOptions.value = [];
    try {
        const result = await levelThreeTags(levelOne.value, form.value.make_id, { limit: 20 }, true, myCategoryModal.value)
        levelThreeTagsOptions.value = result
    } catch (error) {
        toast(error, 'error')
    }
}

const getLevelFourTags = async () => {
    try {
        const result = await levelFourTags(levelOne.value, form.value.make_id, form.value.model_id, { limit: 20 }, true, myCategoryModal.value)
        levelFourTagsOptions.value = result
    } catch (error) {
        toast(error, 'error')
    }
}

const changeLevelTwoTag = async () => {
    form.value.model_id = null;
    form.value.level_four_tag_id = null;
    await getLevelThreeTags();
}

const selectedLevelFourtag = (e) => {
    selectedLevelFourSlug.value = e.slug
}

const disableUntilFormFilled = computed(() => {
    if (itemContainerValidator.value('productYear')) {
        return !(form.value.make_id && form.value.model_id && form.value.level_four_tag_id && form.value.from && form.value.to) ? true : false
    }

    if(itemContainerValidator.value('minMaxPrice')) {
        return !(form.value.make_id && form.value.model_id && form.value.level_four_tag_id && form.value.min_price && form.value.max_price) ? true : false
    }
    return !(form.value.make_id && form.value.model_id && form.value.level_four_tag_id) ? true : false;
})

// submit catgories
const submit = async () => {
    let response;
    try {
        // set level four tag null if select tag value is all while creation and updation in automotive and boat case
        if (tagStore.getLevelOneTagSlug == 'automotive' && (selectedLevelFourSlug.value == 'all')) {
            form.value.level_four_tag_id = null
        }
        if (category.value) {
            response = await editMyCategory(tagStore.getLevelOneTagSlug, category.value, form.value, myCategoryModal.value)
        } else {
            response = await addCategory(tagStore.getLevelOneTagSlug, form.value, myCategoryModal.value)
        }
        response && (form.value.make_id = null)
        response && (form.value.model_id = null)
        response && (form.value.level_four_tag_id = null)
        response && (form.value.from = null)
        response && (form.value.to = null)
        response && (form.value.min_price = null)
        response && (form.value.max_price = null)
        response && (closeModal())
    } catch (error) {
    }
}


onMounted(async () => {
    eventBus.on('openModal', async (args) => {
        levelOne.value = tagStore.getLevelOneTagSlug
        const modal = document.getElementById('modalCenter')
        modal.classList.add('show');
        modal.style.display = 'block'
        showModal.value = true
        const result = await levelTwoTags(tagStore.getLevelOneTagSlug, { limit: 20 }, true, myCategoryModal.value)
        levelTwoTagsOptions.value = result
        form.value.module = levelOne.value
        if (args) {
            category.value = args.category
            form.value.make_id = args.category.maker.id
            form.value.model_id = args.category.model.id
            form.value.level_four_tag_id = args.category.level_four_tag.id

            // set 'from' and 'to' inputs
            if (itemContainerValidator.value('productYear')) {
                form.value.from = args.category?.from
                form.value.to = args.category?.to
            }

            if(itemContainerValidator.value('minMaxPrice')) {
                form.value.min_price = args.category?.min_price
                form.value.max_price = args.category?.max_price
            }

            // call apis
            await getLevelThreeTags()
            await getLevelFourTags()

            // set level four tag as 'all' tag when level four tag empty
            if (Object.keys(args.category?.level_four_tag).length === 0) {
                theAllTag.value = levelFourTagsOptions.value.find(tag => tag.slug === 'all');
                form.value.level_four_tag_id = theAllTag.value.id
            }
        }
    });
})

onBeforeUnmount(() => {
    eventBus.off('openModal'); // Remove the event listener
});
</script>

<template>
    <div>
        <transition name="modal" mode="out-in">
            <Modal :id="'modalCenter'" :modal="showModal" @close="closeModal">
                <template #modal-header>
                    <!-- Your modal header content goes here -->
                    <h5 class="modal-title" id="modalCenterTitle">Add My Categories</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                        @click="closeModal"></button>
                </template>
                <form action="">

                </form>
                <template #modal-body>
                    <!-- Your modal body content goes here -->
                    <div class="row" ref="myCategoryModal">
                        <div class="col-12 mb-3">
                            <label for="Level Two Tags" class="form-label required">Level Two Tags</label>
                            <Select2 v-model="form.make_id" :options="levelTwoTagsOptions" @select="changeLevelTwoTag"
                                placeholder="Select level two tag" :settings="{ dropdownParent: '#modalCenter' }">
                            </Select2>
                        </div>

                        <div class="col-12 mb-3" v-if="levelThreeTagsOptions.length > 0">
                            <label for="Level Three Tags" class="form-label required">Level Three Tags</label>
                            <Select2 :options="levelThreeTagsOptions" v-model="form.model_id" @select="getLevelFourTags"
                                placeholder="Select level three tag" :settings="{ dropdownParent: '#modalCenter' }">
                            </Select2>
                        </div>

                        <div class="col-12 mb-3" v-if="levelFourTagsOptions.length > 0">
                            <label for="Level Four Tags" class="form-label required">Level Four Tags</label>
                            <Select2 :options="levelFourTagsOptions" v-model="form.level_four_tag_id"
                                @select="selectedLevelFourtag" placeholder="Select level four tag"
                                :settings="{ dropdownParent: '#modalCenter' }">
                            </Select2>
                        </div>

                        <div class="col-12 mb-3"
                            v-if="levelFourTagsOptions.length > 0 && itemContainerValidator('productYear')">
                            <div class="row">
                                <div class="col-lg-6">
                                    <label class="form-label required" for="from">From</label>
                                    <VueDatePicker id="from" v-model="form.from" year-picker
                                        :year-range="[1900, new Date().getFullYear()]" placeholder="e.g., 2001" />
                                </div>
                                <div class="col-lg-6">
                                    <label class="form-label required" for="to">To</label>
                                    <VueDatePicker id="to" v-model="form.to" year-picker :disabled="!form.from"
                                        :year-range="[form.from, new Date().getFullYear()]" placeholder="e.g., 2004" />
                                </div>
                            </div>
                        </div>

                        <div class="col-12 mb-3"
                            v-if="levelFourTagsOptions.length > 0 && itemContainerValidator('minMaxPrice')">
                            <div class="row">
                                <div class="col-lg-6">
                                    <label class="form-label required" for="min">Minimum Price</label>
                                    <input type="text" v-model="form.min_price" id="min" class="form-control"
                                        :class="{ 'is-invalid border border-danger': errors?.min_price }"
                                        placeholder="Enter minimum Price" />
                                    <Error v-if="errors?.min_price" :message="errors.min_price[0]"></Error>
                                </div>
                                <div class="col-lg-6">
                                    <label class="form-label required" for="max">Maximum Price</label>
                                    <input type="text" v-model="form.max_price" id="min" class="form-control"
                                        :class="{ 'is-invalid border border-danger': errors?.max_price }"
                                        placeholder="Enter minimum Price" />
                                    <Error v-if="errors?.max_price" :message="errors.max_price[0]"></Error>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template #modal-footer>
                    <!-- Your modal footer content goes here -->
                    <button type="button" class="btn btn-label-secondary" @click="closeModal">Close</button>
                    <button type="submit" class="btn btn-primary" :disabled="disableUntilFormFilled"
                        @click="submit">Save</Button>
                </template>
            </Modal>
        </transition>
    </div>
</template>

<style scoped>
:deep(.select2-container) {
    margin: 0;
    width: 100% !important;
    display: inline-block;
    position: relative;
    vertical-align: middle;
    box-sizing: border-box;
}

:deep(.select2-container--default .select2-selection--single .select2-selection__arrow b) {
    margin-top: 3px;
}

:deep(.select2-container .select2-selection--single) {
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

:deep(.select2-container--default .select2-selection--single .select2-selection__rendered) {
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
