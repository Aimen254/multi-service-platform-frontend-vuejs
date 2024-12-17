<script setup>
import { ref, onMounted, computed } from 'vue';
import { useHelper } from '@composables/helper';
import { useUserStore } from '@stores/user';
import Error from '@components/core/Error.vue';
import { useProfileApi } from '@composables/profile';
import { useTagStore } from '@stores/tags';
import Button from '@components/core/Button.vue';
import { useSettingsStore } from '@stores/settings';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { useRoute } from 'vue-router';
import { useModuleSettings } from '@composables/modules.js'
import VueTagsInput from "@sipec/vue3-tags-input";
import { userSettings } from '@composables/user-settings';

const { itemContainerValidator, getApectRatio } = useModuleSettings()

const { getUserStandardTags, getUserLevelThree, assignTags, removeTags } = userSettings();

const userStore = useUserStore();
const { getImage } = useHelper();
const tagStore = useTagStore();
const settingsStore = useSettingsStore();
const { errors, publicProfileMediaErrors, getPublicProfile, publicProfileMedia, createOrUpdatePublicProfile } = useProfileApi();
const url = ref(null)
const isSaved = ref(false)
const avatarInputRef = ref('')
const cardbodyRef = ref('')
const bannerurl = ref(null)
const bannerInputRef = ref('')
const avatarLoading = ref(null);
const bannerLoading = ref(null);
const profileLoading = ref(null);
const route = useRoute()

// tags
const assignedLevelTwoTag = ref([]);
const levelTwoTags = ref([]);
const levelTwoTag = ref('');

const assignedLevelThreeTag = ref([]);
const levelThreeTags = ref([]);
const levelThreeTag = ref('');
const showLevelTwoDropDown = ref(false);
const showLevelThreeDropDown = ref(false);
const disabled = ref(false);

const form = ref({
    name: '',
    description: '',
    module: route.params?.levelOneslug,
    is_name_visible: false,
    level_two_tags: [],
    level_three_tags: []
});

// tasg computed property
const filteredLevelTwoTagsItem = computed(() => {
    return levelTwoTags.value.filter(i => {
        return i.text.toLowerCase().indexOf(levelTwoTag.value.toLowerCase()) !== -1;
    });
});

const filteredLevelThreeTagsItem = computed(() => {
    return levelThreeTags.value.filter(i => {
        return i.text.toLowerCase().indexOf(levelThreeTag.value.toLowerCase()) !== -1;
    });
});

// fetching level three tags
const getLevelThreeAgainstUser = async () => {

    console.log(showLevelThreeDropDown.value, "showLevelThreeDropDown.value");
    setTimeout(() => {
        showLevelThreeDropDown.value = !showLevelThreeDropDown.value;
    }, 250)

    if (assignedLevelTwoTag.value) {
        const res = await getUserLevelThree(tagStore.getLevelOneTagId, { levelTwo: JSON.stringify(assignedLevelTwoTag.value) });
        levelThreeTags.value = res;
    }
}

const focus = (e) => {
    setTimeout(() => {
        showLevelTwoDropDown.value = !showLevelTwoDropDown.value;
    }, 250)
}

// removing tags
const deleteTags = async (e) => {
    // removing level two tags
    assignedLevelTwoTag.value.splice(assignedLevelTwoTag.value.findIndex(item => item.id === e.tag.id), 1);
    // removing level three tags
    const res = await removeTags(tagStore.getLevelOneTagId, { filterProductTags: JSON.stringify(e) });
    assignedLevelThreeTag.value = assignedLevelThreeTag.value.filter(item => !res.some(subItem => subItem.id === item.id));
}

const onAvatarInput = (e) => {
    avatarInputRef.value.click();
}

const onBannerInput = (e) => {
    bannerInputRef.value.click();
}

