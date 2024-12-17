import { ref, inject, reactive } from "vue"
import { useToastr } from "./toastr";
import { useHelper } from '@composables/helper'
import { useModuleSettings } from '@composables/modules.js';

export const useAttribute = () => {
    const $http = inject('$http');
    const { inValidToken, showLoading, hideLoading, } = useHelper();
    const assignedTags = ref([]);
    const { toast } = useToastr();
    const attributes = reactive([]);
    const { requiredAttributesSlug } = useModuleSettings();
    const requiredAttributes = reactive([])
    const optionalAttributes = reactive([])

    const productAttributes = async (module) => {
        try {
            let response = await $http.get(`api/${module}/attributes`);
            attributes.value = response?.data?.attributes ?? response?.data?.data;
        } catch (exception) {
            inValidToken(exception?.response?.data?.message);
        }
    }

    const getAttributes = async (module, uuid = null, component = NULL, isLoad = false) => {
        try {
            isLoad && showLoading(component)
            attributes.value = [];
            assignedTags.value = [];
            let response = await $http.get(`api/${module}/attributes/${uuid ? uuid : ''}`);
            assignedTags.value = response.data?.assignedTag ? response.data?.assignedTag : [];
            attributes.value = response?.data?.attributes ?? response?.data?.data;
            const required = requiredAttributesSlug.value

            // Filter attributes into two arrays: requiredAttributes and optionalAttributes
            requiredAttributes.value = attributes.value.filter(attribute => required.includes(attribute.slug));
            optionalAttributes.value = attributes.value.filter(attribute => !required.includes(attribute.slug));

            isLoad && hideLoading();
        } catch (exception) {
            isLoad && hideLoading();
            inValidToken(exception?.response?.data?.message);
        }
    }

    const getSuggestions = async (module, attributeId) => {
        try {
            let response = await $http.get(`api/${module}/attribute_tags/search/${attributeId}`);
            return response.data;
        } catch (exception) {
            inValidToken(exception?.response?.data?.message);
        }
    }

    const assignAttributeTags = async (module, uuid, data, component = NULL) => {
        try {
            showLoading(component);
            let response = await $http.post(`api/${module}/attribute-tags/assign/${uuid}`, data);
            toast(response.data?.message);
            hideLoading();
            await getAttributes(module, uuid, component, true);
            return response.data;
        } catch (exception) {
            hideLoading();
            inValidToken(exception?.response?.data?.message);
        }
    }

    const transform = (attributes) => {
        let transformedAttributes = [];
        attributes.map((item) => {
            transformedAttributes.push(
                {
                    id: item.id,
                    text: item.name
                }
            );
        })
        return transformedAttributes;
    }

    return {
        getAttributes,
        getSuggestions,
        assignAttributeTags,
        productAttributes,
        transform,
        attributes,
        assignedTags,
        requiredAttributes,
        optionalAttributes
    };
}