import { ref, inject } from 'vue';
import { useUserStore } from '@stores/user';
import { useHelper } from './helper'

export const useFilterApi = () => {
    const userStore = useUserStore();
    const $http = inject('$http');
    const { inValidToken, } = useHelper();
    const productFilters = ref([]);

    async function getProductFilters(module, params) {
        try {
            productFilters.value = [];
            const response = await $http.get(`api/${module}/filters`, {
                params: params
            });
            productFilters.value = response.data.data;
        } catch (exception) {
            inValidToken(exception?.response?.data?.message);
        }
    }

    return {
        getProductFilters,
        productFilters
    }
};
