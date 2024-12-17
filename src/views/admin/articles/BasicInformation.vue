<script setup>
import { ref, onMounted, inject, computed } from 'vue';
import { useTagsApi } from '@composables/tagLevels';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import Button from '@components/core/Button.vue'
import { useHelper } from '@composables/helper';
import { useUserStore } from '@stores/user';
import { useProductApi } from '@composables/products';
import { useUser } from '@composables/user';

import Error from '@components/core/Error.vue';
import { useModuleSettings } from '@composables/modules.js'
import { useTagStore } from '@/stores/tags.js';
import { useAttribute } from '@composables/attribute';
import { useBusinessApi } from '@composables/business';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import TagComponent from '@components/core/TagComponent.vue'
import { useRoute } from 'vue-router';

const eventBus = inject('eventBus')


const { getBusinesses } = useBusinessApi()
const { formatErrorMessage } = useHelper()
const { levelTwoTags, levelThreeTags, levelFourTags } = useTagsApi();
const { singularProductTitle, priceTitle, itemContainerValidator, isBusinessModule, TooltipInformationL2, TooltipInformationL3, TooltipInformationL4, isCryptoCurrencyAcceptable, isDeliverable, author, hideShowItemsOnProductCard, productDescriptionTitle, priceTypeTitle, stockType, bodyStyleModule, requiredAttributesSlug } = useModuleSettings()

const userStore = useUserStore();
const tagStore = useTagStore();
const { userList, users } = useUser()
const { errors, addProduct, updateProduct, editProduct, productBodyStyle } = useProductApi();
const { getAttributes, attributes, transform, getSuggestions, assignedTags, requiredAttributes, optionalAttributes } = useAttribute();
const route = useRoute()
const attributeTags = ref([]);
const removedTags = ref([]);

