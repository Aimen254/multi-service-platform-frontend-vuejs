<script setup>
import { ref, reactive } from 'vue';
import { useAuthApi } from '@composables/authentication';
import Error from '@components/core/Error.vue';

const { errors, signup } = useAuthApi();

const form = reactive({
    'first_name': '',
    'last_name': '',
    'phone': '',
    'email': '',
    'password': '',
    'password_confirmation': ''
});

const passwordVisibility = reactive({
    'password': false,
    'confirm-password': false,
});

const inputFieldType = reactive({
    'password': 'password',
    'confirm-password': 'password',
});

const processing = ref(false);

const submit = async () => {
    processing.value = true;
    try {
        await signup(form);
        processing.value = false;
    } catch (error) {
        processing.value = false;
    }
}

const togglePasswordVisibility = (fieldId) => {
    passwordVisibility[fieldId] = !passwordVisibility[fieldId];

    inputFieldType[fieldId] = (inputFieldType[fieldId] === 'password') ? 'text' : 'password';
};


</script>
<template>
    <!-- Left Text -->
    <div class="d-none d-lg-flex col-lg-4 align-items-center justify-content-center p-5 pe-0">
        <div class="w-px-400">
            <img src="../assets/images/auth/signup.png" class="img-fluid" alt="multi-steps" width="345"
                data-app-dark-img="illustrations/create-account-dark.png"
                data-app-light-img="illustrations/create-account-light.png" />
        </div>
    </div>
    <!-- /Left Text -->

    <!--  Multi Steps Registration -->
    <div class="d-flex col-lg-8 align-items-center justify-content-center authentication-bg bg-white p-sm-5 p-3">
        <div class="w-px-700">
            <div class="app-brand mb-5">
                <a href="index.html" class="app-brand-link gap-2">
                    <span class="app-brand-logo demo">
                        <img src="../assets/images/logos/localverse.png" alt="" width="200" />
                    </span>
                </a>
            </div>

            <h4 class="mb-2">Explore Localverse</h4>
            <p class="mb-4">Find Your Favorite Categories and Read More About That</p>

            <div id="multiStepsValidation" class="shadow-none">
                <div class="">
                    <form @submit.prevent="submit()" id="multiStepsForm">
                        <Error v-if="errors" :message="errors"></Error>
                        <!-- Account Details -->
                        <div id="accountDetailsValidation" class="content">
                            <div class="row g-3">
                                <div class="col-sm-6">
                                    <label class="form-label required" for="multiStepsUsername">First Name</label>
                                    <input type="text" v-model="form.first_name" id="multiStepsUsername"
                                        class="form-control" placeholder="Enter first name" />
                                </div>
                                <div class="col-sm-6">
                                    <label class="form-label required" for="multiStepsUsername">Last Name</label>
                                    <input type="text" v-model="form.last_name" id="multiStepsUsername" class="form-control"
                                        placeholder="Enter last name" />
                                </div>
                                <div class="col-sm-6">
                                    <label class="form-label required" for="multiStepsEmail">Email Address</label>
                                    <input type="email" v-model="form.email" id="multiStepsEmail" class="form-control"
                                        placeholder="Enter email address" />
                                </div>
                                <div class="col-sm-6">
                                    <label class="form-label required" for="multiStepsPhone">Phone Number</label>
                                    <input type="text" v-model="form.phone" id="multiStepsPhone" class="form-control"
                                        placeholder="Enter phone number" />
                                </div>
                                <div class="col-sm-6 form-password-toggle">
                                    <label class="form-label required" for="multiStepsPass">Password</label>
                                    <div class="input-group input-group-merge">
                                        <input :type="inputFieldType['password']" v-model="form.password"
                                            id="multiStepsPass" class="form-control"
                                            placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                                            aria-describedby="multiStepsPass2" />
                                        <span class="input-group-text cursor-pointer" id="multiStepsPass2"
                                            @click="togglePasswordVisibility('password')">
                                            <i class="bx bx-show" v-if="passwordVisibility['password']"></i>
                                            <i class="bx bx-hide" v-else></i>
                                        </span>
                                    </div>
                                </div>
                                <div class="col-sm-6 form-password-toggle">
                                    <label class="form-label required" for="multiStepsConfirmPass">Confirm Password</label>
                                    <div class="input-group input-group-merge">
                                        <input :type="inputFieldType['confirm-password']"
                                            v-model="form.password_confirmation" id="multiStepsConfirmPass"
                                            class="form-control"
                                            placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                                            aria-describedby="multiStepsConfirmPass2" />
                                        <span class="input-group-text cursor-pointer" id="multiStepsConfirmPass2"
                                            @click="togglePasswordVisibility('confirm-password')">
                                            <i class="bx bx-show" v-if="passwordVisibility['confirm-password']"></i>
                                            <i class="bx bx-hide" v-else></i>
                                        </span>
                                    </div>
                                </div>
                                <div class="col-12 d-flex justify-content-between">
                                    <button type="submit" class="btn btn-primary btn-next">
                                        <span class="align-middle d-sm-inline-block d-none me-sm-1 me-0">Sign up</span>
                                    </button>
                                </div>
                                <div class="col-12 d-flex justify-content-between">
                                    <span>Already have an account? <router-link to="login">Sign in
                                            instead</router-link></span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <!-- / Multi Steps Registration -->
</template>
