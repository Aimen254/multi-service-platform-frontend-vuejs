<script setup>
import { ref, onMounted } from 'vue';
import { useTagsApi } from '@composables/tagLevels';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import Button from '@components/core/Button.vue'
import { useHelper } from '@composables/helper';
import { useUserStore } from '@stores/user';
import { useProductApi } from '@composables/products';
import { useSettingsStore } from '@stores/settings';
import Error from '@components/core/Error.vue';
import { useModuleSettings } from '@composables/modules.js'
import { useTagStore } from '@/stores/tags.js';
import { useAttribute } from '@composables/attribute'
import { useBusinessApi } from '@composables/business'

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const { getBusinesses } = useBusinessApi()
const { levelTwoTags, levelThreeTags, levelFourTags } = useTagsApi();
const { singularProductTitle, priceTitle, itemContainerValidator, isBusinessModule, bodyStyleModule } = useModuleSettings()
const { getImage } = useHelper();
const userStore = useUserStore();
const tagStore = useTagStore();
const { errors, addProduct } = useProductApi();
const useSettings = useSettingsStore();
const levelOne = localStorage.getItem('levelOneId');
const { getAttributes, attributes, transform } = useAttribute();

const form = ref({
    name: '',
    level_two_tag: '',
    level_three_tag: '',
    level_four_tag: '',
    body_style: '',
    sellers_notes: '',
    stock_no: '',
    description: '',
    price: null,
    stock: 1,
    vin: '',
    trim: '',
    year: null,
    type: 'used',
    mileage: null,
    mpg: '',
    sku: ''

});

const levelTwoTag = ref([]);
const levelThreeTag = ref([]);
const levelFourTag = ref([]);
const loading = ref(false);
const url = ref(null);
const isSaved = ref(false)
const fileInputRef = ref('')
const businesses = ref([])
const bodyStyles = ref([]);

const onFileChange = (e) => {
    const file = e.target.files[0];
    isSaved.value = false;
    url.value = URL.createObjectURL(file);
}

const openFileDialog = () => {
    document.getElementById('upload').click();
}

const getL3Tags = async (event) => {
    loading.value = true;
    let l2 = event.id;
    levelThreeTag.value = await levelThreeTags(levelOne, l2, { 'inventory': true, limit: 50 }, false);
    loading.value = false;
}

