import { inject } from "vue";
import { useToastr } from "./toastr";
import { useUserStore } from "@/stores/user";
import { useHelper } from "./helper";

export const userSettings = () => {

    const { toast } = useToastr();
    const userStore = useUserStore();
    const $http = inject('$http'); // accessing axios
    const token = userStore?.user?.access_token; // accessing authenticated user's token
    const { otpNotVerified, inValidToken, showLoading, hideLoading, } = useHelper();

    // fetching assigned level two and level three tags with all level two tags
    const getUserStandardTags = async (moduleId, userId, params = null) => {
        try {

            const response = await $http.get(`/api/${moduleId}/user-tags/${userId}/`, {
                params: params,
            });

            return response?.data?.data;
        } catch (exception) {
            inValidToken(exception?.response?.data?.message);
        }
    }

    // fetching level three tags against level two tags
    const getUserLevelThree = async (moduleId, params = null) => {
        try {
            const response = await $http.get(`/api/${moduleId}/user-level-three-tags`, {
                params: params,
            });

            return response?.data?.data;
        } catch (exception) {
            inValidToken(exception?.response?.data?.message);
        }
    }

    // assigning level two and three tags
    const assignTags = async (moduleId, userId, data) => {
        try {
            const response = await $http.post(`/api/${moduleId}/assign/standard-tags/${userId}`, dat);

            toast(response?.data?.message);
        } catch (exception) {
            inValidToken(exception?.response?.data?.message);
        }
    }

    // removing tags
    const removeTags = async (moduleId, params = null) => {
        try {
            const response = await $http.get(`/api/${moduleId}/remove-product-tags`, {
                params: params,
            });

            return response?.data?.data;
        } catch (exception) {
            inValidToken(exception?.response?.data?.message);
        }
    }

    // returns reactive properties and methods
    return {
        getUserStandardTags,
        getUserLevelThree,
        assignTags,
        removeTags
    }
}