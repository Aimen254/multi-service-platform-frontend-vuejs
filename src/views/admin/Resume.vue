<script setup>
import { ref, onMounted } from "vue";
import { useTagStore } from '@stores/tags';
import Error from "@components/core/Error.vue";
import { useResumeApi } from '@composables/resume';
import { useRoute } from "vue-router";

import Button from '@components/core/Button.vue';

const tagStore = useTagStore();
const route = useRoute()
const resumeRef = ref(null);
const resume = ref(null);
const icon = ref(null);
const { errors, createResume, getResume } = useResumeApi();

const data = ref({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    resume: '',
});

const onFileChange = async (e) => {
    resume.value = e.target.files[0];
}

const FileIcon = async (url) => {
    const fileName = url.substring(url.lastIndexOf('/') + 1);

    const fileExtension = fileName.split('.').pop();

    switch (fileExtension) {
        case 'pdf':
            icon.value = 'menu-icon tf-icons bx bxs-file-pdf text-danger fs-2';
            break;
        case 'doc':
        case 'docx':
            icon.value = 'menu-icon tf-icons bx bxs-file-doc text-primary fs-2';
            break;
    }
}

const getUserResume = async (load = false) => {
    const response = await getResume(route.params?.levelOneslug, load);
    data.value = {
        'first_name': response?.first_name ?? '',
        'last_name': response?.last_name ?? '',
        'email': response?.email ?? '',
        'phone': response?.phone ?? '',
        'location': response?.location ?? '',
        'experience': response?.experience ?? '',
        'resume': response?.resume ?? null,
    }

    data.value.resume ? await FileIcon(data.value.resume) : null;
}

onMounted(async () => {
    await getUserResume(true);
})

const submit = async () => {
    const formData = new FormData();

    resume.value ? formData.append('resume', resume.value) : null;

    formData.append('first_name', data.value.first_name)
    formData.append('last_name', data.value.last_name)
    formData.append('email', data.value.email);
    formData.append('phone', data.value.phone);
    formData.append('location', data.value.location);
    formData.append('experience', data.value.experience);
    const response = await createResume(formData, resumeRef.value);
    response ? await getUserResume(false) : null;
}
</script>
<template>
    <form @submit.prevent="submit">
        <div class="p-4">
            <div class="row" ref="resumeRef">
                <div class="col-12">
                    <h4>Resume</h4>
                </div>
                <div class="col-md-4 mb-3">
                    <label for="fname" class="form-label required">First Name</label>
                    <input class="form-control" :class="{ 'is-invalid border border-danger': errors?.first_name }"
                        v-model="data.first_name" type="text" id="fname" placeholder="Enter First Name" />
                    <Error v-if="errors.first_name" :message="errors?.first_name[0]" />
                </div>
                <div class="col-md-4 mb-3">
                    <label for="lname" class="form-label required">Last Name</label>
                    <input class="form-control" :class="{ 'is-invalid border border-danger': errors?.last_name }"
                        v-model="data.last_name" type="text" id="lname" placeholder="Enter Last Name" />
                    <Error v-if="errors.last_name" :message="errors?.last_name[0]" />
                </div>
                <div class="col-md-4 mb-3">
                    <label for="email" class="form-label required">Email</label>
                    <input class="form-control" :class="{ 'is-invalid border border-danger': errors?.email }"
                        v-model="data.email" type="email" id="email" placeholder="Email" />
                    <Error v-if="errors.email" :message="errors?.email[0]" />
                </div>
                <div class="col-md-6 mb-3">
                    <label for="phone" class="form-label">Phone</label>
                    <input class="form-control" :class="{ 'is-invalid border border-danger': errors?.phone }"
                        v-model="data.phone" type="text" id="phone" placeholder="+1 202 555 0111" />
                    <Error v-if="errors.phone" :message="errors?.phone[0]" />
                </div>
                <div class="col-md-6 mb-3">
                    <label for="address" class="form-label">Address</label>
                    <input class="form-control" :class="{ 'is-invalid border border-danger': errors?.location }"
                        v-model="data.location" type="text" id="address" placeholder="Address" />
                    <Error v-if="errors.location" :message="errors?.location[0]" />
                </div>
                <div class="col-md-12 mb-3">
                    <label for="experience" class="form-label">Summarize Your Experince</label>
                    <textarea class="form-control" :class="{ 'is-invalid border border-danger': errors?.experience }"
                        v-model="data.experience" id="experience" rows="4" placeholder="Maximum of 1000 Characters" />
                    <Error v-if="errors.experience" :message="errors?.experience[0]" />
                </div>
            </div>
            <div class="row mb-4">
                <div class="col-md-6">
                    <label for="resume" class="form-label">Upload Resume</label>
                    <input type="file" class="form-control" id="formFile" @change="onFileChange">
                    <small>Resume must be a file of type: pdf, doc, docx</small>
                    <Error v-if="errors.resume" :message="errors?.resume[0]" />
                </div>
            </div>
            <div class="row mb-4" v-if="data.resume">
                <div class="col-md-6">
                    <a v-if="data.resume" :href="data.resume" target="_blank"
                        class="cursor-pointer text-dark p-2 rounded d-flex align-items-center justify-content-between"
                        style="border: 1px solid #c7cdd4; width: 100%;">
                        <div class="d-flex align-items-center">
                            <i :class='icon'></i><span>View Your Resume</span>
                        </div>
                        <i class='menu-icon tf-icons bx bxs-cloud-download text-primary fs-3'></i>
                    </a>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-12 mb-3">
                    <Button type="submit" id="add-experience" btnClasses="btn btn-primary">Save</Button>
                </div>
            </div>
        </div>
    </form>
</template>