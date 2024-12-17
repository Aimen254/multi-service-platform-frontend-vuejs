import { ref, inject } from "vue";
import { useHelper } from "./helper";
import { useToastr } from "./toastr";
import { useUserStore } from "@stores/user";
import { useTagStore } from '@stores/tags';
import { useMessage } from "./message";

export const useCommentApi = () => {
  const $http = inject("$http");
  const userStore = useUserStore();
  const { confirm, toast } = useToastr();
  const { inValidToken, otpNotVerified, showLoading, hideLoading, } = useHelper();
  const { recordNotFound } = useMessage()
  const errors = ref(null);
  const productComments = ref([]);
  const meta = ref(null);
  const dataNotFound = ref(null);
  const tagStore = useTagStore();

  const comments = async (reference = null, params) => {
    try {
      showLoading(reference);
      const response = await $http.get("api/comments", {
        params: params,
      });
      dataNotFound.value = response.data.data.comments.length == 0 ? recordNotFound() : null
      productComments.value = response.data.data.comments;
      meta.value = response.data.meta;

      hideLoading();
    } catch (exception) {
      hideLoading();
      inValidToken(exception?.response?.data?.message);
    }
  };

  const addComment = async (reference, data, loading = true) => {
    try {
      loading ? showLoading(reference) : null;
      const response = await $http.post("/api/comments", data);
      errors.value = null;
      loading ? hideLoading() : null;
      return response.data;
    } catch (exception) {
      loading ? hideLoading() : null;
      errors.value = exception.response.data.message;
      otpNotVerified(exception.response.status);
      inValidToken(exception?.response?.data?.message);
    }
  };

  const deleteComment = async (reference = null, id) => {
    const result = await confirm("You want to Delete?", "Yes, Delete!");
    if (result.isConfirmed) {
      try {
        showLoading(reference);
        var url = "/api/comments/" + id;
        const response = await $http.delete(url, {
          data: {
            id: id,
            module: tagStore.getLevelOneTagSlug
          },
        });
        hideLoading();
        toast(response.data.message);
        return response.data;
      } catch (exception) {
        hideLoading();
        inValidToken(exception?.response?.data?.message);
      }
    }
  };

  const update = async (reference, data) => {
    try {
      showLoading(reference);
      const response = await $http.put(`/api/comments/${data.id}`, data);
      errors.value = null;
      hideLoading();
      toast(response.data.message);
      return response.data;
    } catch (exception) {
      hideLoading();
      errors.value = exception.response.data.message;
      otpNotVerified(exception.response.status);
      inValidToken(exception?.response?.data?.message);
    }
  }

  return {
    meta,
    errors,
    productComments,
    dataNotFound,
    comments,
    addComment,
    update,
    deleteComment,
  };
};
