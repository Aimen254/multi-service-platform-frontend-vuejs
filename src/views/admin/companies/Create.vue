<script setup>
import { ref } from 'vue';
import Error from '@components/core/Error.vue';
import { useHelper } from '@composables/helper';
import { useBusinessApi } from '@composables/business';
import { useTagStore } from '@stores/tags';
import { useUserStore } from '@stores/user';
import Button from '@components/core/Button.vue';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { useSettingsStore } from '@stores/settings.js';
import { useModuleSettings } from '@composables/modules';
import { useRoute } from 'vue-router';

const { companyTitle } = useModuleSettings()
const settingsStore = useSettingsStore()
const tagStore = useTagStore();
const userStore = useUserStore();
const { errors, createBusiness } = useBusinessApi();
const { getImage } = useHelper();
const { itemContainerValidator, singularCompanyTitle } = useModuleSettings();
const logoURL = ref(null);
const route = useRoute()
const form = ref({
    name: '',
    email: '',
    address: '',
    slug: '',
    phone: '',
    home_delivery: false,
    virtual_appointments: false,
    long_description: '',
    owner_id: userStore.user.id
});
const businessRef = ref(null);
const logoInputRef = ref(null);

const onFileChange = (e, image_type) => {
    const file = e.target.files[0];
    switch (image_type) {
        case 'logo':
            logoURL.value = URL.createObjectURL(file);
            break;
    }
}

const openFileDialog = (image_type) => {
    if (image_type == "logo") {
        document.getElementById("logo").click();
    }
}

const submit = async () => {
    const formData = new FormData();
    if (logoInputRef.value.files.length > 0) {
        formData.append('logo', logoInputRef.value.files[0]);
    }
    formData.append('owner_id', userStore.user?.id)
    formData.append('name', form.value.name ?? '');
    formData.append('email', form.value.email ?? '');
    formData.append('phone', form.value.phone ?? '');
    formData.append('address', form.value.address ?? '');
    formData.append('slug', form.value.slug ?? '');
    formData.append('long_description', form.value.long_description ?? '');

    if (itemContainerValidator.value('homeDelivery')) {
        formData.append('home_delivery', form.value.home_delivery ?? false);
    }

    if (itemContainerValidator.value('virtualAppointment')) {
        formData.append('virtual_appointments', form.value.virtual_appointments ?? false);
    }

    const response = await createBusiness(formData, route.params?.levelOneslug, businessRef.value);
    (response) && (form.value = {
        name: '',
        email: '',
        address: '',
        slug: '',
        phone: '',
        long_description: '',
    });
}

</script>
<template>
    <div class="m-4">
        <h4>Create {{ singularCompanyTitle }}</h4>
        <form @submit.prevent="submit()">
            <div class="row mb-5" ref="businessRef">
                <div class="col-lg-4">
                    <label for="logo" class="form-label mb-3">Logo</label>
                    <div class="position-relative">
                        <div class="d-flex align-items-start align-items-sm-center gap-4">
                            <img :src="getImage(logoURL)" class="d-block logo img-fluid" id="uploadedFile" />
                        </div>
                        <div class="position-absolute profile-camera-icon" role="button" @click="openFileDialog('logo')">
                            <i class='bx bxs-camera'></i>
                            <input id="logo" type='file' ref="logoInputRef" @change="onFileChange($event, 'logo')" hidden
                                accept="image/png, image/jpeg" />
                        </div>
                    </div>
                    <div v-if="settingsStore.businessMediaDimensions?.logo">
                        Image size is {{ settingsStore.businessMediaDimensions?.logo?.width }} x {{
                            settingsStore.businessMediaDimensions?.logo?.height }}
                    </div>

                </div>
                <Error v-if="errors?.logo" :message="errors.logo[0]" />
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
                <div class="col-12">
                    <label for="description" class="form-label">Long Description</label>
                    <QuillEditor v-model:content="form.long_description" contentType="html" />
                </div>
                <div class="col-12 mt-5" v-if="errors?.long_description">
                    <Error class="mt-5" v-if="errors?.long_description" :message="errors.long_description[0]" />
                </div>
                <div class="col-12 mt-5 d-flex">
                    <!-- Home delivery -->
                    <span class="me-4 mt-5" v-if="itemContainerValidator('homeDelivery')">
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
                    <span class="mt-5" v-if="itemContainerValidator('virtualAppointment')">
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
            <div class="row" :class="!itemContainerValidator('homeDelivery') ? 'mt-5' : 'mt-0'">
                <div class="col-12 mt-2">
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

.profile-camera-icon {
    width: 2rem;
    height: 2rem;
    top: 41%;
    left: 26%;
    color: white !important;
}

.logo {
    height: 12.5rem !important;
    width: 12.5rem !important;
}

.bxs-camera {
    font-size: 2rem;
}
</style>