const getL4Tags = async (event) => {
    loading.value = true;
    let l3 = event.id;
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

const submit = async () => {
    const formData = new FormData();
    if (fileInputRef.value.files.length > 0) {
        formData.append('image', fileInputRef.value.files[0]);
    }

    formData.append('name', form.value.name ?? '');
    formData.append('level_two_tag', form.value.level_two_tag ?? '');
    formData.append('level_three_tag', form.value.level_three_tag ?? '');
    formData.append('level_four_tags', form.value.level_four_tag ?? '');
    formData.append('body_style', form.value.body_style ?? '');
    formData.append('description', form.value.description ?? '');
    formData.append('user_id', userStore.user.id);
    formData.append('frontendFlag', true);
    formData.append('price', form.value.price ?? '');
    formData.append('stock_no', form.value.stock_no ?? '');
    formData.append('sellers_notes', form.value.sellers_notes ?? '');
    formData.append('type', form.value.type ?? '');
    formData.append('vin', form.value.vin ?? '');
    formData.append('trim', form.value.trim ?? '');
    formData.append('year', form.value.year ?? '');
    formData.append('mileage', form.value.mileage ?? '');
    formData.append('mpg', form.value.mpg ?? '')
    formData.append('sku', form.value.sku)

    await addProduct(levelOne, formData, 'garage.index');
}

const transformBusiness = async (data) => {
    const transformedData = data.map(item => {
        return {
            id: item.id,
            text: item.name,
        }
    })
    return transformedData
}

onMounted(async () => {
    levelTwoTag.value = await levelTwoTags(levelOne, { 'inventory': true, makers: true });

    if (bodyStyleModule()) {
        bodyStyles.value = await levelTwoTags(levelOne, { 'inventory': true, type: 'body_style' });
    }
});
</script>

<template>
    <div class="">
        <!-- Heading -->
        <div class="card-header">
            <h5>Basic Detail of {{ singularProductTitle }}</h5>
        </div>
        <div class="card-body">
            <form @submit.prevent="submit" enctype="multipart/form-data">
                <div class="row mb-3">
                    <!-- Image Upload -->
                    <div class="col-3">
                        <label for="upload" class="form-label mb-3 required">Image</label>
                        <div class="position-relative">
                            <div class="d-flex align-items-start align-items-sm-center gap-4">
                                <img :src="getImage(url, isSaved)" class="d-block rounded img-fluid"
                                    style="height: 160px; width: 240px;" id="uploadedFile" />
                            </div>
                            <div class="position-absolute profile-camera-icon" role="button" @click="openFileDialog">
                                <i class='bx bxs-camera'></i>
                                <input id="upload" type='file' ref="fileInputRef" @change="onFileChange" hidden
                                    accept="image/png, image/jpeg" />
                            </div>
                        </div>
                        <small v-if="useSettings.productDimensions">Main image must be
                            {{ useSettings.productDimensions }}</small>
                        <Error v-if="errors?.image" :message="errors?.image[0]"></Error>
                    </div>
                </div>
                <div class="row">
                    <!-- Title -->
                    <div class="col-md-6 mb-3" v-if="itemContainerValidator('productName')">
                        <label class="form-label required" for="title">{{ singularProductTitle }}</label>
                        <input type="text" v-model="form.name" id="title" class="form-control"
                            :class="{ 'is-invalid border border-danger': errors?.name }"
                            :placeholder="'Enter ' + singularProductTitle + ' Title'" />
                        <Error v-if="errors?.name" :message="errors.name[0]"></Error>
                    </div>

                    <!-- type -->
                    <div class="col-md-6 mb-3">
                        <label class="form-label required">Type</label>
                        <select class="form-select" v-model="form.type"
                            :class="{ 'is-invalid border border-danger': errors?.type }">
                            <option value="used">Used</option>
                            <option value="new">New</option>
                        </select>
                        <Error v-if="errors?.type" :message="errors.type[0]"></Error>
                    </div>
                </div>
                <div class="row">
                    <!-- Level Two -->
                    <div class="col-md-4">
                        <label class="form-label required" for="l2">Level Two Tags</label>
                        <Select2 v-model="form.level_two_tag"
                            :class="{ 'is-invalid border select2-invalid': errors?.level_two_tag }" :options="levelTwoTag"
                            @select="getL3Tags" placeholder="Select level two tag">
                        </Select2>
                        <Error v-if="errors?.level_two_tag" :message="errors.level_two_tag[0]"></Error>
                    </div>

                    <!-- Level Three -->
                    <div class="col-md-4 mb-3">
                        <label class="form-label required" for="l3">Level Three Tags</label>
                        <Select2 v-model="form.level_three_tag" :options="levelThreeTag" @select="getL4Tags"
                            :class="{ 'is-invalid border select2-invalid': errors?.level_three_tag }" :disabled="loading"
                            placeholder="Select level three tag">
                        </Select2>
                        <Error v-if="errors?.level_three_tag" :message="errors.level_three_tag[0]"></Error>
                    </div>

                    <!-- Level Four -->
                    <div class="col-md-4 mb-3">
                        <label class="form-label required" for="l4">Level Four Tags</label>
                        <Select2 v-model="form.level_four_tag" :options="levelFourTag" :disabled="loading"
                            :class="{ 'is-invalid border select2-invalid': errors?.level_four_tags }"
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
                    <div class="col-md-4 mb-3">
                        <label class="form-label"
                            :class="['automotive'].includes(tagStore.getLevelOneTagSlug) ? 'required' : ''"
                            for="price">Price</label>
                        <input type="text" v-model="form.price" id="price" class="form-control"
                            :class="{ 'is-invalid border border-danger': errors?.price }" :placeholder="`Enter Price`" />
                        <Error v-if="errors?.price" :message="errors.price[0]"></Error>
                    </div>

                    <!-- trim -->
                    <div class="col-md-4 mb-3" v-if="itemContainerValidator('trim')">
                        <label class="form-label" for="price">Trim</label>
                        <input type="text" v-model="form.trim" id="price" class="form-control"
                            :class="{ 'is-invalid border border-danger': errors?.trim }" :placeholder="`Enter Trim`" />
                        <Error v-if="errors?.trim" :message="errors.trim[0]"></Error>
                    </div>

                    <!-- milage -->
                    <div class="col-md-4 mb-3" v-if="itemContainerValidator('bodyStyle')">
                        <label class="form-label required" for="price">Mileage</label>
                        <input type="number" min="0" v-model="form.mileage" id="price" class="form-control"
                            :class="{ 'is-invalid border border-danger': errors?.mileage }" :placeholder="`Enter Mileage`" />
                        <Error v-if="errors?.mileage" :message="errors.mileage[0]"></Error>
                    </div>

                    <!-- Vin -->
                    <div class="col-md-4 mb-3" v-if="itemContainerValidator('bodyStyle')">
                        <label class="form-label required" for="price">Vin</label>
                        <input type="text" v-model="form.vin" id="price" class="form-control"
                            :class="{ 'is-invalid border border-danger': errors?.vin }" :placeholder="`Enter Vin`" />
                        <Error v-if="errors?.vin" :message="errors.vin[0]"></Error>
                    </div>

                    <!-- Year -->
                    <div class="col-md-4 mb-3">
                        <label class="form-label required" for="price">Year</label>
                        <VueDatePicker v-model="form.year" year-picker
                            :class="{ 'is-invalid border border-danger': errors?.year }" :placeholder="`Select Year`" />
                        <Error v-if="errors?.year" :message="errors.year[0]"></Error>
                    </div>

                    <!-- mpg -->
                    <div class="col-md-4 mb-3" v-if="itemContainerValidator('bodyStyle')">
                        <label class="form-label" for="price">Mpg</label>
                        <input type="text" v-model="form.mpg" id="price" class="form-control"
                            :class="{ 'is-invalid border border-danger': errors?.mpg }" :placeholder="`Enter Mpg`" />
                        <Error v-if="errors?.mpg" :message="errors.mpg[0]"></Error>
                    </div>

                    <!-- stock -->
                    <div class="col-md-4 mb-3">
                        <label class="form-label" for="price">Stock #</label>
                        <input type="text" v-model="form.stock_no" id="price" class="form-control"
                            :class="{ 'is-invalid border border-danger': errors?.stock_no }"
                            :placeholder="`Enter stock number`" />
                        <Error v-if="errors?.stock" :message="errors.stock_no[0]"></Error>
                    </div>

                    <!-- sku -->
                    <div class="col-md-4 mb-3">
                        <label class="form-label" for="price">Sku</label>
                        <input type="text" v-model="form.sku" id="price" class="form-control"
                            :class="{ 'is-invalid border border-danger': errors?.sku }" :placeholder="`Enter Sku`" />
                        <Error v-if="errors?.sku" :message="errors.sku[0]"></Error>
                    </div>
                </div>

                <div class="row mb-5">
                    <!-- Description -->
                    <div class="col-12">
                        <label class="form-label" for="desc">Seller Notes</label>
                        <QuillEditor v-model:content="form.sellers_notes" contentType="html" placeholder="Notes..."
                            @paste="handlePaste" />
                    </div>
                    <div class="col-12 mt-5" v-if="errors?.sellers_notes">
                        <Error class="mt-4" :message="errors.sellers_notes[0]"></Error>
                    </div>
                    <div class="col-12 mt-5">
                        <Button btnClasses="btn btn-primary mt-5">Save</Button>
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

.select2-invalid {
    border-color: red !important;
    border-radius: 7px !important;
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
    font-size: 1.7rem;
}</style>
