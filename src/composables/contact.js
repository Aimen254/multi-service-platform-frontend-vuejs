import { ref, inject } from "vue";
import { useHelper } from "./helper";
import { useToastr } from "./toastr";
import { useUserStore } from "@stores/user";

export const useContactApi = () => {
    const $http = inject("$http");
    const { inValidToken, otpNotVerified, } = useHelper();
    const { toast } = useToastr();
    const userStore = useUserStore();
    const errors = ref(null);

    async function requestProduct(module, form, component = null) {
        try {
            errors.value = ref();
            const response = await $http.post(`api/${module}/contact-form`, form)
            toast(response.data.message)
        } catch (e) {
            if (e.response.status == 422) {
                errors.value = e.response.data.message
            }
            otpNotVerified(e.response.status)
            inValidToken(e.response.data.message)
        }
    }

    return {
        requestProduct,
        errors
    }
}
