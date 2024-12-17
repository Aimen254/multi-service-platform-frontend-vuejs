import { inject, ref } from "vue";
import { useUserStore } from "@/stores/user";
import { useHelper } from "@composables/helper";
import { useToastr } from "@composables/toastr";

export const useResumeApi = () => {
  const userStore = useUserStore();
  const { toast } = useToastr();
  const { showLoading, hideLoading, otpNotVerified, inValidToken, } = useHelper();
  const $http = inject("$http");
  const resume = ref(null);
  const errors = ref({});

  const createResume = async (data, component = null) => {
    try {
      showLoading(component);
      const response = await $http.post("/api/employment/resume", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      hideLoading()
      // Assuming you have reactive variables
      resume.value = response.data.data;
      errors.value = {};
      toast(response.data.message);
      return resume.value;
    } catch (e) {
      hideLoading();
      otpNotVerified(e.response.status);
      errors.value = e.response.data.message;
      inValidToken(e.response.data.message);
    }
  };

  const getResume = async (module, isLoad = true) => {
    try {
      isLoad ? showLoading() : null;
      const response = await $http.get(`/api/${module}/resume`);

      resume.value = response.data.data;
      isLoad ? hideLoading() : null;
      return resume.value;
    } catch (e) {
      isLoad ? hideLoading() : null;
      otpNotVerified(e.response.status);
      inValidToken(e.response.data.message);
    }
  }
  return {
    errors,
    createResume,
    getResume
  };
};
