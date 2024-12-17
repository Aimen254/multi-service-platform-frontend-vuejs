<script setup>
import { ref, onBeforeMount } from 'vue';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import Button from '@components/core/Button.vue'
import Error from '@components/core/Error.vue';
import { useUserStore } from '@stores/user';
import { useProductApi } from '@composables/products';
import { useTagsApi } from '@composables/tagLevels';
import { useRoute } from 'vue-router';
import { useModuleSettings } from '@composables/modules';
import { useTagStore } from '@/stores/tags.js';
import { useBusinessApi } from '@composables/business'
// import { useAttribute } from '@composables/attribute'

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const { getBusinesses } = useBusinessApi()
const route = useRoute();
const { errors, updateProduct, editProduct, assignedTags, bodyStyles, productBodyStyle } = useProductApi();
const { levelTwoTags, levelThreeTags, levelFourTags } = useTagsApi();
const { priceTitle, itemContainerValidator, isCryptoCurrencyAcceptable, isDeliverable, isBusinessModule, author, hideShowItemsOnProductCard, productDescriptionTitle, singularProductTitle, priceTypeTitle, stockType } = useModuleSettings();
const userStore = useUserStore();
const tagStore = useTagStore();
// const { getAttributes, attributes, transform } = useAttribute();
const levelTwoTag = ref([]);
const levelThreeTag = ref([]);
const levelFourTag = ref([]);
const loading = ref(false);
const url = ref(null);
const isSaved = ref(false)
const productUuid = ref(null);
const levelOne = localStorage.getItem('levelOneId')
const businesses = ref([])
const nextRoute = ref(null);
const products = ref(null);
const form = ref({
    image_id: '',
    name: '',
    date_of_birth: '',
    date_of_death: '',
    level_two_tag: '',
    level_three_tag: '',
    level_four_tag: '',
    body_style: '',
    description: '',
    stock: 1,
    sellers_notes: '',
    stock_no: '',
    vin: '',
    trim: '',
    year: null,
    type: 'used',
    mileage: null,
    mpg: '',
    sku: '',
    body_style: '',
    is_commentable: false,
    cryptocurrency_accepted: false,
    is_deliverable: false,
    business_id: null,
    price: null,
    price_type: null
});

const transformBusiness = async (data) => {
    const transformedData = data.map(item => {
        return {
            id: item.id,
            text: item.name,
        }
    })
    return transformedData
}



const submit = async () => {
    const formData = new FormData();
    formData.append('name', form.value.name ?? '');
    formData.append('_method', 'put');
    formData.append('date_of_birth', form.value.date_of_birth ?? '');
    formData.append('date_of_death', form.value.date_of_death ?? '');
    formData.append('level_two_tag', form.value.level_two_tag ?? '');
    formData.append('level_three_tag', form.value.level_three_tag ?? '');
    formData.append('level_four_tags', form.value.level_four_tag ?? '');
    formData.append('description', form.value.description ?? '');
    formData.append('is_commentable', form.value.is_commentable ?? false);
    formData.append('type', form.value.type ?? '');
    formData.append('vin', form.value.vin ?? '');
    formData.append('trim', form.value.trim ?? '');
    formData.append('year', form.value.year ?? '');
    formData.append('mileage', form.value.mileage ?? '');
    formData.append('mpg', form.value.mpg ?? '')
    formData.append('sku', form.value.sku)
    formData.append('pickup_location', form.value.pickup_location)

    if (!isBusinessModule() || route.name === 'garage.edit') {
        formData.append('user_id', userStore.user.id);
    } else {
        formData.append('business_id', form.value.business_id ?? '')
    }
    formData.append('price', form.value.price ?? '')
    formData.append('price_type', form.value.price_type)
    formData.append('frontendFlag', true);

    if (itemContainerValidator.value('price')) {
        formData.append('price', form.value.price ?? '');
    }

    if (itemContainerValidator.value('bodyStyle')) {
        formData.append('body_style', form.value.body_style ?? []);
    }

    if (itemContainerValidator.value('condition')) {
        formData.append('condition', form.value.condition ?? '');
    }

    if (itemContainerValidator.value('stock')) {
        formData.append('stock', form.value.stock ?? '');
    }

    if (itemContainerValidator.value('stockNo')) {
        formData.append('stock_no', form.value.stock_no ?? '');
    }

    if (itemContainerValidator.value('sellerNotes')) {
        formData.append('sellers_notes', form.value.sellers_notes ?? '');
    }

    if (itemContainerValidator.value('weight')) {
        formData.append('weight', form.value.weight ?? '');
        formData.append('weight_unit', form.value.weight_unit ?? '');
    }

    if (isCryptoCurrencyAcceptable) {
        formData.append('cryptocurrency_accepted', form.value.cryptocurrency_accepted ?? false);
    }

    if (isDeliverable) {
        formData.append('is_deliverable', form.value.is_deliverable ?? false);
    }

    await updateProduct(levelOne, productUuid.value, formData, nextRoute.value);
}

