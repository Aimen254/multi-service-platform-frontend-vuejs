<script setup>
import { ref, reactive } from 'vue';
import { useProfileApi } from '@/composables/profile';
import Button from '@components/core/Button.vue';
import Error from '@components/core/Error.vue';

const processing = ref(false);
const { errors, changePassword } = useProfileApi();

const passwordVisibility = reactive({
    'old-password': false,
    'new-password': false,
    'confirm-password': false,
});

const inputFieldType = reactive({
    'old-password': 'password',
    'new-password': 'password',
    'confirm-password': 'password',
});

const form = ref({
    old_password: '',
    new_password: '',
    password_confirmation: '',
});

const togglePasswordVisibility = (fieldId) => {
    passwordVisibility[fieldId] = !passwordVisibility[fieldId];

    inputFieldType[fieldId] = (inputFieldType[fieldId] === 'password') ? 'text' : 'password';
};

const submit = async () => {
    processing.value = true;
    try {
        const response = await changePassword(form.value);
        processing.value = false;
        (response) && (form.value = {
            old_password: '',
            new_password: '',
            password_confirmation: '',
        });
    } catch (error) {
        processing.value = false;
    }
}

</script>

<template>
    <div class="mb-4">
        <h5 class="card-header">Change Password</h5>
        <div class="card-body">
            <form id="formAccountSettings" @submit.prevent="submit()">
                <div class="row">
                    <div class="mb-3 col-md-6 form-password-toggle">
                        <label class="form-label" for="currentPassword">Current Password</label>
                        <div class="input-group input-group-merge">
                            <input class="form-control" :type="inputFieldType['old-password']" v-model="form.old_password"
                                id="currentPassword" :class="{ 'is-invalid border border-danger': errors?.old_password }"
                                placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;" />
                            <span class="input-group-text cursor-pointer" @click="togglePasswordVisibility('old-password')">
                                <i class="bx bx-show" v-if="passwordVisibility['old-password']"></i>
                                <i class="bx bx-hide" v-else></i>
                            </span>
                        </div>
                        <Error v-if="errors?.old_password" :message="errors?.old_password[0]"></Error>
                    </div>
                </div>
                <div class="row">
                    <div class="mb-3 col-md-6 form-password-toggle">
                        <label class="form-label" for="newPassword">New Password</label>
                        <div class="input-group input-group-merge">
                            <input class="form-control" :type="inputFieldType['new-password']" v-model="form.new_password"
                                id="newPassword" :class="{ 'is-invalid border border-danger': errors?.new_password }"
                                placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;" />
                            <span class="input-group-text cursor-pointer" @click="togglePasswordVisibility('new-password')">
                                <i class="bx bx-show" v-if="passwordVisibility['new-password']"></i>
                                <i class="bx bx-hide" v-else></i>
                            </span>
                        </div>
                        <Error v-if="errors?.new_password" :message="errors?.new_password[0]"></Error>
                    </div>

                    <div class="mb-3 col-md-6 form-password-toggle">
                        <label class="form-label" for="confirmPassword">Confirm New Password</label>
                        <div class="input-group input-group-merge">
                            <input class="form-control" :type="inputFieldType['confirm-password']"
                                v-model="form.password_confirmation" id="confirmPassword" :class="{ 'is-invalid border border-danger': errors?.password_confirmation }"
                                placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;" />
                            <span class="input-group-text cursor-pointer"
                                @click="togglePasswordVisibility('confirm-password')">
                                <i class="bx bx-show" v-if="passwordVisibility['confirm-password']"></i>
                                <i class="bx bx-hide" v-else></i>
                            </span>
                        </div>
                        <Error v-if="errors?.password_confirmation" :message="errors?.password_confirmation[0]"></Error>
                    </div>
                    <div class="col-12 mb-4">
                        <p class="fw-medium mt-2">Password Requirements:</p>
                        <ul class="ps-3 mb-0">
                            <li class="mb-1">Minimum 8 characters long - the more, the better</li>
                        </ul>
                    </div>
                    <div class="col-12 mt-1">
                        <Button type="submit" btnClasses="btn btn-primary me-2">Save</Button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