const toolbarOptions = [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // Heading options
    ['bold', 'italic', 'underline'], // Basic formatting
    [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Lists
    [{ 'align': [] }], // Alignment options
    ['link'], // link
]

// search attribute tags
const fetchSuggetions = async (attributeId) => {
    attributeTags.value = [];
    let uniq = {}
    const response = await getSuggestions(levelOne, attributeId);
    response && (attributeTags.value = []);
    response && (attributeTags.value = response.standardTags.filter(obj => !uniq[obj.text.toLowerCase()] && (uniq[obj.text.toLowerCase()] = true)));
}

const form = ref({
    name: '',
    price: '',
    level_two_tag: '',
    level_three_tag: '',
    date_of_birth: '',
    date_of_death: '',
    level_four_tag: '',
    description: '',
    body_style: '',
    sellers_notes: '',
    stock_no: '',
    vin: '',
    trim: '',
    year: null,
    mileage: null,
    mpg: '',
    sku: '',
    is_commentable: true,
    cryptocurrency_accepted: false,
    is_deliverable: false,
    business_id: null,
    price: null,
    price_type: route.params?.levelOneslug === 'employment' ? 'hourly' : 'fixed',
    pickup_location: '',
    performer: '',
    ticket_url: '',
    max_price: '',
    event_location: '',
    away_team: '',
    event_date:'',
    type: ['notices'].includes(route.params?.levelOneslug) ? 'legal' : route.params?.levelOneslug == 'real-estate' ? 'for-sale' : 'used',
});

const levelTwoTag = ref([]);
const levelThreeTag = ref([]);
const levelFourTag = ref([]);
const loading = ref(false);
const product = ref(null);
const businesses = ref([])
const bodyStyles = ref([]);
const nextRoute = ref(null);
const levelOne = route.params?.levelOneslug;


const getL3Tags = async (event) => {
    levelFourTag.value = [];
    loading.value = true;
    if (itemContainerValidator.value('changeLevelTwoOnType')) {
        if (event) {
            form.value.type = event.slug === 'legal-notices' ? 'legal' : 'public'
        }
    }
    let l2 = product.value ? form.value.level_two_tag : event.id;
    levelThreeTag.value = await levelThreeTags(levelOne, l2, { 'inventory': true, limit: 50, business_id: form.value.business_id, user_id: itemContainerValidator.value('userSettings') ? userStore.user.id : null }, false);
    loading.value = false;
}

const getL4Tags = async (event) => {
    loading.value = true;
    let l3 = product.value ? form.value.level_three_tag : event.id;
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
    if (product.value) {
        formData.append('_method', 'put');
    }
    formData.append('date_of_birth', form.value.date_of_birth ?? '');
    formData.append('date_of_death', form.value.date_of_death ?? '');
    formData.append('name', form.value.name ?? '');
    formData.append('level_two_tag', form.value.level_two_tag ?? '');
    formData.append('level_three_tag', form.value.level_three_tag ?? '');
    formData.append('level_four_tags', form.value.level_four_tag ?? '');
    formData.append('description', form.value.description ?? '');
    formData.append('is_commentable', form.value.is_commentable ?? false);
    formData.append('type', form.value.type ?? '');
    formData.append('pickup_location', form.value.pickup_location ?? '');
    formData.append('user_id', form.value.user_id ?? '');
    formData.append('performer', form.value.performer ?? '');
    formData.append('ticket_url', form.value.ticket_url ?? '');
    formData.append('event_location', form.value.event_location ?? '');
    formData.append('away_team', form.value.away_team ?? '');
    formData.append('event_date', form.value.event_date ?? '');
    // set user id if no business or this form open in my garage
    if (!isBusinessModule() || route.name === 'garage.form') {
        formData.append('user_id', userStore.user.id);
    } else {
        formData.append('business_id', form.value.business_id ?? '')
    }
    formData.append('price_type', form.value.price_type)
    formData.append('frontendFlag', true);

    if (itemContainerValidator.value('price')) {
        formData.append('price', form.value.price ?? '');
    }

    if (itemContainerValidator.value('condition')) {
        formData.append('condition', form.value.condition ?? '');
    }

    if(itemContainerValidator.value('max-price')){
        formData.append('max_price', form.value.max_price ?? '');
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

    if (itemContainerValidator.value('bodyStyle')) {
        formData.append('body_style', form.value.body_style ?? '');
    }

    if (isCryptoCurrencyAcceptable) {
        formData.append('cryptocurrency_accepted', form.value.cryptocurrency_accepted ?? false);
    }

    if (isDeliverable) {
        formData.append('is_deliverable', form.value.is_deliverable ?? false);
    }

    if (itemContainerValidator.value('productType')) {
        formData.append('type', form.value.type ?? 'used');
    }

    if (itemContainerValidator.value('productYear')) {
        formData.append('year', form.value.year ?? '');
    }

    if (itemContainerValidator.value('bodyStyle')) {
        formData.append('vin', form.value.vin ?? '');
        formData.append('mpg', form.value.mpg ?? '');
        formData.append('mileage', form.value.mileage ?? '');
    }

    if (itemContainerValidator.value('trim')) {
        formData.append('trim', form.value.trim ?? '');
    }


    if (itemContainerValidator.value('sku')) {
        formData.append('sku', form.value.sku ?? '');
    }

    if (itemContainerValidator.value('attributeTags')) {
        const tagSlugs = attributes.value.map(tag => tag.slug);
        // Choose between assignedTags.value and tagSlugs based on the condition
        const tagsToAppend = tagSlugs
        const tagsObject = {};
        tagsToAppend.forEach(tag => tagsObject[tag] = []);

        const tagsArray = [tagsObject];

        // assing values to diffrent keys
        if (Object.keys(assignedTags.value).length !== 0) {
            Object.values(assignedTags.value).forEach(value => {
                if (typeof value === 'object') {
                    Object.keys(tagsArray[0]).forEach(key => {
                        value.attribute.forEach(element => {
                            if (element.slug === key) {
                                if (value.pivot?.attribute_id) {
                                    if (element.id == value.pivot?.attribute_id) {
                                        tagsArray[0][key].push(value);
                                    }
                                } else {
                                    tagsArray[0][key].push(value);
                                }
                            }
                        });
                    });
                }
            });
        }
        formData.append('tags', JSON.stringify(tagsArray));
        formData.append('removedTags', JSON.stringify(removedTags.value));
    }
    if (product.value) {
        await updateProduct(levelOne, product.value.uuid, formData, nextRoute.value);
    } else {
        await addProduct(levelOne, formData, nextRoute.value);
    }

}


const getLevelTwoTags = async (event, type = null) => {
    levelTwoTags.value = []
    levelThreeTag.value = []
    levelFourTag.value = []
    form.value.level_two_tag = ''
    form.value.level_three_tag = ''
    form.value.level_four_tag = ''
    levelTwoTag.value = await levelTwoTags(levelOne, { 'inventory': true, with_user_address: true, business_id: event.id,  makers: itemContainerValidator.value('makers') ? true : null });
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

const agents = ref(null);

const displayErrorMesage = computed(() => (error, slug) => {
    const matchingKey = Object.keys(error).find(key => key.includes(slug));
    if (matchingKey) {
        return formatErrorMessage(error[matchingKey][0]);
    }
})

const getAgents = async (business = null) => {
    if (business) {
        if (itemContainerValidator.value('real-estate-agent')) {
            await userList({ 'user_type': 'agent', 'business_id': business?.id })
            agents.value = users.value.map(item => {
                return {
                    ...item,
                    text: item.name,
                }
            })
        }
    }
}

onMounted(async () => {
    if (route.name === 'garage.form' && !itemContainerValidator.value('noMainImage')) {
        nextRoute.value = 'garage.media';
    } else if (route.name === 'articles.form' && !itemContainerValidator.value('noMainImage')) {
        nextRoute.value = 'articles.media';
    } else if (route.name === 'garage.form' && itemContainerValidator.value('noMainImage')) {
        nextRoute.value = 'garage.tags';
    } else if (route.name === 'articles.form' && itemContainerValidator.value('noMainImage')) {
        nextRoute.value = 'articles.tags';
    }
    eventBus.on('removedTag', (args) => {
        if (args.tag.pivot) {
            removedTags.value.push(args.tag)
        }
    })

    if (route.params.uuid) {
        product.value = await editProduct(levelOne, route.params.uuid, true, { disableStatusFilter: true });

    }

    // get agents of business
    getAgents(product.value?.business)
    var oldTag = null;
    oldTag = product.value?.condition ? product.value?.condition : null

    if (isBusinessModule() && route.name != 'garage.form') {
        const result = await getBusinesses(route.params?.levelOneslug, {
            user_id: userStore.user.id,
            active_business: true,
            limit: 20,
            role: userStore.user.user_type
        })
        businesses.value = await transformBusiness(result)
    }

    if (itemContainerValidator.value('attributeTags')) {
        await getAttributes(levelOne, route.params?.uuid, null, false);
    }

    if (bodyStyleModule()) {
        bodyStyles.value = await levelTwoTags(levelOne, { 'inventory': true, type: 'body_style' }, false);
    }

    form.value = {
        name: product.value?.name ?? '',
        level_two_tag: product.value?.level_two_tag.id ?? '',
        level_three_tag: product.value?.level_three_tag.id ?? '',
        level_four_tag: product.value?.level_four_tag.id ?? '',
        removed_tag: oldTag,
        price: product.value?.price ?? null,
        stock: product.value?.stock,
        weight: product.value?.weight,
        vin: product.value?.vehicle?.vin ?? '',
        trim: product.value?.vehicle?.trim ?? '',
        year: product.value?.vehicle?.year ?? '',
        body_style: productBodyStyle.value.id ?? [],
        mileage: product.value?.vehicle?.mileage ?? '',
        mpg: product.value?.vehicle?.mpg ?? '',
        stock_no: product.value?.vehicle?.stock_no ?? '',
        sellers_notes: product.value?.vehicle?.sellers_notes ?? '',
        sku: product.value?.sku ?? '',
        weight_unit: product.value?.weight_unit,
        description: product.value?.description ?? '',
        is_featured: product.value?.is_featured ? true : false,
        is_commentable: product.value?.is_commentable ? true : false,
        cryptocurrency_accepted: product.value?.cryptocurrency_accepted ? true : false,
        is_deliverable: product.value?.is_deliverable ? true : false,
        date_of_birth: product.value?.date_of_birth ?? '',
        date_of_death: product.value?.date_of_death ?? '',
        business_id: product.value?.business?.id ?? null,
        user_id: ['real-estate'].includes(levelOne) ? userStore.user.user_type === 'agent' ? userStore.user.id : product.value?.user.id : '',
        price_type: product.value?.price_type ? product.value.price_type : tagStore.getLevelOneTagSlug === 'employment' ? 'hourly' : 'fixed',
        type: product.value?.type ? product.value?.type : ['notices'].includes(levelOne) ? 'legal' : levelOne == 'real-estate' ? 'for-sale' : 'used',
        pickup_location: product.value?.pickup_location ? product.value?.pickup_location : '',
        performer: product.value?.events?.performer,
        away_team: product.value?.events?.away_team,
        ticket_url: product.value?.events?.event_ticket,
        max_price: product.value?.max_price,
        event_location: product.value?.events?.event_location,
        event_date:product.value?.events?.event_date
        
    }

    // level two tags
    if (!isBusinessModule() || product.value || route.name === 'garage.form') {
        levelTwoTag.value = await levelTwoTags(levelOne, { 'inventory': true, makers: itemContainerValidator.value('makers') ? true : null, business_id: form.value.business_id, user_id: itemContainerValidator.value('userSettings') ? userStore.user.id : null }, false);
    }

    // load levels while edit product
    if (product.value) {
        levelThreeTag.value = getL3Tags();
        levelFourTag.value = getL4Tags();
    }
});

</script>
<template>
    <div>
        <div class="">
            <div class="card-body">
                <form @submit.prevent="submit" enctype="multipart/form-data">
                    <div class="row">
                        <!-- Title -->
                        <div v-if="itemContainerValidator('productName')"
                            :class="{ 'col-md-4': tagStore.getLevelOneTagSlug === 'events', 'col-md-6': tagStore.getLevelOneTagSlug !== 'events' }">
                            <label class="form-label required" for="title">Name</label>
                            <input type="text" v-model="form.name" id="title" class="form-control"
                                :class="{ 'is-invalid border border-danger': errors?.name }"
                                :placeholder="'Enter ' + singularProductTitle.toLowerCase()+ ' name'" />
                            <Error v-if="errors?.name" :message="errors.name[0]"></Error>
                        </div>
                        <div class="col-md-4 mb-3" v-if="itemContainerValidator('performer')">
                            <label class="form-label required" for="title">Performer / Home Team</label>
                            <input type="text" v-model="form.performer" id="title" class="form-control"
                                :class="{ 'is-invalid border border-danger': errors?.performer }"
                                placeholder=" Enter Performer" />
                            <Error v-if="errors?.performer" :message="errors.performer[0]"></Error>
                        </div>
                        <!-- events date time -->
                        <div class="col-md-4" v-if="itemContainerValidator('events_date')">
                        <label class="form-label required">Event Date and Time</label>
                        <VueDatePicker format="MM/dd/yyyy HH:mm" :year-range="[1800, new Date().getFullYear()]"
                                       text-input utc v-model="form.event_date" :min-date="new Date()" placeholder="Select Event date and time"
                                       :class="{ 'is-invalid border border-danger': errors?.event_date }"
                                       :enable-time-picker="true" />
                        <Error v-if="errors?.event_date" :message="errors.event_date[0]"></Error>
                      </div>
                    </div>
                    <!-- DOB & DOD in case of Obits -->
                    <div class="row mb-3" v-if="hideShowItemsOnProductCard('DOB_DOD')">
                        <div class="col-md-6">
                            <label class="form-label required">Date of Birth</label>
                            <VueDatePicker format="MM/dd/yyyy" :year-range="[1800, new Date().getFullYear()]" text-input utc
                                v-model="form.date_of_birth" placeholder="Select date of birth"
                                :class="{ 'is-invalid border border-danger': errors?.date_of_birth }"
                                :enable-time-picker="false" />
                            <Error v-if="errors?.date_of_birth" :message="errors.date_of_birth[0]"></Error>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label required">Date of Death</label>
                            <VueDatePicker format="MM/dd/yyyy" :year-range="[1800, new Date().getFullYear()]" text-input utc
                                v-model="form.date_of_death" placeholder="Select date of death"
                                :class="{ 'is-invalid border border-danger': errors?.date_of_death }"
                                :enable-time-picker="false" />
                            <Error v-if="errors?.date_of_death" :message="errors.date_of_death[0]"></Error>
                        </div>
                    </div>

                    <div class="row">
                        <!-- type -->
                        <div class="col-md-4 mb-3" v-if="itemContainerValidator('productType')">
                            <label class="form-label required">Type</label>
                            <select class="form-select" v-model="form.type"
                                :class="{ 'is-invalid border border-danger': errors?.type }">
                                <option
                                    v-if="tagStore.getLevelOneTagSlug === 'notices' || tagStore.getLevelOneTagSlug === 'automotive' || tagStore.getLevelOneTagSlug === 'boats'"
                                    :value="!['notices', 'real-estate'].includes(tagStore.getLevelOneTagSlug) ? 'used' : 'legal'">
                                    {{ !['notices'].includes(tagStore.getLevelOneTagSlug) ? 'Used' : 'Legal' }}
                                </option>
                                <option
                                    v-if="tagStore.getLevelOneTagSlug === 'notices' || tagStore.getLevelOneTagSlug === 'automotive' || tagStore.getLevelOneTagSlug === 'boats'"
                                    :value="!['notices'].includes(tagStore.getLevelOneTagSlug) ? 'new' : 'public'">
                                    {{ !['notices'].includes(tagStore.getLevelOneTagSlug) ? 'New' : 'Public' }}
                                </option>
                                <option
                                    v-if="tagStore.getLevelOneTagSlug === 'real-estate' && ['real-estate'].includes(tagStore.getLevelOneTagSlug)"
                                    value="for-sale">For Sale
                                </option>
                                <option
                                    v-if="tagStore.getLevelOneTagSlug === 'real-estate' && ['real-estate'].includes(tagStore.getLevelOneTagSlug)"
                                    value="for-rent">For Rent
                                </option>
                            </select>
                            <Error v-if="errors?.type" :message="errors.type[0]"></Error>
                        </div>
                        <!-- Price -->
                        <div class="col-md-4 mb-3" v-if="itemContainerValidator('price')">
                            <label class="form-label" :class="itemContainerValidator('requiredPrice') ? 'required' : ''"
                                for="price">{{ priceTitle }}</label>
                            <input type="text" v-model="form.price" id="price" class="form-control"
                                :class="{ 'is-invalid border border-danger': errors?.price }"
                                :placeholder="`Enter ${priceTitle.toLowerCase()}`" />
                            <Error v-if="errors?.price" :message="errors.price[0]"></Error>
                        </div>

                        <div class="col-md-4 mb-3" v-if="itemContainerValidator('max-price')">
                            <label class="form-label required"
                                for="price">maximum price</label>
                            <input type="text" v-model="form.max_price" id="max_price" class="form-control"
                                :class="{ 'is-invalid border border-danger': errors?.max_price }"
                                placeholder="Enter maximum price" />
                            <Error v-if="errors?.max_price" :message="errors.max_price[0]"></Error>
                        </div>
                        <!-- location -->
                        <div class="col-md-4 mb-3" v-if="itemContainerValidator('event_location')">
                            <label class="form-label required" for="event-location">
                                Location
                            </label>
                            <input type="text" v-model="form.event_location" id="location" class="form-control"
                                :class="{ 'is-invalid border border-danger': errors?.event_location }"
                                :placeholder="`Enter ${'Location'.toLowerCase()}`" />
                            <Error v-if="errors?.event_location" :message="errors.event_location[0]"></Error>
                        </div>

                        <!--ticket url -->
                        <div class="col-md-4 mb-3" v-if="itemContainerValidator('url')">
                            <label class="form-label required" for="url">
                                Event Ticket Url
                            </label>
                            <input type="text" v-model="form.ticket_url" id="location" class="form-control"
                                :class="{ 'is-invalid border border-danger': errors?.ticket_url }"
                                :placeholder="`Enter ${'Event Ticket Url'.toLowerCase()}`" />
                            <Error v-if="errors?.ticket_url" :message="errors.ticket_url[0]"></Error>
                        </div>
                        <!-- milage -->
                        <div class="col-md-4 mb-3" v-if="itemContainerValidator('bodyStyle')">
                            <label class="form-label required" for="price">Mileage</label>
                            <input type="number" min="0" v-model="form.mileage" id="price" class="form-control"
                                :class="{ 'is-invalid border border-danger': errors?.mileage }"
                                :placeholder="`Enter Mileage`" />
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
                        <div class="col-md-4 mb-3" v-if="itemContainerValidator('productYear')">
                            <label class="form-label required" for="price">Year</label>
                            <VueDatePicker v-model="form.year" year-picker
                                :class="{ 'is-invalid border border-danger': errors?.year }" :placeholder="`Select Year`" />
                            <Error v-if="errors?.year" :message="errors.year[0]"></Error>
                        </div>

                        <!-- Companies -->
                        <div class="col-md-4 mb-3"
                            v-if="(itemContainerValidator('companies') || itemContainerValidator('organization')) && route.name != 'garage.form'">
                            <label class="form-label required">{{ author }}</label>
                            <Select2 v-model="form.business_id"
                                @select="getLevelTwoTags($event, 'business'); getAgents($event)"
                                :class="{ 'is-invalid border select2-invalid': errors?.business_id }" :options="businesses"
                                :placeholder="'Select ' + author.toLowerCase()">
                            </Select2>
                            <Error v-if="errors?.business_id" :message="errors.business_id[0]"></Error>
                        </div>

                        <div class="col-md-4 mb-3" v-if="(itemContainerValidator('real-estate-agent'))">
                            <label class="form-label required">AGENT</label>

                            <Select2 v-model="form.user_id"
                                :class="{ 'is-invalid border select2-invalid': errors?.user_id }" :options="agents"
                                :placeholder="'Select ' + 'agents'.toLowerCase()">
                            </Select2>
                            <Error v-if="errors?.user_id" :message="errors.user_id[0]"></Error>
                        </div>

                        <!-- Level Two -->
                        <div class="col-md-4">
                            <label class="form-label required" for="l2">Level Two Tags</label>
                            <Select2 v-model="form.level_two_tag"
                                :class="{ 'is-invalid border select2-invalid': errors?.level_two_tag }"
                                :options="levelTwoTag" @select="getL3Tags" placeholder="Select level two tag"
                                data-bs-toggle="tooltip" data-bs-placement="top" :title="TooltipInformationL2">
                            </Select2>
                            <Error v-if="errors?.level_two_tag" :message="errors.level_two_tag[0]"></Error>
                        </div>

                        <!-- Level Three -->
                        <div class="col-md-4 mb-3">
                            <label class="form-label required" for="l3">Level Three Tags</label>
                            <Select2 v-model="form.level_three_tag" :options="levelThreeTag" @select="getL4Tags"
                                :class="{ 'is-invalid border select2-invalid': errors?.level_three_tag }"
                                :disabled="loading" placeholder="Select level three tag" data-bs-toggle="tooltip"
                                data-bs-placement="top" :title="TooltipInformationL3">
                            </Select2>
                            <Error v-if="errors?.level_three_tag" :message="errors.level_three_tag[0]"></Error>
                        </div>
                        <!-- Level Four -->
                        <div class="col-md-4 mb-3">
                            <label class="form-label required" for="l4">Level Four Tags</label>
                            <Select2 v-model="form.level_four_tag" :options="levelFourTag" :disabled="loading"
                                :class="{ 'is-invalid border select2-invalid': errors?.level_four_tags }"
                                placeholder="Select level four tag" :title="TooltipInformationL4">
                            </Select2>
                            <Error v-if="errors?.level_four_tags" :message="errors.level_four_tags[0]"></Error>
                        </div>
                        <!-- away_team -->
                        <div class="col-md-4 mb-3" v-if="itemContainerValidator('away_team')">
                        <label class="form-label" for="away_team">Away Team</label>
                        <input type="text" v-model="form.away_team" id="location" class="form-control"
                               :class="{ 'is-invalid border border-danger': errors?.away_team }"
                               :placeholder="`Enter ${'Away Team'.toLowerCase()}`" />
                        <Error v-if="errors?.away_team" :message="errors.away_team[0]"></Error>
                      </div>
                        <!-- Stock -->
                        <div class="col-md-4 mb-3" v-if="itemContainerValidator('stock')">
                            <label class="form-label required" for="stock">{{ stockType }}</label>
                            <input type="text" v-model="form.stock" id="stock" class="form-control"
                                :class="{ 'is-invalid border border-danger': errors?.stock }"
                                placeholder="Enter available items" />
                            <Error v-if="errors?.stock" :message="errors.stock[0]"></Error>
                        </div>
                        <div class="col-md-4 mb-3" v-if="itemContainerValidator('priceType')">
                            <label class="form-label required">{{ priceTypeTitle }}</label>
                            <select class="form-select" v-model="form.price_type"
                                :class="{ 'is-invalid border border-danger': errors?.price_type }">
                                <option value="hourly">Hourly</option>
                                <option value="fixed" v-if="!itemContainerValidator('priceTypeOptions')">Fixed</option>
                                <option value="monthly" v-if="itemContainerValidator('priceTypeOptions')">Monthly</option>
                                <option value="yearly" v-if="itemContainerValidator('priceTypeOptions')">Yearly</option>
                            </select>
                            <Error v-if="errors?.price_type" :message="errors.price_type[0]"></Error>
                        </div>

                        <!-- required attributes -->
                        <div class="col-md-4 mb-3" v-if="itemContainerValidator('attributeTags')"
                            v-for="attribute in  requiredAttributes.value" :key="attribute.id">
                            <label class="form-label"
                                :class="[requiredAttributesSlug.includes(attribute.slug) ? 'required' : '']">{{
                                    attribute.name }}</label>
                            <TagComponent :placeholder="`Search ${attribute.name} Tags`" type="attribute"
                                :assignedTags="assignedTags" :attribute_id="attribute.id" :autocomplete="attributeTags"
                                :onlyFromAutoComplete="true" :productUuid="route.params.uuid" :openOnClick="true"
                                @fetchSuggestions="fetchSuggetions" />
                            <Error v-if="errors" :message="displayErrorMesage(errors, attribute.slug)"></Error>

                        </div>


                        <!-- location -->
                        <div class="col-md-4 mb-3" v-if="itemContainerValidator('pickup-location')">
                            <label class="form-label" :class="itemContainerValidator('location-input') ? 'required' : ''"
                                for="price">
                                Location
                            </label>
                            <input type="text" v-model="form.pickup_location" id="location" class="form-control"
                                :class="{ 'is-invalid border border-danger': errors?.pickup_location }"
                                :placeholder="`Enter ${'Location'.toLowerCase()}`" />
                            <Error v-if="errors?.pickup_location" :message="errors.pickup_location[0]"></Error>
                        </div>


                        <hr v-if="!itemContainerValidator('requiredDescripiton')">

                        <div class="col-md-4 mb-3" v-if="itemContainerValidator('attributeTags')"
                            v-for="  attribute   in   optionalAttributes.value  " :key="attribute.id">
                            <label class="form-label"
                                :class="[requiredAttributesSlug.includes(attribute.slug) ? 'required' : '']">{{
                                    attribute.name }}</label>
                            <TagComponent :placeholder="`Search ${attribute.name} Tags`" type="attribute"
                                :assignedTags="assignedTags" :attribute_id="attribute.id" :autocomplete="attributeTags"
                                :onlyFromAutoComplete="true" :productUuid="route.params.uuid" :openOnClick="true"
                                @fetchSuggestions="fetchSuggetions" />
                            <Error v-if="errors" :message="displayErrorMesage(errors, attribute.slug)"></Error>

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

                        <!-- trim -->
                        <div class="col-md-4 mb-3" v-if="itemContainerValidator('trim')">
                            <label class="form-label" for="price">Trim</label>
                            <input type="text" v-model="form.trim" id="price" class="form-control"
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

                        <!-- mpg -->
                        <div class="col-md-4 mb-3" v-if="itemContainerValidator('bodyStyle')">
                            <label class="form-label" for="price">Mpg</label>
                            <input type="text" v-model="form.mpg" id="price" class="form-control"
                                :class="{ 'is-invalid border border-danger': errors?.mpg }" :placeholder="`Enter Mpg`" />
                            <Error v-if="errors?.mpg" :message="errors.mpg[0]"></Error>
                        </div>

                        <!-- sku -->
                        <div class="col-md-4 mb-3" v-if="itemContainerValidator('sku')">
                            <label class="form-label" for="price">Sku</label>
                            <input type="text" v-model="form.sku" id="price" class="form-control"
                                :class="{ 'is-invalid border border-danger': errors?.sku }" :placeholder="`Enter Sku`" />
                            <Error v-if="errors?.sku" :message="errors.sku[0]"></Error>
                        </div>
                    </div>

                    <div class="row mb-5">
                        <!-- Description -->
                        <div class="col-12">
                            <label class="form-label" for="desc"
                                :class="[itemContainerValidator('requiredDescripiton') ? 'required' : '']">{{
                                    productDescriptionTitle
                                }}</label>
                            <QuillEditor v-model:content="form.sellers_notes" contentType="html" :toolbar="toolbarOptions"
                                :placeholder="'Compose ' + productDescriptionTitle.toLowerCase() + '...'"
                                @paste="handlePaste" v-if="itemContainerValidator('sellerNotes')" />

                            <QuillEditor v-model:content="form.description" contentType="html" :toolbar="toolbarOptions"
                                :placeholder="'Compose ' + productDescriptionTitle.toLowerCase() + '...'"
                                @paste="handlePaste" v-else />
                        </div>
                        <div class="col-12 mt-5" v-if="errors?.sellers_notes">
                            <Error class="mt-4" :message="errors.sellers_notes[0]"></Error>
                        </div>
                        <div class="col-12 mt-5" v-if="errors?.description">
                            <Error class="mt-4" :message="errors.description[0]"></Error>
                        </div>

                        <div class="col-12" :class="[errors?.description ? 'mt-2' : 'mt-5']">
                            <div class="row justify-content-between align-items-center">
                                <div :class="isCryptoCurrencyAcceptable && isDeliverable ? 'col-lg-8 justify-content-between' : 'col-lg-6'"
                                    class="d-flex mt-5">

                                    <!-- Crypto Currency checkbox -->
                                    <span v-if="isCryptoCurrencyAcceptable">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="cryptocurrency_accepted"
                                                :checked="form?.cryptocurrency_accepted"
                                                v-model="form.cryptocurrency_accepted" name="cryptocurrency_accepted" />
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
                                        <Error v-if="errors?.is_deliverable" :message="errors?.is_deliverable[0]">
                                        </Error>
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
                                        <Error v-if="errors?.is_commentable" :message="errors?.is_commentable[0]">
                                        </Error>
                                    </span>
                                </div>
                            </div>
                            <div class="col-12 mt-3 d-flex justify-content-end">
                                <Button btnClasses="btn btn-primary">Next</Button>
                            </div>
                        </div>
                    </div>
                </form>
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
}
</style>