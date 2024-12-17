<script setup>
import { ref, inject, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import VueTagsInput from "@sipec/vue3-tags-input";
import { useToastr } from "@composables/toastr";

const props = defineProps({
    assignedTags: Array,
    autocomplete: Array,
    type: String,
    placeholder: String,
    onlyFromAutoComplete: Boolean,
    attribute_id: String,
    openOnClick: Boolean

});

const tags = ref('');
const emits = defineEmits();
const assigned = ref(props.assignedTags);
const eventBus = inject('eventBus');
const showDropDown = ref(false);
const route = useRoute()
const { toast } = useToastr();

const filteredItems = computed(() => {
    return props.autocomplete.filter(i => {
        if (props.attribute_id) {
            return i.text.toLowerCase().indexOf(tags.value.toLowerCase()) !== -1;
        } else if (i.attribute.length == 0) {
            return false
        } else {
            return i.text.toLowerCase().indexOf(tags.value.toLowerCase()) !== -1;
        }
    }).sort((a, b) => (a.text > b.text ? 1 : -1));
});

const fetchSuggestions = () => {
    if (props.attribute_id) {
        props.autocomplete = [];
        emits('fetchSuggestions', props.attribute_id);
    }
}

const focus = (e) => {
    if (props.openOnClick) {
        setTimeout(() => {
            showDropDown.value = showDropDown.value ? false : true
        }, 100)
    }
}

const beforeAdd = (event) => {
    if (props.assignedTags) {
        if ((props.onlyFromAutoComplete && props.autocomplete.some(tag => tag.text === event.tag.text))) {
          route.params?.levelOneslug === 'automotive' && assigned.value.length === 1 && props.type === 'attribute' ||  route.params?.levelOneslug === 'real-estate' && props.type === 'attribute' && assigned.value.length === 1 ? toast('You cannot add more than one tag', 'error') : (props.assignedTags.push(event.tag), assigned.value.push(event.tag))
        } else if (!props.onlyFromAutoComplete) {
            event.tag.type = props.type
            props.assignedTags.push(event.tag)
        }
    }
    tags.value = '';
}


const deleteTag = (event) => {
    eventBus.emit('removedTag', { tag: event.tag });
    if (props.type == 'attribute') {
        props.assignedTags.splice(props.assignedTags.findIndex(obj => {
            if (obj.pivot?.attribute_id) {
                return obj.pivot.attribute_id === props.attribute_id && obj.id === event.tag.id;
            } else {
                return obj.id === event.tag.id;
            }
        }), 1);
        assigned.value = props.assignedTags
    } else {
        props.assignedTags.splice(props.assignedTags.findIndex(obj => obj.id === event.tag.id), 1)
        assigned.value = props.assignedTags
    }
    event.deleteTag();
}

const formate = (type) => {
    let arr = [];
    if (assigned.value && assigned.value.length > 0) {
        assigned.value.map((obj) => {
            if (props.attribute_id) {
                if (obj.pivot) {
                    if (obj.pivot.attribute_id) {
                        if (obj.pivot.attribute_id == props.attribute_id) {
                            arr.push(obj)
                        }
                    } else {
                        if (obj.attribute.find(obj => obj.id === props.attribute_id)) {
                            arr.push(obj)
                        }
                    }
                } else {
                    if (obj.attribute.find(obj => obj.id === props.attribute_id)) {
                        arr.push(obj)
                    }
                }
            }
            else if (obj[type] == this[type]) {
                arr.push(obj)
            }
        });
    }
    assigned.value = arr
}

watch(props.autocomplete, (tags) => {
    props.autocomplete = tags;
}, { deep: true });

watch(props.assignedTags, (tags) => {
    assigned.value = tags;
    if (props.type) {
        formate('type');
    }
}, { deep: true });

onMounted(() => {
    if (props.type) {
        formate('type');
    }
});
</script>

<template>
    <VueTagsInput v-model="tags" :placeholder="placeholder" :tags="assigned" @before-adding-tag="beforeAdd"
        :avoid-adding-duplicates="true" :add-only-from-autocomplete="onlyFromAutoComplete"
        :autocomplete-items="filteredItems" @before-deleting-tag="deleteTag"
        @focus.prevent="() => { focus(); fetchSuggestions() }" @blur.prevent="focus" />
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