const onFileChange = async (e) => {
    const formData = new FormData();
    const file = e.target.files[0];
    isSaved.value = false;
    url.value = URL.createObjectURL(file);

    if (avatarInputRef.value.files.length > 0) {
        const file = avatarInputRef.value.files[0];
        formData.append('image', file);
    }
    formData.append('type', 'avatar');
    formData.append('_method', 'post');
    formData.append('module', route.params?.levelOneslug);
    await publicProfileMedia(formData, avatarLoading.value);
}

const changeBannerImage = async (e) => {
    const formData = new FormData();
    const file = e.target.files[0];
    isSaved.value = false;
    bannerurl.value = URL.createObjectURL(file);

    if (bannerInputRef.value.files.length > 0) {
        const file = bannerInputRef.value.files[0];
        formData.append('cover_image', file);
    }
    formData.append('type', 'cover_image');
    formData.append('_method', 'post');
    formData.append('module', route.params?.levelOneslug);
    await publicProfileMedia(formData, bannerLoading.value);
}

const submit = async () => {
    form.value.level_two_tags = JSON.stringify(assignedLevelTwoTag.value)
    form.value.level_three_tags = JSON.stringify(assignedLevelThreeTag.value)
    await createOrUpdatePublicProfile(form.value, profileLoading.value);
}

onMounted(async () => {
    const response = await getPublicProfile(route.params?.levelOneslug);
    url.value = response.data.image ?? '';
    bannerurl.value = response.data.cover_image ?? '';
    // fetching standard tags
    if (itemContainerValidator.value('hidePublicProfilFields')) {
        const res = await getUserStandardTags(tagStore.getLevelOneTagId, userStore.user?.id);
        levelTwoTags.value = res?.levelTwoTags; // all level two tags
        assignedLevelTwoTag.value = res?.assignedLevelTwoTags; // assigned level two tags
        assignedLevelThreeTag.value = res?.assignedLevelThreeTags; // assigned level three tags
    }

    form.value = {
        'name': response.data.name ?? '',
        'description': response.data.about ?? '',
        'module': route.params?.levelOneslug ?? '',
        'is_name_visible': response.data.is_name_visible ? true : false,
        'level_two_tags': assignedLevelTwoTag.value,
        'level_three_tags': assignedLevelThreeTag.value
    };

});

