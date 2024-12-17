<script setup>
import { onMounted, ref } from "vue";
import { Dropzone } from "dropzone";
import { useUserStore } from '@stores/user';
import { useToastr } from "@composables/toastr";
import 'dropzone/dist/basic.css';

const props = defineProps({
    url: String,
    uploadMultiple: Boolean,
    disablePreviews: Boolean,
    isDZMessage: String,
    callback: Function
});

const emit = defineEmits();
const { user } = useUserStore();
const { toast } = useToastr();
const dropzoneInit = ref(null);
const { VITE_APP_API_KEY } = import.meta.env;
const headers = {
    'Authorization': `Bearer ${user?.access_token}`,
    'x-api-key': VITE_APP_API_KEY
};

const previewTemplate = `<div class="dz-preview dz-file-preview">
    <div class="dz-details">
        <div class="dz-thumbnail mx-auto">
            <img data-dz-thumbnail>
            <span class="dz-nopreview">No preview</span>
            <div class="dz-success-mark"></div>
            <div class="dz-error-mark"></div>
            <div class="dz-error-message"><span data-dz-errormessage></span></div>
            <div class="progress">
                <div class="progress-bar progress-bar-primary" role="progressbar" aria-valuemin="0" aria-valuemax="100" data-dz-uploadprogress></div>
            </div>
        </div>
        <div class="dz-filename" data-dz-name></div>
        <div class="dz-size" data-dz-size></div>
    </div>
</div>`;

onMounted(() => {
    if (dropzoneInit.value !== null) {
        let myDropzone = new Dropzone(dropzoneInit.value, {
            headers: headers,
            url: props.url,
            previewTemplate: previewTemplate,
            uploadMultiple: props.uploadMultiple,
            disablePreviews: props.disablePreviews,
            parallelUploads: 6,
            maxFiles: 6,
            maxFilesize: 1024,
            acceptedFiles: 'image/jpeg, image/png, image/jpg',
            addRemoveLinks: true,
        });

        myDropzone.on('successmultiple', (files, response) => {
            toast(response.message);

            files.forEach((file) => {
                myDropzone.removeFile(file);
            })
            props.callback();
        });

        myDropzone.on('error', (file, response) => {
            console.log(response.message);
            $(file.previewElement).find('.dz-error-message').text(response.message);
        });
    }
})
</script>

<template>
    <form ref="dropzoneInit" action="/upload" class="dropzone needsclick image-preview-container" id="dropzone-multi">
        <div class="dz-message needsclick" :style="isDZMessage">
            Drop files here or click to upload
        </div>
        <div class="fallback">
            <input name="file" type="file" />
        </div>
        <!-- previews -->
        <slot></slot>
    </form>
</template>