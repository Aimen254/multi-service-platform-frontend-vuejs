<script setup>
import { ref, inject, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router'; 
import Button from '@components/core/Button.vue';
import { useAttribute } from '@composables/attribute'
import { useModuleSettings } from '@composables/modules';
import TagComponent from '@components/core/TagComponent.vue';
import { useTagStore } from '@/stores/tags.js';

const productUuid = ref(null);
const form = ref({});
const attributeTags = ref([]);
const attributeTagRef = ref(null);
const removedTags = ref([]);
const previousRoute = ref(null);
const eventBus = inject('eventBus')
const tagStore = useTagStore();
const { getAttributes, attributes, assignedTags, getSuggestions, assignAttributeTags } = useAttribute();
const { itemContainerValidator } = useModuleSettings();
const router = useRouter(); 
const route = useRoute();


const fetchSuggetions = async (attributeId) => {
    attributeTags.value = [];
    let uniq = {}
    const response = await getSuggestions(tagStore.getLevelOneTagId, attributeId);
    response && (attributeTags.value = []);
    response && (attributeTags.value = response.standardTags.filter(obj => !uniq[obj.text.toLowerCase()] && (uniq[obj.text.toLowerCase()] = true)));
}


const submit = async () => {
    form.value.tags = JSON.stringify(assignedTags.value);
    form.value.removedTags = JSON.stringify(removedTags.value);
    const response = await assignAttributeTags(tagStore.getLevelOneTagId, route.params.uuid, form.value, attributeTagRef.value);
    response && (removedTags.value = []);

}
onMounted(async () => {
    previousRoute.value = route.name === 'articles.attribute.tags' ? 'articles.tags' : 'garage.tags';
    eventBus.on('removedTag', (args) => {
        if (args.tag.pivot) {
            removedTags.value.push(args.tag)
        }
    })
    productUuid.value = route.params.uuid;
    await getAttributes(tagStore.getLevelOneTagId, route.params.uuid, attributeTagRef.value, false);
});

onBeforeUnmount(() => {
    eventBus.off('removedTag'); // Remove the event listener
});
</script>
<template>
    <div class="card-body">
        <form @submit.prevent="submit" ref="attributeTagRef">
            <div class="row">
                <div class="col-lg-6 mb-3" v-if="itemContainerValidator('attributeTags')"
                    v-for="attribute in attributes.value" :key="attribute.id">
                    <label class="form-label">{{ attribute.name }}</label>
                    <TagComponent :placeholder="`Search ${attribute.name} Tags`" :assignedTags="assignedTags"
                        type="attribute" :attribute_id="attribute.id" :autocomplete="attributeTags"
                        :onlyFromAutoComplete="true" :productUuid="route.params.uuid" :openOnClick="true"
                        @fetchSuggestions="fetchSuggetions" />
                </div>
            </div>

            <div class="mb-3 d-flex justify-content-between">
                <router-link :to="{ name: previousRoute, params: { uuid: route.params.uuid } }" class="btn btn-primary"
                    active-class="active">Previous</router-link>
                <Button type="submit" btnClasses="btn btn-primary">Submit</Button>
            </div>
        </form>
    </div>
</template>