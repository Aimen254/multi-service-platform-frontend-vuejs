<script setup>
import { ref, onMounted, computed, onUpdated } from 'vue';
import { useRoute } from 'vue-router';
import { useProductApi } from '@composables/products';
import { useHelper } from '@composables/helper';
import { useSettingsStore } from '@stores/settings';
import { useTagStore } from '@stores/tags';
import Error from '@components/core/Error.vue';
import Dropzone from '@components/core/Dropzone.vue';

const { errors, editProduct, updateProductMainImage, deleteProductMedia } = useProductApi();
const { getImage } = useHelper();
const { productDimensions } = useSettingsStore();
const route = useRoute();
const nextRoute = ref(null);
const previousRoute = ref(null);
const tagStore = useTagStore();

const { VITE_APP_API_URL } = import.meta.env;
const article = ref(null);
const url = ref(null);
const isSaved = ref(false);
const fileInputRef = ref('');
const levelOne = ref(route.params?.levelOneslug);
const secondaryImages = ref([]);
const dropzoneURL = ref(`${VITE_APP_API_URL}/api/${route.params?.levelOneslug}/product-media/${route?.params?.uuid}`);

const getArticle = async () => {
    article.value = await editProduct(levelOne.value, route?.params?.uuid, false, { 'disableStatusFilter': true })
    url.value = article?.value?.main_image;
    isSaved.value = url.value ? true : false;
    secondaryImages.value = article?.value?.secondary_images;
}

const openFileDialog = () => {
    document.getElementById('upload').click();
}

const onFileChange = async (e) => {
    const file = e.target.files[0];
    isSaved.value = false;
    url.value = URL.createObjectURL(file);

    const formData = new FormData();
    if (fileInputRef.value.files.length > 0) {
        formData.append('image', file);
    }
    const response = await updateProductMainImage(formData, levelOne.value, route?.params?.uuid, article?.value?.main_image_id ? article?.value?.main_image_id : 0);
    response && (await getArticle());
}

const isDZMessage = computed(() => {
    return {
        display: secondaryImages.value.length > 0
            ? 'none' : 'block'
    };
});

const deleteArticle = async (id) => {
    const response = await deleteProductMedia(levelOne.value, route?.params?.uuid, id);
    if (response) {
        secondaryImages.value = secondaryImages.value.filter(item => item.id !== response.id)
    }
}

const isRequired = computed(() => {
    switch (tagStore.getLevelOneTagSlug) {
        case 'government':
        case 'notices':
            return false;
        default:
            return true;
    }
})

onMounted(async () => {
    nextRoute.value = route.name === 'garage.media' ? 'garage.tags' : 'articles.tags';
    previousRoute.value = route.name === 'garage.media' ? 'garage.form' : 'articles.form';
    await getArticle();
});
</script>

<template>
    <div class="card-body">
        <div class="row mb-3">
            <div class="col-md-3 mb-2">
                <label for="upload" class="form-label mb-3" :class="{ 'required': isRequired }">Image</label>
                <div class="position-relative">
                    <div class="d-flex align-items-start align-items-sm-center gap-4">
                        <img :src="getImage(url, isSaved)" class="d-block  mw-100 img-fluid"
                            style="height: 160px; width: 240px;" id="uploadedFile" />
                    </div>
                    <div class="position-absolute profile-camera-icon" role="button" @click="openFileDialog">
                        <i class='bx bxs-camera'></i>
                        <input id="upload" type='file' ref="fileInputRef" @change="onFileChange" hidden
                            accept="image/png, image/jpeg" />
                    </div>
                </div>
                <small v-if="productDimensions">Main image must be
                    {{ productDimensions }}</small>
                <Error v-if="errors" :message="errors"></Error>
            </div>

            <div class="col-md-9">
                <label for="upload" class="form-label mb-3">Other Images</label>
                <Dropzone :url="dropzoneURL" :uploadMultiple="true" :isDZMessage="isDZMessage" :callback="getArticle">
                    <div class="dz-preview dz-processing dz-image-preview dz-complete" v-if="secondaryImages"
                        v-for="(secondaryImage, index) in secondaryImages" :key="index">
                        <div class="dz-details">
                            <div class="dz-thumbnail mx-auto">
                                <img data-dz-thumbnail :src="secondaryImage.image">
                                <span class="dz-nopreview">No preview</span>
                                <div class="dz-success-mark"></div>
                                <div class="dz-error-mark"></div>
                                <div class="dz-error-message"><span data-dz-errormessage></span></div>
                                <div class="progress">
                                    <div class="progress-bar progress-bar-primary" role="progressbar" aria-valuemin="0"
                                        aria-valuemax="100" data-dz-uploadprogress></div>
                                </div>
                            </div>
                            <div class="dz-filename" data-dz-name>Secondary Image</div>
                            <div class="dz-size" data-dz-size>{{ secondaryImage.size / 100 }} kb</div>
                        </div>
                        <a class="dz-remove" href="javascript:undefined;" @click="deleteArticle(secondaryImage.id)"
                            data-dz-remove="">Remove file</a>
                    </div>
                </Dropzone>
                <small v-if="productDimensions">Other images must be of
                    {{ productDimensions }} dimensions</small>
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-12 d-flex justify-content-between">
                <router-link :to="{ name: previousRoute, params: { uuid: route.params.uuid } }"
                    class="btn btn-primary">Previous</router-link>
                <router-link :to="{ name: nextRoute, params: { uuid: route.params.uuid } }" class="btn btn-primary"
                    v-if="article?.main_image_id">Next</router-link>
            </div>
        </div>
    </div>
</template>

<style scoped>
.profile-camera-icon {
    width: 2rem;
    height: 2rem;
    top: 43%;
    left: 40%;
    color: white !important;
}

.bxs-camera {
    font-size: 1.7rem;
}
</style>