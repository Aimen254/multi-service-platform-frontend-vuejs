<script setup>
import { onMounted, computed, ref } from 'vue';
import VueTagsInput from "@sipec/vue3-tags-input";
import Button from '@components/core/Button.vue';
import { useModuleSettings } from '@composables/modules';
import { userSettings } from '@composables/user-settings';
import { useTagStore } from '@stores/tags';
import { useUserStore } from '@stores/user';

const { singularOwnerTitle } = useModuleSettings();
const { getUserStandardTags, getUserLevelThree, assignTags, removeTags } = userSettings();
const tagStore = useTagStore();
const userStore = useUserStore();

const assignedLevelTwoTag = ref([]);
const levelTwoTags = ref([]);
const levelTwoTag = ref('');

const assignedLevelThreeTag = ref([]);
const levelThreeTags = ref([]);
const levelThreeTag = ref('');
const showLevelTwoDropDown = ref(false);
const showLevelThreeDropDown = ref(false);
const disabled = ref(false);


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

// assigning tags
const submit = async () => {
    disabled.value = true;
    const formData = new FormData();
    let tags = assignedLevelTwoTag.value.concat(assignedLevelThreeTag.value);
    formData.append('tags', JSON.stringify(tags) ?? '');
    await assignTags(tagStore.getLevelOneTagId, userStore.user?.id, formData);
    disabled.value = false;
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

onMounted(async () => {
    // fetching standard tags
    const res = await getUserStandardTags(tagStore.getLevelOneTagId, userStore.user?.id);
    levelTwoTags.value = res?.levelTwoTags; // all level two tags
    assignedLevelTwoTag.value = res?.assignedLevelTwoTags; // assigned level two tags
    assignedLevelThreeTag.value = res?.assignedLevelThreeTags; // assigned level three tags
})
</script>

<template>
    <div class="mb-4">
        <h5 class="card-header">{{ `${singularOwnerTitle} Tags` }}</h5>

        <div class="row px-4">
            <div class="col-12 mb-4">
                <label class="form-label required">Level Two Tags</label>
                <vue-tags-input v-model="levelTwoTag" @before-deleting-tag="deleteTags" :tags="assignedLevelTwoTag"
                    :add-only-from-autocomplete="true" placeholder="Add level two tags"
                    :autocomplete-items="filteredLevelTwoTagsItem" :autocomplete-always-open="showLevelTwoDropDown"
                    @tags-changed="newTags => (assignedLevelTwoTag = newTags)" data-bs-toggle="tooltip"
                    data-bs-placement="top" @focus="focus" @blur="focus" title="Level two tags" />
            </div>

            <div class="col-12 mb-4">
                <label class="form-label required">Level Three Tags</label>
                <vue-tags-input v-model="levelThreeTag" :tags="assignedLevelThreeTag" :add-only-from-autocomplete="true"
                    placeholder="Add level three tags" :autocomplete-items="filteredLevelThreeTagsItem"
                    :autocomplete-always-open="showLevelThreeDropDown"
                    @tags-changed="newTags => (assignedLevelThreeTag = newTags)" data-bs-toggle="tooltip"
                    data-bs-placement="top" @focus="getLevelThreeAgainstUser" @blur="getLevelThreeAgainstUser"
                    title="Level three tags" />
            </div>

            <div class="col-12 text-end">
                <Button type="submit" @click="submit" btnClasses="btn btn-primary" :disabled="disabled || assignedLevelTwoTag.length == 0 || assignedLevelThreeTag.length == 0">Submit</Button>
            </div>
        </div>
    </div>
</template>

<style scoped>
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