import { ref, inject } from "vue";
import { useUserStore } from "@/stores/user";
import { useHelper } from "./helper";

import { useToastr } from "./toastr";
import { useTagStore } from "../stores/tags";

export const useProfileApi = () => {
  const userStore = useUserStore();
  const { inValidToken, otpNotVerified, showLoading, hideLoading, } = useHelper();
  const $http = inject("$http");
  const errors = ref({});
  const publicProfileMediaErrors = ref(null);
  const { toast } = useToastr();
  const tagStore = useTagStore();

  async function changePassword(data) {
    try {
      showLoading();
      const response = await $http.post("/api/change-password", data);
      errors.value = {};
      toast(response.data.message);
      hideLoading();
      return response.data;
    } catch (exception) {
      hideLoading();
      errors.value = exception.response.data.message;
      otpNotVerified(exception.response.status);
      inValidToken(exception?.response?.data?.message);
    }
  }

  const updateProfile = async (data, cardbodyRef) => {
    showLoading();
    try {
      const response = await $http.post("/api/profile-settings", data, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });
      errors.value = {};
      storeUserData(response.data.data);
      hideLoading();
      toast(response.data.message);
      return response.data;
    } catch (exception) {
      hideLoading();
      errors.value = exception.response.data.message;
      inValidToken(exception?.response?.data?.message);
    }
  };

  const getPublicProfile = async (module) => {
    try {
      showLoading();
      const response = await $http.get(`/api/public-profile/${module}`);
      hideLoading();
      errors.value = {};
      return response.data;
    } catch (exception) {
      hideLoading();
      errors.value = exception.response.data.message;
      inValidToken(exception?.response?.data?.message);
    }
  };

  const publicProfileMedia = async (formData, reference) => {
    try {
      showLoading(reference);
      const response = await $http.post("/api/public-profile/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      hideLoading();
      toast(response.data.message);
      publicProfileMediaErrors.value = null;
    } catch (exception) {
      hideLoading();
      otpNotVerified(exception.response.status);
      publicProfileMediaErrors.value = exception.response.data.message;
      inValidToken(exception?.response?.data?.message);
    }
  };

  const createOrUpdatePublicProfile = async (data, reference) => {
    try {
      showLoading(reference);
      const token = userStore.user ? userStore.user.access_token : null;
      const response = await $http.post(
        "/api/public-profile/update-or-store",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      hideLoading();
      errors.value = {};
      toast(response.data.message);
    } catch (exception) {
      hideLoading();
      otpNotVerified(exception.response.status);
      errors.value = exception.response.data.message;
      inValidToken(exception?.response?.data?.message);
    }
  };

  const viewProfile = async (user, module) => {
    try {
      showLoading();
      const response = await $http.get('api/user-profile',
        {
          params: {
            'user_id': user,
            'module_id': module,
            'with_details': true,
            'with_business': tagStore.getLevelOneTagSlug == 'real-estate' ? true : false
          }
        }
      );
      hideLoading();
      errors.value = {};
      return response.data.data;
    } catch (exception) {
      hideLoading();
      errors.value = exception.response.data.message;
      inValidToken(exception?.response?.data?.message);
    }
  }

  function storeUserData(user) {
    userStore.setUser(user);
  }

  return {
    errors,
    publicProfileMediaErrors,
    changePassword,
    updateProfile,
    getPublicProfile,
    publicProfileMedia,
    createOrUpdatePublicProfile,
    viewProfile
  };
};
