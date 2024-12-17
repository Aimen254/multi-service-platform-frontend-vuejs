<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { useProductApi } from '@composables/products';
import { useTagStore } from '@stores/tags';
import VueTagsInput from "@sipec/vue3-tags-input";
import Button from '@components/core/Button.vue';
import { useModuleSettings } from '@composables/modules';

const route = useRoute();
const productUuid = ref(null);
const extraTag = ref('');
const brandTag = ref('');
const tag = ref('');
const router = useRouter();
const ignoreTag = ref('');
const form = ref(null);
const removeOrphanTags = ref([]);
const removeStandardTags = ref([]);
const levelOne = route.params?.levelOneslug
const productTags = ref([]);
const nextRoute = ref(null);
const tagStore = useTagStore();
const previousRoute = ref(null);
const { arrFiltered, filteredAllTags, allIgnoredAutocomplete, productIgnoredTag, extraTags, getProductTag, allproductBrandTags, brandTags, assignTags } = useProductApi();
const { itemContainerValidator } = useModuleSettings();

const filteredTagsItem = computed(() => {
    return filteredAllTags.value.filter(i => {
        return i.text.toLowerCase().indexOf(extraTag.value.toLowerCase()) !== -1;
    });
});

const filteredIgnoreItem = computed(() => {
    return allIgnoredAutocomplete.value.filter(i => {
        return i.text.toLowerCase().indexOf(ignoreTag.value.toLowerCase()) !== -1;
    });
});

const filteredBrandItem = computed(() => {
    return brandTags.value.filter(i => {
        return i.text.toLowerCase().indexOf(brandTag.value.toLowerCase()) !== -1;
    });
});


const deleteTag = (e) => {
    if (e.tag && e.tag.pivot) {
        if (e.tag.pivot.tag_id && e.tag.priority != 1) {
            removeOrphanTags.value.push(e.tag.pivot.tag_id)
        } else if (e.tag.pivot.standard_tag_id && e.tag.priority == 4) {
            removeStandardTags.value.push(e.tag.pivot.standard_tag_id)
        }
    }
    arrFiltered.value.splice(arrFiltered.value.findIndex(obj => obj.id === e.tag.id), 1)
}


const deleteExtraTag = (e) => {
    if (e.tag.pivot) {
        if (e.tag.pivot.tag_id && e.tag.priority != 1) {
            removeOrphanTags.value.push(e.tag.pivot.tag_id)
        } else if (e.tag.pivot.standard_tag_id && e.tag.priority == 4) {
            removeStandardTags.value.push(e.tag.pivot.standard_tag_id)
        }
    }
    extraTags.value.splice(extraTags.value.findIndex(obj => obj.id === e.tag.id), 1)
}

const deleteIgnoreTag = (e) => {
    if (e.tag.pivot) {
        if (e.tag.pivot.tag_id && e.tag.priority != 1) {
            removeOrphanTags.value.push(e.tag.pivot.tag_id)
        } else if (e.tag.pivot.standard_tag_id && e.tag.priority == 4) {
            removeStandardTags.value.push(e.tag.pivot.standard_tag_id)
        }
    }
    productIgnoredTag.value.splice(productIgnoredTag.value.findIndex(tag => tag.text === e.tag.text), 1);
}

const deleteBrandTag = (e) => {
    if (e?.tag) {
        if (e?.tag?.id && e?.tag?.priority != 1) {
            removeOrphanTags.value.push(e?.tag?.id)
        } else if (e?.tag?.pivot?.standard_tag_id && e?.tag?.priority == 4) {
            removeStandardTags.value.push(e?.tag?.pivot?.standard_tag_id)
        }
    }
    allproductBrandTags.value.splice(allproductBrandTags.value.findIndex(tag => tag.text === e.tag.text), 1);
}

const submit = async () => {
    const formData = new FormData();
    formData.append('tags', JSON.stringify(extraTags.value) ?? '');
    formData.append('brandTags', JSON.stringify(allproductBrandTags.value) ?? '');
    formData.append('categoryTags', JSON.stringify(productTags.value))
    formData.append('removeStandardTags', JSON.stringify(removeStandardTags.value) ?? '');
    formData.append('removeOrphans', JSON.stringify(removeOrphanTags.value) ?? '');
    formData.append('ignoredTags', JSON.stringify(productIgnoredTag.value) ?? '');
    if (route.name === 'garage.tags') {
        formData.append('frontendFlag', true); S
    }

    const response = await assignTags(levelOne, productUuid.value, formData, route.name);
    return response.data;
}


onMounted(async () => {
    if (route.name === 'garage.tags' && !itemContainerValidator.value('noMainImage')) {
        previousRoute.value = 'garage.media';
    } else if (route.name === 'articles.tags' && !itemContainerValidator.value('noMainImage')) {
        previousRoute.value = 'articles.media';
    } else if (route.name === 'garage.tags' && itemContainerValidator.value('noMainImage')) {
        previousRoute.value = 'garage.form';
    } else if (route.name === 'articles.tags' && itemContainerValidator.value('noMainImage')) {
        previousRoute.value = 'articles.form';
    }
    productUuid.value = route.params.uuid;
    await getProductTag(productUuid.value, true);
});
</script>
<template>
    <div class="card-body">
        <form @submit.prevent="submit">
            <div class="mb-3">
                <label class="form-label">Tags</label>
                <vue-tags-input v-model="tag" @before-deleting-tag="deleteTag" :tags="arrFiltered"
                    :add-only-from-autocomplete="true" placeholder="Add Tags Here"
                    @tags-changed="newTags => (arrFiltered = newTags)" data-bs-toggle="tooltip" data-bs-placement="top"
                    title="Mapped Tags Information." />
            </div>
            <div class="mb-3" v-if="itemContainerValidator('tags')">
                <label class="form-label">Extra Tags</label>
                <vue-tags-input v-model="extraTag" @before-deleting-tag="deleteExtraTag" :tags="extraTags"
                    placeholder="Add Extra Tags Here" :autocomplete-items="filteredTagsItem"
                    @tags-changed="newTags => (extraTags = newTags)" data-bs-toggle="tooltip" data-bs-placement="top"
                    title="Unmapped Tags Information." />
            </div>
            <div class="mb-3" v-if="itemContainerValidator('ignoredTags')">
                <label class="form-label">Ignored Tags</label>
                <vue-tags-input v-model="ignoreTag" @before-deleting-tag="deleteIgnoreTag" :tags="productIgnoredTag"
                    placeholder="Add Ignored Tags Here" :autocomplete-items="filteredIgnoreItem"
                    @tags-changed="newTags => (productIgnoredTag = newTags)" data-bs-toggle="tooltip"
                    data-bs-placement="top" title="Ignored Inappropriate Tags." />
            </div>
            <div class="mb-3" v-if="itemContainerValidator('brandTags')">
                <label class="form-label">Brand Tags</label>
                <vue-tags-input v-model="brandTag" @before-deleting-tag="deleteBrandTag" :tags="allproductBrandTags"
                    placeholder="Add Brand Tags Here" :autocomplete-items="filteredBrandItem"
                    @tags-changed="newTags => (allproductBrandTags = newTags)" />
            </div>
            <div class="mb-3 d-flex justify-content-between">
                <router-link :to="{ name: previousRoute, params: { uuid: route.params.uuid } }" class="btn btn-primary"
                    active-class="active">Previous</router-link>
                <Button type="submit" btnClasses="btn btn-primary">Submit</Button>
            </div>
        </form>
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