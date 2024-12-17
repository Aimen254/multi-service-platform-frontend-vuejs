import { ref, inject, onMounted, onBeforeMount } from "vue";
import { useHelper } from "./helper";
import { useToastr } from "./toastr";
import { useMessage } from "./message";

export const myLvCategoryApi = () => {
    const $http = inject("$http");
    const { inValidToken, otpNotVerified, showLoading, hideLoading, } = useHelper();
    const { confirm, toast } = useToastr();
    const { recordNotFound } = useMessage()
    const meta = ref({});
    const productsMeta = ref({});
    const categories = ref([])
    const products = ref([])

    const getMyCategories = async (params, container) => {
        try {
            container ? showLoading(container) : null
            const response = await $http.get('api/my_lv/categories', {
                params: params
            })
            if (params.type == 'categories') {
                meta.value = response?.data?.meta
                categories.value = response?.data?.data
            } else {
                productsMeta.value = response?.data?.meta
                products.value.push(...response?.data?.data)
            }
            container ? hideLoading() : null
        } catch (error) {
            container ? hideLoading() : null
            toast(error.response?.data?.message)
            inValidToken(error.response?.data?.message)
        }
    }

    return {
        getMyCategories,
        meta,
        productsMeta,
        products,
        categories
    }
}