</script>
<template>
    <div class="my-3">
        <h5 class="card-header">Public Profile</h5>
        <div class="card-body" v-if="form">
            <form @submit.prevent="submit">
                <div class="row mb-3">
                    <div class="col-3">
                        <div class="image-container" @click="onAvatarInput" ref="avatarLoading">
                            <img :src="getImage(url, 'avatar')" alt="user-avatar" class="d-block rounded"
                                id="uploadedAvatar" />
                            <input type="file" accept="image/*" ref="avatarInputRef" style="display: none"
                                @change="onFileChange" />
                            <i class="bx bx-camera"></i>
                        </div>
                        <div class="my-1 text-center">Avatar size is {{ settingsStore.publicProfileAvatar }} </div>
                        <Error v-if="publicProfileMediaErrors?.image" :message="publicProfileMediaErrors?.image[0]"></Error>
                    </div>
                    <div class="col-9">
                        <div class="image-container" @click="onBannerInput" ref="bannerLoading">
                            <img :src="getImage(bannerurl, 'cover')" alt="user-avatar" class="d-block rounded"
                                id="uploadedAvatar"/>
                            <input type="file" accept="image/*" ref="bannerInputRef" style="display: none"
                                @change="changeBannerImage" />
                            <i class='bx bx-camera'></i>
                        </div>
                        <div class="my-1 text-center">Cover image size is {{ settingsStore.publicProfileBanner }}</div>
                        <Error v-if="publicProfileMediaErrors?.cover_image"
                            :message="publicProfileMediaErrors?.cover_image[0]" class="text-center"></Error>
                    </div>
                </div>
                <div class="profile" ref="profileLoading">
                    <div class="row mb-3" v-if="!itemContainerValidator('hidePublicProfilFields')">
                        <div class="col-md-5">
                            <label for="userId" class="form-label required">User ID</label>
                            <input class="form-control" :class="{ 'is-invalid border border-danger': errors?.name }"
                                type="text" v-model="form.name" id="userId" placeholder="Enter user id" />
                            <Error v-if="errors?.name" :message="errors?.name[0]"></Error>
                        </div>

                        <div class="col-md-7 d-flex align-items-center">
                            <div class="form-check form-check-primary mt-4 py-2">
                                <input class="form-check-input" :checked="form.is_name_visible" type="checkbox"
                                    v-model="form.is_name_visible" id="customCheckPrimary" />
                                <label class="form-check-label mx-2" for="customCheckPrimary">Hide First and Last
                                    Name</label>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-12">
                            <label for="description" class="form-label"
                                :class="[itemContainerValidator('hidePublicProfilFields') ? 'required' : '']">Public
                                Description</label>
                            <QuillEditor v-model:content="form.description" contentType="html"
                                placeholder="Compose description...." />
                            <Error v-if="errors?.description" :message="errors?.description[0]"></Error>
                        </div>
                    </div>

                    <div class="row mt-5" v-if="itemContainerValidator('hidePublicProfilFields')">
                        <div class="col-12 mb-2 mt-5">
                            <label class="form-label required">Level Two Tags</label>
                            <vue-tags-input v-model="levelTwoTag" @before-deleting-tag="deleteTags"
                                style="max-width: 100% !important;" :tags="assignedLevelTwoTag"
                                :add-only-from-autocomplete="true" placeholder="Add level two tags"
                                :autocomplete-items="filteredLevelTwoTagsItem"
                                :autocomplete-always-open="showLevelTwoDropDown"
                                @tags-changed="newTags => (assignedLevelTwoTag = newTags)" data-bs-toggle="tooltip"
                                data-bs-placement="top" @focus="focus" @blur="focus" title="Level two tags" />

                            <Error v-if="errors?.level_two_tags" :message="errors?.level_two_tags[0]"></Error>
                        </div>

                        <div class="col-12 mb-4">
                            <label class="form-label required">Level Three Tags</label>
                            <vue-tags-input v-model="levelThreeTag" :tags="assignedLevelThreeTag"
                                style="max-width: 100% !important;" :add-only-from-autocomplete="true"
                                placeholder="Add level three tags" :autocomplete-items="filteredLevelThreeTagsItem"
                                :autocomplete-always-open="showLevelThreeDropDown"
                                @tags-changed="newTags => (assignedLevelThreeTag = newTags)" data-bs-toggle="tooltip"
                                data-bs-placement="top" @focus="getLevelThreeAgainstUser" @blur="getLevelThreeAgainstUser"
                                title="Level three tags" />
                            <Error v-if="errors?.level_three_tags" :message="errors?.level_three_tags[0]"></Error>
                        </div>
                    </div>

                    <div class="row" :class="[!itemContainerValidator('hidePublicProfilFields') ? 'mt-5' : '']">
                        <div class="col-12" :class="[!itemContainerValidator('hidePublicProfilFields') ? 'mt-5' : '']">
                            <Button type="submit" btnClasses="btn btn-primary">Save</Button>
                        </div>
                    </div>
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

::v-deep.vue-tags-input {
    max-width: 100% !important;
}

::v-deep.vue-tags-input .ti-input {
    border-radius: 6px !important;
}

::v-deep.vue-tags-input .ti-tag {
    position: relative;
    background: #FF6846;
    color: white !important;
    cursor: pointer !important;
    padding: 0.5rem !important;
    border-radius: 4px !important;
}

::v-deep.vue-tags-input .ti-selected-item {
    background: #FF6846 !important;
    color: white !important;
    cursor: pointer !important;
}

::v-deep.vue-tags-input .ti-autocomplete {
    max-height: 40vh !important;
    overflow-y: scroll;
}
</style>