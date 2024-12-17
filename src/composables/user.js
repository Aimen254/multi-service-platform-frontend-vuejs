import { inject, ref } from "vue"
import { useHelper } from "./helper"
import { useToastr } from "./toastr"
import { useUserStore } from "@stores/user"
import { useMessage } from "./message";
import { useRouter, useRoute } from "vue-router";


export const useUser = () => {

  const { inValidToken, otpNotVerified, showLoading, hideLoading, } = useHelper();
  const userStore = useUserStore();
  const { confirm, toast } = useToastr();
  const { recordNotFound } = useMessage()

  const $http = inject('$http');
  const errors = ref('');
  const users = ref([]);
  const meta = ref({});
  const userProducts = ref([]);
  const dataNotFound = ref(null)
  const router = useRouter();
  const route = useRoute()

  const token = userStore?.user?.access_token;

  // get users on role based
  const userList = async (params) => {
    try {
      showLoading();
      dataNotFound.value = null
      const response = await $http.get('/api/users/', {
        params: params,
      });
      hideLoading();
      users.value = response?.data?.data;
      storeUsers(response?.data?.data);
      meta.value = response?.data?.meta;
      dataNotFound.value = response.data.data.length == 0 ? recordNotFound() : null
    } catch (exception) {
      hideLoading();
      errors.value = exception;
      inValidToken(exception?.response?.data?.message);
    }
  }

  // store user
  const storeUser = async (params, component = null) => {
    try {
      showLoading(component);

      const response = await $http.post(`/api/users/store`, params, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });
      hideLoading();
      toast(response.data.message);

      // Redirect to "users.index" route after successful user creation
      router.push({
        name: "users.index",
      });

    } catch (exception) {
      hideLoading();
      errors.value = exception?.response?.data?.errors;
      otpNotVerified(exception?.response?.status);
      inValidToken(exception?.response?.data?.message);
      return exception?.response;
    }
  };


  // get user against id
  const getUser = async (params, userId) => {
    try {
      showLoading();
      const response = await $http.get(`/api/users/${userId}/edit`, {
        params: params
      });
      let user = response.data.data;
      hideLoading();
      return user;
    } catch (exception) {
      hideLoading();
      errors.value = exception?.response?.data?.errors;
      otpNotVerified(exception?.response?.status);
      inValidToken(exception?.response?.data?.message);
    }
  }

  // update user against id
  const updateUser = async (params, userId, component = null) => {
    try {
      showLoading(component);
      const response = await $http.post(`/api/users/update/${userId}`, params, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });
      hideLoading();
      router.push({
        name: "users.index",
      });
      toast(response.data.message);
    } catch (exception) {
      hideLoading();
      errors.value = exception?.response?.data?.errors;
      otpNotVerified(exception?.response?.status);
      inValidToken(exception?.response?.data?.message);
      return exception?.response;


    }
  }

  const updateUserStatus = async (params, userId) => {
    try {
      showLoading();
      const response = await $http.patch(`/api/users/${userId}/status-update/`, params);
      hideLoading();
      toast(response?.data?.message);
      return response?.data?.data;
    } catch (exception) {
      hideLoading();
      errors.value = exception?.response?.data?.message;
      otpNotVerified(exception?.response?.status);
      inValidToken(exception?.response?.data?.message);
    }
  }

  // delete user against id
  const deleteUser = async (params, userId) => {
    try {
      const result = await confirm("Do you want to delete?", "Yes, Delete!");

      if (result.isConfirmed) {
        showLoading();
        const response = await $http.delete(`/api/users/${userId}/destroy`, {
          params: params
        });
        hideLoading();
        await userList(params);
        toast(response.data.message);
      }
    } catch (exception) {
      hideLoading();
      errors.value = exception?.response?.data?.message;
      otpNotVerified(exception?.response?.status);
      inValidToken(exception?.response?.data?.message);
    }
  }

  // get specific user products
  const productsByUser = async (module, params) => {
    try {
      showLoading();
      dataNotFound.value = null
      const response = await $http.get(`/api/${module}/products`, {
        params: params,
      });
      hideLoading();
      userProducts.value = response?.data?.data;
      meta.value = response?.data?.meta;
      dataNotFound.value = response.data.data.length == 0 ? recordNotFound() : null
    } catch (exception) {
      hideLoading();
      inValidToken(exception?.response?.data?.message);
    }
  }

  const storeUsers = (data) => {
    userStore.setUsers(data)
  }

  return {
    userList,
    storeUser,
    getUser,
    updateUser,
    updateUserStatus,
    deleteUser,
    productsByUser,
    errors,
    users,
    meta,
    userProducts,
    dataNotFound
  }
}