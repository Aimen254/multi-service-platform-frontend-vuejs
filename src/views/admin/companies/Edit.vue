<script setup>
import { ref, onMounted } from 'vue';
import Error from '@components/core/Error.vue';
import { useRoute } from 'vue-router';
import { useHelper } from '@composables/helper';
import { useBusinessApi } from '@composables/business';
import { useTagStore } from '@stores/tags';
import { useUserStore } from '@stores/user';
import Button from '@components/core/Button.vue';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { useSettingsStore } from '@stores/settings.js'
import { useModuleSettings } from '@composables/modules';

const business = ref(null);
const logoInputRef = ref(null);
const bannerInputRef = ref(null);
const secondaryBannerInputRef = ref(null);
const logoURL = ref(null);
const bannerURL = ref(null);
const secondaryBannerURL = ref(null);
const businessUuid = ref(null);

const businessRef = ref(null);
const route = useRoute();
const tagStore = useTagStore();
const settingsStore = useSettingsStore()
const userStore = useUserStore();
const { getImage } = useHelper();
const { errors, viewBusiness, updateBusiness } = useBusinessApi();
const { itemContainerValidator, singularCompanyTitle } = useModuleSettings();

const onFileChange = (e, image_type) => {
    const file = e.target.files[0];
    switch (image_type) {
        case 'logo':
            logoURL.value = URL.createObjectURL(file);
            break;
        case 'banner':
            bannerURL.value = URL.createObjectURL(file);
            break;
        case 'secodaryBanner':
        secondaryBannerURL.value = URL.createObjectURL(file);
            break;
    }
}

const openFileDialog = (image_type) => {
    if (image_type == "logo") {
        document.getElementById("logo").click();
    }  else if (image_type == "secondaryBanner") {
        document.getElementById("secondaryBanner").click();
    } else {
        document.getElementById("banner").click();
    }
}

const form = ref({
    name: '',
    email: '',
    address: '',
    slug: '',
    phone: '',
    home_delivery: false,
    virtual_appointments: false,
    long_description: '',
    owner_id: userStore.user.id,
});

const submit = async () => {
    const formData = new FormData();
    if (logoInputRef.value.files.length > 0) {
        formData.append('logo', logoInputRef.value.files[0]);
    }
    if (bannerInputRef.value.files.length > 0) {
        formData.append('banner', bannerInputRef.value.files[0]);
    }
    if (secondaryBannerInputRef.value.files.length > 0) {
        formData.append('secondaryBanner', secondaryBannerInputRef.value.files[0]);
    }

    if (itemContainerValidator.value('homeDelivery')) {
        formData.append('home_delivery', form.value.home_delivery ?? false);
    }

    if (itemContainerValidator.value('virtualAppointment')) {
        formData.append('virtual_appointments', form.value.virtual_appointments ?? false);
    }

    formData.append('name', form.value.name ?? '');
    formData.append('_method', 'put');
    formData.append('email', form.value.email ?? '');
    formData.append('phone', form.value.phone ?? '');
    formData.append('address', form.value.address ?? '');
    formData.append('slug', form.value.slug ?? '');
    formData.append('long_description', form.value.long_description ?? '');
    formData.append('id', business.value?.id)
    formData.append('front_end_flag', true);
    await updateBusiness(formData, route.params?.levelOneslug, businessUuid.value, businessRef.value, true);
}

onMounted(async () => {
    businessUuid.value = route.params.uuid;
    business.value = await viewBusiness(route.params?.levelOneslug, route.params.uuid, { disableStatusFilter: true });
    logoURL.value = business.value ? business.value?.logo : null;
    bannerURL.value = business.value ? business.value.banner : null;
    secondaryBannerURL.value = business.value ? business.value.secondary_banner : null;
    form.value = {
        name: business.value?.name ?? '',
        email: business.value?.email ?? '',
        slug: business.value?.slug ?? '',
        phone: business.value?.phone ?? '',
        address: business.value?.address ?? '',
        long_description: business.value?.long_description ?? '',
        home_delivery: business.value?.home_delivery ? business.value?.home_delivery == 1 ? true : false : false,
        virtual_appointments: business.value?.virtual_appointments ? business.value?.virtual_appointments == 1 ? true : false : false
    };
});
</script>