const getL3Tags = async (event) => {
    levelFourTag.value = [];
    loading.value = true;
    let l2 = products.value ? form.value.level_two_tag : event.id;
    levelThreeTag.value = await levelThreeTags(levelOne, l2, { 'inventory': true, limit: 50, business_id: form.value.business_id }, false);
    loading.value = false;
}

const getL4Tags = async (event) => {
    loading.value = true;
    let l3 = products.value ? form.value.level_three_tag : event.id;
    levelFourTag.value = await levelFourTags(levelOne, form.value.level_two_tag, l3, { limit: 50, 'product': true, inventory: true }, false);
    loading.value = false;
}
const handlePaste = (e) => {
    // Get the clipboard data
    const clipboardData = e.clipboardData || window.clipboardData;
    const items = clipboardData.items;

    // Check if there are any image files in the clipboard
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            // If an image is found, prevent the default paste behavior
            e.preventDefault();
            return false;
        }
    }
}

const getLevelTwoTags = async (event, type = null) => {
    if (itemContainerValidator.value('changeLevelTwoOnType')) {
        levelTwoTags.value = []
        levelThreeTag.value = []
        levelFourTag.value = []
        form.value.level_two_tag = ''
        form.value.level_three_tag = ''
        form.value.level_four_tag = ''
        levelTwoTag.value = await levelTwoTags(levelOne, { 'inventory': true, type: form.value.type });
    }

    if (type == 'business') {
        levelTwoTags.value = []
        levelThreeTag.value = []
        levelFourTag.value = []
        form.value.level_two_tag = ''
        form.value.level_three_tag = ''
        form.value.level_four_tag = ''
        levelTwoTag.value = await levelTwoTags(levelOne, { 'inventory': true, with_user_address: true, business_id: event.id });
    }
}

onBeforeMount(async () => {
    route.name === 'garage.edit' ? nextRoute.value = 'garage.media' : nextRoute.value = 'articles.media';
    productUuid.value = route.params.uuid;
    products.value = await editProduct(levelOne, productUuid.value, true, { disableStatusFilter: true });
    if (isBusinessModule()) {
        const result = await getBusinesses(levelOne, {
            user_id: userStore.user.id,
            active_business: true,
            limit: 20,
        })
        businesses.value = await transformBusiness(result)
    }

    let oldTag = null;
    oldTag = products.value?.condition;
    url.value = products.value ? products.value.main_image : null;
    isSaved.value = url.value ? true : false;
    form.value = {
        name: products.value?.name ?? '',
        level_two_tag: products.value.level_two_tag.id ?? '',
        level_three_tag: products.value.level_three_tag.id ?? '',
        level_four_tag: products.value.level_four_tag.id ?? '',
        // condition: assignedTags.value?.id,
        removed_tag: oldTag,
        price: products.value?.price ?? null,
        stock: products.value?.stock,
        weight: products.value?.weight,
        vin: products.value?.vehicle?.vin ?? '',
        trim: products.value?.vehicle?.trim ?? '',
        year: products.value?.vehicle?.year ?? '',
        body_style: productBodyStyle.value.id ?? [],
        type: products.value?.vehicle?.type ?? 'used',
        mileage: products.value?.vehicle?.mileage ?? '',
        mpg: products.value?.vehicle?.mpg ?? '',
        stock_no: products.value?.vehicle?.stock_no ?? '',
        sellers_notes: products.value?.vehicle?.sellers_notes ?? '',
        sku: products.value?.sku ?? '',
        weight_unit: products.value?.weight_unit,
        description: products.value?.description ?? '',
        is_featured: products.value?.is_featured ? true : false,
        is_commentable: products.value?.is_commentable ? true : false,
        cryptocurrency_accepted: products.value?.cryptocurrency_accepted ? true : false,
        is_deliverable: products.value?.is_deliverable ? true : false,
        date_of_birth: products.value.date_of_birth ?? '',
        date_of_death: products.value.date_of_death ?? '',
        business_id: products.value.business?.id ?? null,
        pickup_location: products.value.pickup_location ?? null,
        price_type: products.value.price_type ? products.value.price_type : tagStore.getLevelOneTagSlug === 'employment' ? 'hourly' : 'fixed',
        type: products.value.type ? products.value.type : itemContainerValidator.value('productType') && !itemContainerValidator.value('productName') ? 'legal' : 'used',
    }
    levelTwoTag.value = await levelTwoTags(levelOne, { 'inventory': true, makers: itemContainerValidator.value('makers') ? true : null, type: itemContainerValidator.value('changeLevelTwoOnType') ? form.value.type : '', business_id: form.value.business_id }, false);
    levelThreeTag.value = getL3Tags();
    levelFourTag.value = getL4Tags();
});
</script>

