<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import Button from '@components/core/Button.vue'
import Error from '@components/core/Error.vue'
import { useProfileApi } from '@/composables/profile.js'
import { useHelper } from '@/composables/helper'
import { useUserStore } from '@/stores/user'
import { useSettingsStore } from "@stores/settings";
import { parsePhoneNumber, validatePhoneNumberLength } from 'libphonenumber-js';
import { useModuleSettings } from '@composables/modules'

const userStore = useUserStore()
const { getImage } = useHelper();
const { getApectRatio } = useModuleSettings()

// profile api and errors
const { errors, updateProfile } = useProfileApi();

const settingsStore = useSettingsStore()

const user = computed(() => {
    return userStore.user
})


const url = ref(null)
const isSaved = ref(false)
const avatarInputRef = ref('')
const cardbodyRef = ref('')

const onFileChange = (e) => {
    avatarInputRef.value.click();
    const file = e.target.files[0];

    if (file) {
        isSaved.value = false;
        url.value = URL.createObjectURL(file);
    }
}

const submit = async () => {
    const formData = new FormData();
    if (avatarInputRef.value.files.length > 0) {
        const file = avatarInputRef.value.files[0];
        formData.append('avatar', file);
    }
    formData.append('first_name', user.value.first_name ?? '');
    formData.append('last_name', user.value.last_name ?? '');
    formData.append('email', user.value.email ?? '');
    formData.append('phone', user.value.phone ?? '');
    formData.append('country', user.value.country ?? '');
    formData.append('about', user.value.about ?? '');
    formData.append('user_id', user.value.user_id ?? '');
    try {
        // Await the updateProfile API call
        await updateProfile(formData, cardbodyRef);
        // The code here will only execute after the updateProfile call is complete
    } catch (error) {
        console.error(error);
    }
}

function formatPhoneNumber() {
    // Set default country code to +1 (United States)
    const defaultCountryCode = 'US';

    const cleanedValue = user.value.phone.replace(/[^0-9+]/g, ''); // Allow only numbers and '+'
    // // Limit the length to 15 characters
    if (cleanedValue) {
        const truncatedValue = cleanedValue.substring(0, 12);

        // Parse and format the phone number as "+1 255 555 3453"
        const phoneNumber = parsePhoneNumber(truncatedValue, defaultCountryCode);
        user.value.phone = phoneNumber.formatInternational();
    } else {
        user.value.phone = null
    }
}

onBeforeMount(() => {
    url.value = user.value.avatar;
})
</script>
<template>
    <div class="my-3">
        <h5 class="card-header">Profile Details</h5>
        <!-- Account -->
        <div class="card-body" ref="cardbodyRef">
            <div class="d-flex  ">
                <div class="col-md-2">
                    <div class="image-container" @click="onFileChange" style="width: 180px;">
                        <img :src="getImage(url)" alt="user-avatar" class="d-block rounded"
                            :style="{ 'aspect-ratio': getApectRatio('logo') }" id="uploadedAvatar" />
                        <input type="file" accept="image/*" ref="avatarInputRef" style="display: none"
                            @change="onFileChange" />
                        <i class="bx bx-camera"></i>
                        <div class="change-image-text">image size is {{ settingsStore?.avatarDimensions }} </div>

                    </div>
                    <Error v-if="errors?.avatar" :message="errors?.avatar[0]"></Error>

                </div>
            </div>
        </div>
        <hr class="my-0" />
        <div class="card-body">
            <form id="" method="POST" @submit.prevent="submit()">
                <div class="row">
                    <div class="mb-3 col-md-6">
                        <label for="firstName" class="form-label required">First Name</label>
                        <input class="form-control" :class="{ 'is-invalid border border-danger': errors?.first_name }"
                            type="text" id="firstName" v-model="user.first_name" name="firstName" autofocus
                            placeholder="Enter first name" />
                        <Error v-if="errors?.first_name" :message="errors?.first_name[0]"></Error>
                    </div>
                    <div class="mb-3 col-md-6">
                        <label for="lastName" class="form-label required">Last Name</label>
                        <input class="form-control" :class="{ 'is-invalid border border-danger': errors?.last_name }"
                            type="text" v-model="user.last_name" name="lastName" id="lastName"
                            placeholder="Enter first name" />
                        <Error v-if="errors?.last_name" :message="errors?.last_name[0]"></Error>
                    </div>
                    <div class="mb-3 col-md-6">
                        <label for="email" class="form-label required">E-mail</label>
                        <input class="form-control" type="text" id="email" name="email" disabled
                            mailto:placeholder="john.doe@example.com" v-model="user.email" />
                        <Error v-if="errors?.email" :message="errors?.email[0]"></Error>
                    </div>
                    <div class="mb-3 col-md-6">
                        <label class="form-label required" for="phoneNumber">Phone Number</label>
                        <div class="input-group input-group-merge">
                            <input type="text" id="phoneNumber" name="phoneNumber" @input="formatPhoneNumber"
                                :class="{ 'is-invalid border-danger': errors?.phone }" class="form-control"
                                placeholder="+1 2025550111" v-model="user.phone" />
                        </div>
                        <Error v-if="errors?.phone" :message="errors?.phone[0]"></Error>
                    </div>
                    <div class="mb-3 col-md-12">
                        <label class="form-label" for="phoneNumber">Bio</label>
                        <div class="input-group input-group-merge">
                            <textarea id="basic-default-message" class="form-control" style="resize: none;"
                                placeholder="Brief Description" v-model="user.about"></textarea>
                        </div>
                    </div>
                </div>
                <div class="mt-2">
                    <Button type="submit" :btnClasses="'btn btn-primary me-2'">Save changes</Button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.image-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 180px;
    transition: opacity 0.3s;

}

.image-container img {
    width: 100%;
    height: 100%;
    margin-left: 0px;
    object-fit: cover;
    cursor: pointer;

}

.image-container:hover {
    opacity: 0.5;
}

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

.bx-camera {
    position: absolute;
    color: black;
    font-size: 24px;
    opacity: 0;
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