<template>
    <div class="m-4">
        <h4>Edit  {{ singularCompanyTitle }}</h4>
        <form @submit.prevent="submit()" ref="businessRef">
            <div class="row mb-3">
                <div class="col-lg-3">
                    <label for="logo" class="form-label mb-3">Logo</label>
                    <div class="image-container logo-container" @click="openFileDialog('logo')">
                        <img :src="getImage(logoURL)" alt="user-avatar" class="img-fluid d-block "
                            id="uploadedAvatar" />
                        <input type="file" id="logo" accept="image/*" ref="logoInputRef" style="display: none"
                            @change="onFileChange($event, 'logo')" />
                        <i class="bx bx-camera"></i>
                    </div>
                    <div v-if="settingsStore.businessMediaDimensions?.logo" class="text-center">
                        Image size is {{ settingsStore.businessMediaDimensions?.logo?.width }} x {{
                            settingsStore.businessMediaDimensions?.logo?.height }}
                    </div>
                    <Error v-if="errors?.logo" :message="errors.logo[0]" />
                </div>
                <div class="col-lg-9">
                    <div class="row">
                        <div class="col-lg-12">
                        <label for="banner" class="form-label mb-3">Banners</label>
                        <div class="image-container" @click="openFileDialog('banner')">
                            <img :src="getImage(bannerURL, 'cover')" alt="Banner" class="d-block" id="uploadedAvatar" />
                            <input type="file" id="banner" accept="image/*" ref="bannerInputRef" style="display: none"
                                @change="onFileChange($event, 'banner')" />
                            <i class='bx bx-camera'></i>
                        </div>
                        <div v-if="settingsStore.businessMediaDimensions?.banner" class="text-center">
                            Image size is {{ settingsStore.businessMediaDimensions?.banner?.width }} x {{
                                settingsStore.businessMediaDimensions?.banner?.height }}
                                <p class="d-inline-block fs-9 text-muted float-end">Providers Page Banner</p>
                        </div>
                        <Error v-if="errors?.banner" :message="errors.banner[0]" />
                    </div>
                    <div class="col-lg-12">
                        <div class="image-container secondary-banner-container" @click="openFileDialog('secondaryBanner')">
                            <img :src="getImage(secondaryBannerURL, 'cover')" alt="Banner" class="d-block"  />
                            <input type="file" id="secondaryBanner" accept="image/*" ref="secondaryBannerInputRef" style="display: none"
                                @change="onFileChange($event, 'secodaryBanner')" />
                            <i class='bx bx-camera'></i>
                        </div>
                        <div v-if="settingsStore.businessMediaDimensions?.secondaryBanner" class="text-center">
                            Image size is {{ settingsStore.businessMediaDimensions?.secondaryBanner?.width }} x {{
                                settingsStore.businessMediaDimensions?.secondaryBanner?.height }}
                                <p class=" fs-9 text-muted float-end">Providers Listing Banner</p>
                        </div>
                        <Error v-if="errors?.secondaryBanner" :message="errors.secondaryBanner[0]" />
                    </div>
                    </div>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-4">
                    <label for="name" class="form-label required">Name</label>
                    <input class="form-control" :class="{ 'is-invalid border border-danger': errors?.name }"
                        v-model="form.name" type="text" id="name" placeholder="Enter Name" />
                    <Error v-if="errors?.name" :message="errors.name[0]" />
                </div>
                <div class="col-md-4">
                    <label for="email" class="form-label required">Email</label>
                    <input class="form-control" :class="{ 'is-invalid border border-danger': errors?.email }"
                        v-model="form.email" type="email" id="email" placeholder="Enter Email" />
                    <Error v-if="errors?.email" :message="errors.email[0]" />
                </div>
                <div class="col-md-4">
                    <label for="slug" class="form-label required">Slug</label>
                    <input class="form-control" :class="{ 'is-invalid border border-danger': errors?.slug }"
                        v-model="form.slug" type="text" id="slug" placeholder="Enter Slug" />
                    <Error v-if="errors?.slug" :message="errors.slug[0]" />
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="phone" class="form-label required">Phone</label>
                    <input class="form-control" :class="{ 'is-invalid border border-danger': errors?.phone }"
                        v-model="form.phone" type="text" id="phone" placeholder="Enter Phone" />
                    <Error v-if="errors?.phone" :message="errors.phone[0]" />
                </div>
                <div class="col-md-6">
                    <label for="address" class="form-label required">Address</label>
                    <input class="form-control" :class="{ 'is-invalid border border-danger': errors?.address }"
                        v-model="form.address" type="text" id="address" placeholder="Enter Address" />
                    <Error v-if="errors?.address" :message="errors.address[0]" />
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-12 mb-5">
                    <label for="description" class="form-label">Long Description</label>
                    <QuillEditor v-model:content="form.long_description" contentType="html" />
                </div>
                <div class="col-12" v-if="errors?.long_description">
                    <Error class="mt-5" v-if="errors?.long_description" :message="errors.long_description[0]" />
                </div>
                <div class="col-12 mt-5 d-flex">
                    <!-- Home delivery -->
                    <span class="me-4" v-if="itemContainerValidator('homeDelivery')">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="home-delivery"
                                :checked="form?.home_delivery" v-model="form.home_delivery" name="home_delivery" />
                            <label class="form-check-label" for="home-delivery">
                                Home Delivery
                            </label>
                        </div>
                        <Error v-if="errors?.home_delivery" :message="errors?.home_delivery[0]"></Error>
                    </span>

                    <!-- Virtual appointments checkbox -->
                    <span class="" v-if="itemContainerValidator('virtualAppointment')">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="virtual_appointments"
                                :checked="form?.virtual_appointments" v-model="form.virtual_appointments"
                                name="virtual_appointments" />
                            <label class="form-check-label" for="virtual_appointments">
                                Virtual Appointments
                            </label>
                        </div>
                        <Error v-if="errors?.virtual_appointments" :message="errors?.virtual_appointments[0]"></Error>
                    </span>
                </div>
            </div>
            <div class="row" :class="!itemContainerValidator('homeDelivery') ? 'mt-4' : 'mt-0'">
                <div class="col-12">
                    <Button type="submit" btnClasses="btn btn-primary">Save</Button>
                </div>
            </div>
        </form>
    </div>
</template>

<style scoped>
.w-100 {
    width: 6.25rem !important
}

.image-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 12.5rem !important;
    transition: opacity 0.3s;

}
.secondary-banner-container {
    height: 18.5rem !important; 
}
.logo-container {
    height: 10.5rem !important; 
    width: 10.5rem !important; 
}

.image-container img {
    width: 100%;
    height: 100%;
    margin-left: 0px;
    cursor: pointer;

}

.image-container:hover {
    opacity: 0.5;
}

.logo,
/* .thumbnail {
    height: 12.5rem !important;
    width: 12.5rem !important;
} */

.bx-camera {
    position: absolute;
    color: black;
    font-size: 24px;
    opacity: 0;
    cursor: pointer;
}

.image-container:hover .bx-camera {
    opacity: 1;
}

.image-container:hover .change-image-text {
    display: block;
}

.change-image-text {
    display: none;
    position: absolute;
    color: black;
    margin-top: 54px;
    padding: 5px 10px;
    font-size: 14px;
    border-radius: 5px;
    font-weight: 700;
}
</style>