<template>
    <div class="">
        <div class="card-body">
            <form @submit.prevent="submit" enctype="multipart/form-data">
                <div class="row">
                    <!-- Title -->
                    <div class="col-md-6 mb-3" v-if="itemContainerValidator('productName')">
                        <label class="form-label required" for="title">{{ singularProductTitle }} Name</label>
                        <input type="text" v-model="form.name" id="title" class="form-control"
                            :class="{ 'is-invalid border border-danger': errors?.name }"
                            :placeholder="'Enter ' + singularProductTitle.toLowerCase() + ' title'" />
                        <Error v-if="errors?.name" :message="errors.name[0]"></Error>
                    </div>
                    <!-- type -->
                    <div class="col-md-6 mb-3" v-if="itemContainerValidator('productType')">
                        <label class="form-label required">Type</label>
                        <select class="form-select" v-model="form.type" @change="getLevelTwoTags($event)"
                            :class="{ 'is-invalid border border-danger': errors?.type }">
                            <option :value="!['notices'].includes(tagStore.getLevelOneTagSlug) ? 'used' : 'legal'">{{
                                !['notices'].includes(tagStore.getLevelOneTagSlug) ? 'Used' : 'Legal' }}</option>
                            <option :value="!['notices'].includes(tagStore.getLevelOneTagSlug) ? 'new' : 'public'">{{
                                !['notices'].includes(tagStore.getLevelOneTagSlug) ? 'New' : 'Public' }}</option>
                        </select>
                        <Error v-if="errors?.type" :message="errors.type[0]"></Error>
                    </div>
                </div>
                <div class="row mb-3" v-if="hideShowItemsOnProductCard('DOB_DOD')">
                    <div class="col-md-6">
                        <label class="form-label required">Date of Birth</label>
                        <VueDatePicker format="MM/dd/yyyy" :year-range="[1800, new Date().getFullYear()]" utc
                            v-model="form.date_of_birth" placeholder="Select date of birth"
                            :class="{ 'is-invalid border border-danger': errors?.date_of_birth }"
                            :enable-time-picker="false" />
                        <Error v-if="errors?.date_of_birth" :message="errors.date_of_birth[0]"></Error>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label required">Date of Death</label>
                        <VueDatePicker format="MM/dd/yyyy" :year-range="[1800, new Date().getFullYear()]" utc
                            v-model="form.date_of_death" placeholder="Select date of death"
                            :class="{ 'is-invalid border border-danger': errors?.date_of_death }"
                            :enable-time-picker="false" />
                        <Error v-if="errors?.date_of_death" :message="errors.date_of_death[0]"></Error>
                    </div>
                </div>
                <div class="row mb-3">
                    <!-- business -->
                    <div class="col-md-4 mb-3"
                        v-if="(itemContainerValidator('companies') && route.name === 'articles.edit') || itemContainerValidator('organization')">
                        <label class="form-label required">{{ author }}</label>
                        <Select2 v-model="form.business_id" @select="getLevelTwoTags($event, 'business')"
                            :class="{ 'is-invalid border select2-invalid': errors?.business_id }" :options="businesses"
                            :placeholder="'Select ' + author.toLowerCase()">
                        </Select2>
                        <Error v-if="errors?.business_id" :message="errors.business_id[0]"></Error>
                    </div>

                    <!-- Level Two -->
                    <div class="col-md-4">
                        <label class="form-label required" for="l2">Level Two Tags</label>
                        <Select2 v-model="form.level_two_tag" :options="levelTwoTag" @select="getL3Tags"
                            placeholder="Select level two tag">
                        </Select2>
                        <Error v-if="errors?.level_two_tag" :message="errors.level_two_tag[0]"></Error>
                    </div>

                    <!-- Level Three -->
                    <div class="col-md-4 mb-3">
                        <label class="form-label required" for="l3">Level Three Tags</label>
                        <Select2 v-model="form.level_three_tag" :options="levelThreeTag" @select="getL4Tags"
                            :disabled="loading" placeholder="Select level three tag">
                        </Select2>
                        <Error v-if="errors?.level_three_tag" :message="errors.level_three_tag[0]"></Error>
                    </div>

                    <!-- Level Four -->
                    <div class="col-md-4 mb-3">
                        <label class="form-label required" for="l4">Level Four Tags</label>
                        <Select2 v-model="form.level_four_tag" :options="levelFourTag" :disabled="loading"
                            placeholder="Select level four tag">
                        </Select2>
                        <Error v-if="errors?.level_four_tags" :message="errors.level_four_tags[0]"></Error>
                    </div>

                    <!-- Body Styles -->
                    <div class="col-md-4" v-if="itemContainerValidator('bodyStyle')">
                        <label class="form-label" for="body-styles">Body Styles</label>
                        <Select2 v-model="form.body_style"
                            :class="{ 'is-invalid border select2-invalid': errors?.body_style }" :options="bodyStyles"
                            placeholder="Select body style">
                        </Select2>
                        <Error v-if="errors?.body_style" :message="errors.body_style[0]"></Error>
                    </div>
                    <!-- Price -->
                    <div class="col-md-4 mb-3"
                        v-if="itemContainerValidator('price') && !itemContainerValidator('organization')">
                        <label class="form-label" :class="itemContainerValidator('requiredPrice') ? 'required' : ''"
                            for="price">{{ priceTitle }}</label>
                        <input type="text" v-model="form.price" id="price" class="form-control"
                            :class="{ 'is-invalid border border-danger': errors?.price }"
                            :placeholder="`Enter ${priceTitle.toLowerCase()}`" />
                        <Error v-if="errors?.price" :message="errors.price[0]"></Error>
                    </div>
                    <!-- Trim -->
                    <div class="col-md-4 mb-3" v-if="itemContainerValidator('trim')">
                        <label class="form-label" for="trim">Trim</label>
                        <input type="text" v-model="form.trim" id="trim" class="form-control"
                            :class="{ 'is-invalid border border-danger': errors?.trim }" :placeholder="`Enter Trim`" />
                        <Error v-if="errors?.trim" :message="errors.trim[0]"></Error>
                    </div>

                    <!-- Stock -->
                    <div class="col-md-4 mb-3" v-if="itemContainerValidator('stockNo')">
                        <label class="form-label" for="stock">Stock #</label>
                        <input type="text" v-model="form.stock_no" id="stock" class="form-control"
                            :class="{ 'is-invalid border border-danger': errors?.stock_no }"
                            placeholder="Enter stock number" />
                        <Error v-if="errors?.stock" :message="errors.stock[0]"></Error>
                    </div>
                    <!-- milage -->
                    <div class="col-md-4 mb-3" v-if="itemContainerValidator('bodyStyle')">
                        <label class="form-label required" for="milage">Mileage</label>
                        <input type="number" min="0" v-model="form.mileage" id="milage" class="form-control"
                            :class="{ 'is-invalid border border-danger': errors?.mileage }"
                            :placeholder="`Enter Mileage`" />
                        <Error v-if="errors?.mileage" :message="errors.mileage[0]"></Error>
                    </div>

                    <!-- Vin -->
                    <div class="col-md-4 mb-3" v-if="itemContainerValidator('bodyStyle')">
                        <label class="form-label required" for="vin">Vin</label>
                        <input type="text" v-model="form.vin" id="vin" class="form-control"
                            :class="{ 'is-invalid border border-danger': errors?.vin }" :placeholder="`Enter Vin`" />
                        <Error v-if="errors?.vin" :message="errors.vin[0]"></Error>
                    </div>
                    <!-- Year -->
                    <div class="col-md-4 mb-3" v-if="itemContainerValidator('productYear')">
                        <label class="form-label required" for="year">Year</label>
                        <VueDatePicker v-model="form.year" year-picker
                            :class="{ 'is-invalid border border-danger': errors?.Year }" :placeholder="`Select Year`" />
                        <Error v-if="errors?.Year" :message="errors.Year[0]"></Error>
                    </div>


                    <!-- mpg -->
                    <div class="col-md-4 mb-3" v-if="itemContainerValidator('bodyStyle')">
                        <label class="form-label" for="mpg">Mpg</label>
                        <input type="text" v-model="form.mpg" id="mpg" class="form-control"
                            :class="{ 'is-invalid border border-danger': errors?.mpg }" :placeholder="`Enter Mpg`" />
                        <Error v-if="errors?.mpg" :message="errors.mpg[0]"></Error>
                    </div>

                    <!-- sku -->
                    <div class="col-md-4 mb-3" v-if="itemContainerValidator('sku')">
                        <label class="form-label" for="sku">Sku</label>
                        <input type="text" v-model="form.sku" id="sku" class="form-control"
                            :class="{ 'is-invalid border border-danger': errors?.sku }" :placeholder="`Enter Sku`" />
                        <Error v-if="errors?.sku" :message="errors.sku[0]"></Error>
                    </div>
                    <div class="col-md-4 mb-3" v-if="itemContainerValidator('priceType')">
                        <label class="form-label required">{{ priceTypeTitle }}</label>
                        <select class="form-select" v-model="form.price_type"
                            :class="{ 'is-invalid border border-danger': errors?.price_type }">
                            <option value="fixed" v-if="!itemContainerValidator('priceTypeOptions')">Fixed</option>
                            <option value="hourly">Hourly</option>
                            <option value="monthly" v-if="itemContainerValidator('priceTypeOptions')">Monthly</option>
                            <option value="yearly" v-if="itemContainerValidator('priceTypeOptions')">Yearly</option>
                        </select>
                        <Error v-if="errors?.price_type" :message="errors.price_type[0]"></Error>
                    </div>

                    <!-- Stock -->
                    <div class="col-md-4 mb-3" v-if="itemContainerValidator('stock')">
                        <label class="form-label required" for="stock">{{ stockType }}</label>
                        <input type="text" v-model="form.stock" id="stock" class="form-control"
                            :class="{ 'is-invalid border border-danger': errors?.stock }"
                            placeholder="Enter available items" />
                        <Error v-if="errors?.stock" :message="errors.stock[0]"></Error>
                    </div>

                    <!-- Weight -->
                    <div class="col-md-4 mb-3" v-if="itemContainerValidator('weight')">
                        <label class="form-label" for="weight">Weight</label>
                        <input type="text" v-model="form.weight" id="weight" class="form-control"
                            :class="{ 'is-invalid border border-danger': errors?.weight }" placeholder="Enter weight" />
                        <Error v-if="errors?.weight" :message="errors.weight[0]"></Error>
                    </div>

                    <!-- Weight Unit -->
                    <div class="col-md-4 mb-3" v-if="itemContainerValidator('weight')">
                        <label class="form-label" for="weight_unit">Weight Unit</label>
                        <Select2 v-model="form.weight_unit"
                            :options="[{ id: 'kg', text: 'KG' }, { id: 'pound', text: 'Pound' }]"
                            placeholder="Select weight unit">
                        </Select2>
                        <Error v-if="errors?.weight_unit" :message="errors.weight_unit[0]"></Error>
                    </div>

                    <div class="col-md-4 mb-3" v-if="itemContainerValidator('pickup-location')">
                        <label class="form-label" :class="itemContainerValidator('requiredPrice') ? 'required' : ''"
                            for="price">Location</label>
                        <input type="text" v-model="form.pickup_location" id="location" class="form-control"
                            :class="{ 'is-invalid border border-danger': errors?.pickup_location }"
                            :placeholder="`Enter ${'Location'.toLowerCase()}`" />
                        <Error v-if="errors?.pickup_location" :message="errors.pickup_location[0]"></Error>
                    </div>
                </div>

                <div class="row mb-5">
                    <div class="col-12">
                        <label class="form-label" for="desc"
                            :class="[itemContainerValidator('requiredDescripiton') ? 'required' : '']">{{
                                productDescriptionTitle
                            }}</label>
                        <QuillEditor v-model:content="form.sellers_notes" contentType="html"
                            :placeholder="'Compose ' + productDescriptionTitle.toLowerCase() + '...'" @paste="handlePaste"
                            v-if="itemContainerValidator('sellerNotes')" />

                        <QuillEditor v-model:content="form.description" contentType="html"
                            :placeholder="'Compose ' + productDescriptionTitle.toLowerCase() + '...'" @paste="handlePaste"
                            v-else />
                    </div>
                    <div class="col-12 mt-5" v-if="errors?.sellers_notes">
                        <Error class="mt-4" :message="errors.sellers_notes[0]"></Error>
                    </div>
                    <div class="col-12 mt-5" v-if="errors?.description">
                        <Error class="mt-4" :message="errors.description[0]"></Error>
                    </div>
                    <div class="col-12 mt-5">
                        <div class="row">
                            <div :class="isCryptoCurrencyAcceptable && isDeliverable ? 'col-lg-8' : 'col-lg-6'"
                                class="d-flex justify-content-between mt-5">

                                <!-- Crypto Currency checkbox -->
                                <span v-if="isCryptoCurrencyAcceptable">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="cryptocurrency_accepted"
                                            :checked="form?.cryptocurrency_accepted" v-model="form.cryptocurrency_accepted"
                                            name="cryptocurrency_accepted" />
                                        <label class="form-check-label" for="cryptocurrency_accepted">
                                            Crypto Currency Accepted ?
                                        </label>
                                    </div>
                                    <Error v-if="errors?.cryptocurrency_accepted"
                                        :message="errors?.cryptocurrency_accepted[0]"></Error>
                                </span>

                                <!-- Deliverable checkbox -->
                                <span v-if="isDeliverable">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="is_deliverable"
                                            :checked="form?.is_deliverable" v-model="form.is_deliverable"
                                            name="is_deliverable" />
                                        <label class="form-check-label" for="is_deliverable">
                                            Deliverable ?
                                        </label>
                                    </div>
                                    <Error v-if="errors?.is_deliverable" :message="errors?.is_deliverable[0]"></Error>
                                </span>

                                <!-- Commentable checkbox -->
                                <span v-if="itemContainerValidator('comments')">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="is_commentable"
                                            :checked="form?.is_commentable" v-model="form.is_commentable"
                                            name="is_commentable" />
                                        <label class="form-check-label" for="is_commentable">
                                            Commentable ?
                                        </label>
                                    </div>
                                    <Error v-if="errors?.is_commentable" :message="errors?.is_commentable[0]"></Error>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 mt-3 d-flex justify-content-end">
                        <Button btnClasses="btn btn-primary">Next</Button>
                    </div>
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

