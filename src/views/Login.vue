<script setup>
import LoginImage from '../assets/images/authentication/login.png'
import MainLogo from '../assets/images/logos/localverse.png'
import Error from '@components/core/Error.vue';
import { ref, computed } from 'vue';
import { useAuthApi } from '@composables/authentication'
const passwordVisible = ref(false);
const togglePasswordVisibility = () => {
    passwordVisible.value = !passwordVisible.value;
};
const inputFieldType = computed(() => (passwordVisible.value ? 'text' : 'password'));
const { errors, login } = useAuthApi();
const form = ref({
    email: '',
    password: '',
});
const submit = () => {
    login(form.value);
}

</script>
<template>
    <div class="d-none d-lg-flex col-lg-7 col-xl-8 align-items-center p-5">
        <div class="w-100 d-flex justify-content-center">
            <img :src="LoginImage" class="img-fluid" alt="Login image" width="600"
                data-app-dark-img="illustrations/boy-with-rocket-dark.png"
                data-app-light-img="illustrations/boy-with-rocket-light.png" />
        </div>
    </div>
    <div class="d-flex col-12 col-lg-5 col-xl-4 align-items-center authentication-bg p-sm-5 p-4 bg-white">
        <div class="w-px-400 mx-auto">
            <!-- Logo -->
            <div class="app-brand mb-5">
                <a href="index.html" class="app-brand-link gap-2">
                    <span class="app-brand-logo demo">
                        <img :src="MainLogo" alt="" width="200" />
                    </span>
                </a>
            </div>
            <!-- /Logo -->
            <h4 class="mb-2">Welcome to Localverse</h4>
            <p class="mb-4">Please sign-in to your account and start the adventure</p>

            <form id="formAuthentication" class="mb-3" @submit.prevent="submit()">
                <Error v-if="errors" :message="errors"></Error>
                <div class="mb-3">
                    <label for="email" class="form-label">Email or Username</label>
                    <input type="text" class="form-control" id="email" v-model="form.email" name="email-username"
                        placeholder="Enter your email or username" autofocus />
                </div>
                <div class="mb-3 form-password-toggle">
                    <div class="d-flex justify-content-between">
                        <label class="form-label" for="password">Password</label>
                        <a href="auth-forgot-password-cover.html">
                            <small>Forgot Password?</small>
                        </a>
                    </div>
                    <div class="input-group input-group-merge">
                        <input :type="inputFieldType" id="password" class="form-control" name="password"
                            placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                            aria-describedby="password" v-model="form.password" />
                        <span class="input-group-text cursor-pointer" @click="togglePasswordVisibility"
                            v-if="!passwordVisible"><i class="bx bx-hide"></i></span>
                        <span class="input-group-text cursor-pointer" @click="togglePasswordVisibility"
                            v-else="passwordVisible"><i class="bx bx-show"></i></span>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="remember-me" />
                        <label class="form-check-label" for="remember-me"> Remember Me </label>
                    </div>
                </div>
                <button class="btn btn-primary d-grid w-100">Sign in</button>
            </form>

            <p class="text-center">
                <span>New to LocalVerse? </span>
                <router-link :to="{ name: 'signup' }">
                    <span>Create an account</span>
                </router-link>
                <!-- <a href="auth-register-cover.html">
                    <span>Create an account</span>
                </a> -->
            </p>

            <!-- <div class="divider my-4">
                <div class="divider-text">or</div>
            </div> -->

            <!-- <div class="d-flex justify-content-center">
                <a href="javascript:;" class="btn btn-icon btn-label-facebook me-3">
                    <i class="tf-icons bx bxl-facebook"></i>
                </a>

                <a href="javascript:;" class="btn btn-icon btn-label-google-plus me-3">
                    <i class="tf-icons bx bxl-google-plus"></i>
                </a>

                <a href="javascript:;" class="btn btn-icon btn-label-twitter">
                    <i class="tf-icons bx bxl-twitter"></i>
                </a>
            </div> -->
        </div>
    </div>
</template>
