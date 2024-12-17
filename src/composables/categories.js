import { ref, inject } from 'vue';
import { useHelper } from './helper';
import { useToastr } from './toastr'
import { useUserStore } from '@stores/user';
import { dreamCategoriesStore } from '@stores/categories'
import { useRoute } from 'vue-router'
import { useMessage } from "@composables/message";

export const useCategoriesApi = () => {
    const $http = inject('$http');
    const { inValidToken, otpNotVerified, showLoading, hideLoading, } = useHelper()
    const { toast, confirm } = useToastr()
    const userStore = useUserStore();
    const route = useRoute();
    const { recordNotFound } = useMessage()

    const categoriesStore = dreamCategoriesStore()
    const meta = ref({})
    const dataNotFound = ref(null)
    const errors = ref(null);

    // save categories
    async function addCategory(module, data, component = null) {
        try {
            showLoading(component)
            dataNotFound.value = null
            const response = await $http.post(`api/${module}/dream-products`, data, {
                params: {
                    productLimit: 3,
                    with_user_address: true
                }
            })
            hideLoading()
            errors.value = null;
            if (response.data?.data && route.name === 'admin-add-favorite-catgories') {
                storeCategories(response.data.data, 'object')
            } else {
                getMyCategories(module)
            }
            toast(response.data.message)
            return response.data;
        } catch (e) {
            hideLoading()
            errors.value = e?.response?.data?.message
            inValidToken(e?.response?.data?.message)
        }
    }

    // get dream or my categories
    async function getMyCategories(module, page = 1, loading = true) {
        try {
            loading ? showLoading() : ''
            const response = await $http.get(`api/${module}/dream-products`, {
                params: {
                    limit: 10,
                    productLimit: 4,
                    page: page,
                    with_user_address: true
                }
            })
            loading ? hideLoading() : '';
            meta.value = response?.data?.meta;
            storeCategories(response.data.data, 'array', meta.value)
            dataNotFound.value = response.data.data.length == 0 ? recordNotFound() : null
            return response?.data?.data
        } catch (e) {
            loading ? hideLoading() : ''
            inValidToken(e?.response?.data?.message)
        }
    }

    async function editMyCategory(module, category, data, component = null) {
        try {
            showLoading(component);
            const response = await $http.put(`api/${module}/dream-products/${category.id}`, data, {
                params: {
                    productLimit: 3,
                    with_user_address: true
                }
            })
            hideLoading();
            categoriesStore.updateOrRemoveCategories(response.data.data)
            toast(response.data.message)
            return response.data;
        } catch (e) {
            hideLoading();
            errors.value = e?.response?.data?.message
            e?.response?.data?.message && e?.response?.data?.message === 'Already exists.' ? toast(e?.response?.data?.message, "error") : null
            inValidToken(e?.response?.data?.message)
        }
    }

    // delete my category
    async function deleteCategory(module, category) {
        const result = await confirm('You want to delete it?', 'Yes, Delete!');
        if (result.isConfirmed) {
            try {
                const response = await $http.delete(`api/${module}/dream-products/${category.id}`)
                meta.value.total--;
                toast(response.data.message)
                getMyCategories(module)
            } catch (e) {
                inValidToken(e?.response?.data?.message)
            }
        }
    }


    // store categorise in pinia
    function storeCategories(data, type, meta = null) {
        categoriesStore.saveCategories(data, type, meta)
    }

    return {
        addCategory,
        getMyCategories,
        deleteCategory,
        meta,
        editMyCategory,
        dataNotFound,
        errors
    }

}