::v-deep .dp__main {
    border-radius: 5px !important;
}

::v-deep .select2-container .select2-selection--single {
    box-sizing: border-box;
    cursor: pointer;
    display: block;
    height: 50px;
    user-select: none;
    -webkit-user-select: none;
    border-radius: 6px;
    border-color: #d9dee3 !important;
    color: #697a8d;
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


.profile-camera-icon {
    width: 2rem;
    height: 2rem;
    top: 41%;
    left: 42%;
    color: white !important;
}

.bxs-camera {
    font-size: 2rem;
}

::v-deep.vue-tags-input {
    max-width: 100% !important;
    min-height: 270px;
    border: 1px solid #B4BDC6 !important;
    border-radius: 6px !important;
}

::v-deep.vue-tags-input .ti-input {
    border: none !important;
}

::v-deep.vue-tags-input .ti-tag {
    position: relative;
    background: #FF6846;
    color: white !important;
    cursor: pointer !important;
    padding: 0.5rem !important;
    border-radius: 4px !important;
}

::v-deep.vue-tags-input .ti-selected-item {
    background: #FF6846 !important;
    color: white !important;
    cursor: pointer !important;
}

::v-deep.vue-tags-input .ti-autocomplete {
    max-height: 40vh !important;
    overflow-y: scroll;
}
</style>