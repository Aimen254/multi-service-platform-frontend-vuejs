import { inject, ref } from "vue"
import { useUserStore } from '../stores/user'
import { useHelper } from '@composables/helper'
import { useToastr } from '@composables/toastr'
import { useRouter } from "vue-router"
import { useMessage } from "./message";

export const useAddress = () => {
    const userStore = useUserStore();
    const { toast, confirm } = useToastr();
    const router = useRouter();
    const { otpNotVerified, inValidToken, showLoading, hideLoading, } = useHelper();
    const { recordNotFound } = useMessage()

    const $http = inject('$http'); // accessing axios
    const token = userStore?.user?.access_token; // accessing authenticated user's token
    const addresses = ref([]); // property to assign array of addresses
    const address = ref({}); // property to assign object of single address
    const meta = ref({}); // property to assign object of pagination
    const errors = ref({}); // property to assign object of errors
    const dataNotFound = ref(null)

    // get all the addresses of user
    const getAddresses = async (params, component) => {
        try {
            showLoading(component);
            dataNotFound.value = null
            const response = await $http.get('/api/addresses', {
                params: params
            });
            hideLoading();
            addresses.value = response?.data?.data;
            meta.value = response?.data?.meta;
            dataNotFound.value = response.data.data.length == 0 ? recordNotFound() : null
        } catch (exception) {
            hideLoading();
            otpNotVerified(exception?.response?.status);
            inValidToken(exception?.response?.data?.message);
        }
    }

    // fetach specific address while editing
    const editAddress = async (id, component) => {
        try {
            showLoading(component);
            const response = await $http.get(`/api/edit-address/${id}`);
            hideLoading();
            address.value = response?.data?.data;
        } catch (exception) {
            hideLoading();
            otpNotVerified(exception?.response?.status);
            inValidToken(exception?.response?.data?.message);
        }
    }

    // create or update address of user
    const updateOrCreateAddress = async (data, component) => {

        let config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };

        try {
            showLoading(component);
            const response = await $http.post('/api/address-settings', data, config);
            hideLoading();
            errors.value = {};
            toast(response?.data?.message);
            router.push('/account/newspaper-delivery');
            return response?.status;
        } catch (exception) {
            hideLoading();
            errors.value = exception?.response?.data?.message;
            otpNotVerified(exception?.response?.status);
            inValidToken(exception?.response?.data?.message);
        }
    }

    // update the status of address
    const updateAddressStatus = async (id, refreshAddressesParams, component) => {
        try {
            const response = await $http.patch(`/api/addresses/update-status/${id}`);
            getAddresses(refreshAddressesParams, component);
            toast(response?.data?.message);
        } catch (exception) {
            errors.value = exception?.response?.data?.message;
            otpNotVerified(exception?.response?.status);
            inValidToken(exception?.response?.data?.message);
        }
    }

    // delete the address of user
    const deleteAddress = async (addressId, refreshAddressesParams, component) => {
        try {
            const result = await confirm('Do you want to delete this address?', 'Yes, Delete!');
            if (result.isConfirmed) {
                const response = await $http.delete(`/api/remove-address/${addressId}`);
                getAddresses(refreshAddressesParams, component);
                toast(response?.data?.message);
            }
        } catch (exception) {
            if (exception?.response?.data?.messageType == 'default') {
                toast(exception?.response?.data?.message, 'warning');
            }
            otpNotVerified(exception?.response?.status);
            inValidToken(exception?.response?.data?.message);
        }
    }

    // returns reactive properties and methods
    return {
        addresses,
        address,
        meta,
        errors,
        dataNotFound,
        getAddresses,
        editAddress,
        updateOrCreateAddress,
        updateAddressStatus,
        deleteAddress,
    }
}