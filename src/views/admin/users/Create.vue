<script setup>
import { onMounted, ref } from 'vue';
import Error from '@components/core/Error.vue';
import { useHelper } from '@composables/helper';
import { useUser } from '@composables/user';
import { useUserStore } from '@stores/user';
import Button from '@components/core/Button.vue';
import { useSettingsStore } from '@stores/settings.js';
import { useModuleSettings } from '@composables/modules';
import { useBusinessApi } from '@composables/business';
import { useTagStore } from '@/stores/tags.js';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute()
const settingsStore = useSettingsStore();
const userStore = useUserStore();
const { getBusinesses, businesses } = useBusinessApi();
const { errors, storeUser } = useUser();
const { getImage } = useHelper();
const tagStore = useTagStore();
const { singularUserName, author } = useModuleSettings();

const avatarURL = ref(null);
const form = ref({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    neighborhood_name: '',
    user_type: 'agent',
    avatar: '',
    business_id: '',
    addresses: [{
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        note: '',
        is_default: 0,
    }]
});

const userRef = ref(null);
const avatarInputRef = ref(null);

const onFileChange = (e, image_type) => {
    const file = e.target.files[0];
    switch (image_type) {
        case 'avatar':
            avatarURL.value = URL.createObjectURL(file);
            break;
    }
}

const openFileDialog = (image_type) => {
    if (image_type == "avatar") {
        document.getElementById("avatar").click();
    }
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

const getBrokers = async () => {
    await getBusinesses(route.params?.levelOneslug, {
        user_id: userStore.user?.id
    });

    businesses.value = await transformBusiness(businesses.value);
}

const submit = async () => {
    const formData = new FormData();
    if (avatarInputRef.value.files.length > 0) {
        formData.append('avatar', avatarInputRef.value.files[0]);
    }

    formData.append('business_id', form.value.business_id ?? '');
    formData.append('first_name', form.value.first_name ?? '');
    formData.append('last_name', form.value.last_name ?? '');
    formData.append('email', form.value.email ?? '');
    formData.append('phone', form.value.phone ?? '');
    formData.append('password', form.value.password ?? '');
    formData.append('neighborhood_name', form.value.neighborhood_name ?? '');
    formData.append('user_type', form.value.user_type ?? '');
    // formData.append('addresses', form.value.addresses ?? '');

    const res = await storeUser(formData, userRef.value);

    if (!res.status == 422) {
        router.push({ name: 'users.index', params: { userType: 'agents' } });
    }
}

onMounted(async () => {
    await getBrokers();
})
</script>

<template>
    <div class="m-4">
        <h4>Create {{ singularUserName }}</h4>
        <form @submit.prevent="submit()">
            <div class="row mb-5" ref="userRef">
                <div class="col-3">
                    <label for="avatar" class="form-label mb-3">Avatar</label>
                    <div class="position-relative">
                        <div class="d-flex align-items-start align-items-sm-center gap-4">
                            <img :src="getImage(avatarURL)" class="d-block img-fluid avatar" id="uploadedFile" />
                        </div>
                        <div class="position-absolute profile-camera-icon" role="button" @click="openFileDialog('avatar')">
                            <i class='bx bxs-camera'></i>
                            <input id="avatar" type='file' ref="avatarInputRef" @change="onFileChange($event, 'avatar')"
                                hidden accept="image/png, image/jpeg" />
                        </div>
                    </div>
                    <div v-if="settingsStore.avatarDimensions">
                        Image size must be of {{ settingsStore.avatarDimensions }}
                    </div>

                </div>
                <Error v-if="errors?.avatar" :message="errors.avatar[0]" />
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="first_name" class="form-label required">First Name</label>
                    <input class="form-control" :class="{ 'is-invalid border border-danger': errors?.first_name }"
                        v-model="form.first_name" type="text" id="first_name" placeholder="Enter First Name" />
                    <Error v-if="errors?.first_name" :message="errors.first_name[0]" />
                </div>
                <div class="col-md-6 mb-3">
                    <label for="last_name" class="form-label required">Last Name</label>
                    <input class="form-control" :class="{ 'is-invalid border border-danger': errors?.last_name }"
                        v-model="form.last_name" type="text" id="last_name" placeholder="Enter Last Name" />
                    <Error v-if="errors?.last_name" :message="errors.last_name[0]" />
                </div>
                <div class="col-md-6 mb-3">
                    <label for="email" class="form-label required">Email</label>
                    <input class="form-control" :class="{ 'is-invalid border border-danger': errors?.email }"
                        v-model="form.email" type="email" id="email" placeholder="Enter Email" />
                    <Error v-if="errors?.email" :message="errors.email[0]" />
                </div>
                <div class="col-md-6 mb-3">
                    <label for="password" class="form-label required">Password</label>
                    <input class="form-control" :class="{ 'is-invalid border border-danger': errors?.password }"
                        v-model="form.password" type="password" id="password" placeholder="Enter Password" />
                    <Error v-if="errors?.password" :message="errors.password[0]" />
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label required">{{ author }}</label>
                    <Select2 v-model="form.business_id"
                        :class="{ 'is-invalid border select2-invalid': errors?.business_id }" :options="businesses"
                        :placeholder="'Select ' + author.toLowerCase()">
                    </Select2>
                    <Error v-if="errors?.business_id" :message="errors.business_id[0]"></Error>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="phone" class="form-label">Phone</label>
                    <input class="form-control" :class="{ 'is-invalid border border-danger': errors?.phone }"
                        v-model="form.phone" type="text" id="phone" placeholder="Enter Phone" />
                    <Error v-if="errors?.phone" :message="errors.phone[0]" />
                </div>
                <div class="col-md-6 mb-3">
                    <label for="neighborhood_name" class="form-label">Neighborhood Name</label>
                    <input class="form-control" :class="{ 'is-invalid border border-danger': errors?.neighborhood_name }"
                        v-model="form.neighborhood_name" type="text" id="neighborhood_name"
                        placeholder="Enter Neighborhood Name" />
                    <Error v-if="errors?.neighborhood_name" :message="errors.neighborhood_name[0]" />
                </div>
            </div>
            <div class="row mt-5" v-for="(address, index) in form.addresses" :key="index">
                <h4>Address Information</h4>
                <div class="col-md-3 mb-3">
                    <label :for="`addresses_${index}_name`" class="form-label required">Address Type</label>
                    <input class="form-control"
                        :class="{ 'is-invalid border border-danger': errors?.[`addresses.${index}.name`] }"
                        v-model="address.name" type="text" :id="`addresses_${index}_name`" placeholder="Address Type" />
                    <Error v-if="errors?.[`addresses.${index}.name`]" :message="errors.phone[0]" />
                </div>
                <div class="col-md-5 mb-3">
                    <label :for="`addresses_${index}_address`" class="form-label required">Address Type</label>
                    <input class="form-control"
                        :class="{ 'is-invalid border border-danger': errors?.[`addresses.${index}.address`] }"
                        v-model="address.address" type="text" :id="`addresses_${index}_address`"
                        placeholder="Address Type" />
                    <Error v-if="errors?.[`addresses.${index}.address`]" :message="errors.addresses[index].address" />
                </div>
            </div>
            <div class="row mt-5">
                <div class="col-12 mt-2">
                    <Button type="submit" btnClasses="btn btn-primary">Save</Button>
                </div>
            </div>
        </form>
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

.avatar {
    height: 12.5rem !important;
    width: 12.5rem !important;
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
    left: 37%;
    color: white !important;
}

.bxs-camera {
    font-size: 2rem;
}
</style>