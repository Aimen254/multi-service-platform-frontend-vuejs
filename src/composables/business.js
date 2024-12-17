import { ref, inject, onMounted, onBeforeMount } from "vue";
import { useBusinessStore } from "@stores/business";
import { useHelper } from "./helper";
import { useToastr } from "./toastr";
import { useUserStore } from "@stores/user";
import { useRouter } from "vue-router";
import { useMessage } from "./message";

export const useBusinessApi = () => {
  const $http = inject("$http");
  const router = useRouter();
  const { inValidToken, otpNotVerified, showLoading, hideLoading, } = useHelper();
  const { confirm, toast } = useToastr();
  const userStore = useUserStore();
  const { recordNotFound } = useMessage();
  const meta = ref({});
  const businesses = ref([]);
  const errors = ref(null);
  const dataNotFound = ref(null);
  const businessStore = useBusinessStore();

  const eventBus = inject('eventBus');

  async function getBusinesses(module, params, isLoad = true, component = null
  ) {
    try {
      dataNotFound.value = null;
      isLoad ? showLoading() : '';
      const response = await $http.get(`api/${module}/businesses`, {
        params: params,
      });
      businesses.value = response.data.data;
      if (params.is_featured) {
        businessStore.saveFeaturedBusiness(businesses.value);
      }
      meta.value = response.data.meta;
      dataNotFound.value =
        response.data.data.length == 0 ? recordNotFound() : null;
      isLoad ? hideLoading() : "";
      return businesses.value;
    } catch (e) {
      isLoad ? hideLoading() : "";
      toast(e?.response?.data?.message);
      inValidToken(e?.response?.data?.message);
    }
  }

  async function viewBusiness(module, uuid, params = null, isLoad = true, component = null
  ) {
    try {
      isLoad ? showLoading() : "";
      const response = await $http.get(`api/${module}/businesses/${uuid}`, {
        params: params,
      });
      isLoad ? hideLoading() : "";
      businessStore.saveBusinessDetail(response?.data?.data)
      return response?.data?.data;
    } catch (e) {
      isLoad ? hideLoading() : "";
      toast(e?.response?.data?.message);
      inValidToken(e?.response?.data?.message);
    }
  }

  const createBusiness = async (data, module, component = null) => {
    try {
      showLoading(component);
      const response = await $http.post(`/api/${module}/businesses`, data, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });
      toast(response.data.message);
      errors.value = null;
      hideLoading();
      eventBus.emit('check-businesses')
      router.push({ name: 'companies' })
      return response.data;
    } catch (e) {
      hideLoading();
      otpNotVerified(e?.response?.status);
      errors.value = e?.response?.data?.message;
      inValidToken(e?.response?.data?.message);
    }
  }

  async function deleteBusiness(module, uuid, params) {
    try {
      const result = await confirm("Do you want to delete?", "Yes, Delete!");

      if (result.isConfirmed) {
        showLoading();
        const response = await $http.delete(`/api/${module}/businesses/${uuid}`);
        hideLoading();
        eventBus.emit('check-businesses')
        await getBusinesses(module, params);
        toast(response.data.message);
      }
    } catch (exception) {
      hideLoading();
      inValidToken(exception?.response?.data?.message);
    }
  };

  const updateBusiness = async (data, module, uuid, component = null, isLoad = false) => {
    {
      try {
        isLoad ? showLoading(component) : "";
        const response = await $http.post(`api/${module}/businesses/${uuid}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast(response.data.message);
        isLoad ? hideLoading() : "";
        router.push({ name: 'companies' })
        return response?.data?.data;
      } catch (e) {
        isLoad ? hideLoading() : "";
        errors.value = e?.response?.data?.message;
        inValidToken(e?.response?.data?.message);
      }
    }
  }

  async function changeStatus(module, id) {
    try {
      const result = await confirm("Do you want to change status?", "Yes, Change!");
      if (result.isConfirmed) {
        showLoading();
        const response = await $http.get(`/api/${module}/business/change/status/${id}`);
        hideLoading();
        if (response.data.status == 'danger') {
          toast(response.data.message, 'error');
        } else {
            toast(response.data.message,'success');
        }
        eventBus.emit('check-businesses')
        return response.data?.data
      }
    }
    catch (e) {
      hideLoading();
      inValidToken(e?.response?.data?.message);
    }
  }

  return {
    meta,
    errors,
    dataNotFound,
    getBusinesses,
    viewBusiness,
    businesses,
    createBusiness,
    updateBusiness,
    deleteBusiness,
    changeStatus
  };
};
