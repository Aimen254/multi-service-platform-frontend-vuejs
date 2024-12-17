import { ref, inject } from "vue";
import { useTagStore } from "../stores/tags";
import { useUserStore } from "../stores/user";
import { useHelper } from "./helper";
import { useToastr } from "./toastr";

export const useBookmarks = () => {
  const userStore = useUserStore();
  const tagStore = useTagStore();
  const $http = inject("$http");
  const { toast } = useToastr();
  const { showLoading, hideLoading, inValidToken, otpNotVerified, } = useHelper();

  const errors = ref("");
  const bookmarkProducts = ref([]);
  const meta = ref({});
  const limits = ref(10);
  const search = ref("");

  const getBookmarkItems = async (limit, searchValue = "", page = 1) => {
    const module = tagStore.getLevelOneTagId ? tagStore.getLevelOneTagId : null;
    limits.value = limit;
    search.value = searchValue;

    let config = {
      params: {
        limit: limits.value,
        page: page,
        keyword: search.value,
        type: "product",
        module: module,
      },
    };

    try {
      showLoading();
      const response = await $http.get("/api/wishlist", config);
      hideLoading();
      bookmarkProducts.value = response.data.data;
      meta.value = response.data.meta;
      return bookmarkProducts.value;
    } catch (exception) {
      hideLoading();
      otpNotVerified(exception?.response?.status);
      errors.value = exception;
      inValidToken(exception?.response?.data?.message);
    }
  };

  const addOrRemoveItemToBookmarks = async (id) => {
    try {
      showLoading()
      const response = await $http.post(
        "api/wishlist",
        {
          product_id: id,
          type: "product",
        },
        config
      );
      hideLoading();
      await getBookmarkItems(limits.value, search.value);
      toast(response.data.message);
    } catch (exception) {
      if (exception?.response) {
        otpNotVerified(exception?.response?.status);
        errors.value = exception;
        inValidToken(exception?.response?.data?.message);
      }
    }
  };

  return {
    bookmarkProducts,
    meta,
    getBookmarkItems,
    addOrRemoveItemToBookmarks,
  };
};
