import { ref, inject, onMounted, onBeforeMount } from "vue";
import { useHelper } from "./helper";
import { useToastr } from "./toastr";
import { useUserStore } from "@stores/user";
import { useProductsStore } from "@stores/products";
import { useHeadlinesStore } from '@stores/headlines.js'
import { useRouter, useRoute } from "vue-router";
import { useMessage } from "./message";
import { useTagStore } from '@stores/tags'
import { useModuleSettings } from '@composables/modules.js'

export const useProductApi = () => {
  const $http = inject("$http");
  const router = useRouter();
  const route = useRoute()
  const { inValidToken, otpNotVerified, showLoading, hideLoading, } = useHelper();
  const { confirm, toast } = useToastr();
  const userStore = useUserStore();
  const productStore = useProductsStore()
  const headlineStore = useHeadlinesStore()
  const { recordNotFound } = useMessage()
  const meta = ref({});
  const products = ref([]);
  const errors = ref(null);
  const allproductTags = ref([]);
  const arrFiltered = ref([]);
  const allIgnoredAutocomplete = ref([]);
  const autocompleteItems = ref([]);
  const filteredAllTags = ref([]);
  const extraTags = ref([]);
  const brandTags = ref([]);
  const allproductBrandTags = ref([]);
  const productIgnoredTag = ref([]);
  const clientIP = ref(null);
  const dataNotFound = ref(null)
  const attributeTags = ref([]);
  const bodyStyles = ref([]);
  const productBodyStyle = ref([]);
  const tagStore = useTagStore()
  const eventBus = inject('eventBus')

  const { itemContainerValidator } = useModuleSettings()

  // to get the list of products
  // 3rd param is to disable the loader functionality
  async function getProducts(module, params, disableLoader = null, component = null) {
    try {
      dataNotFound.value = null
      disableLoader ?? showLoading(component)
      const response = await $http.get(`api/${module}/products`, {
        params: params
      })
      products.value = response.data.data
      if (params.today_created) {
        productStore.saveTodayProducts(products.value)
      } else if (params.favorite_users) {
        productStore.saveFavoriteReporterProducts(products.value)
      }

      else if (params.is_featured && !itemContainerValidator.value('featuredProductsByType')) {
        productStore.saveFeaturedProducts(products.value)
      } else if (params.popular_product) {
        productStore.savePopularProducts(products.value)
      } else if (params?.type && params?.type == 'secondary') {
        headlineStore.saveSecondaryHeadLine(response?.data?.data)
      } else if (params.latest) {
        productStore.saveLatestProducts(products.value)
      } else if (params.recently_viewed) {
        productStore.saveRecentlyViewedProducts(products.value)
      } else if (params.weekly_products) {
        productStore.saveWeeklyProducts(products.value)
      } else if (itemContainerValidator.value('featuredProductsByType')) {
        if (params.type === 'for-sale') {
          productStore.saveFeaturedProductsForSale(products.value)
        } else {
          productStore.saveFeaturedProductsForRent(products.value)
        }
      }


      meta.value = response.data.meta;
      disableLoader ?? hideLoading()
      dataNotFound.value = response.data.data.length == 0 ? recordNotFound() : null
      return products.value
    } catch (exception) {
      disableLoader ?? hideLoading()
      inValidToken(exception?.response?.data?.message);
    }
  }

  // add product
  const addProduct = async (module, params, nextRoute = null) => {
    try {
      showLoading();
      const response = await $http.post(`/api/${module}/products`, params, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });
      hideLoading();
      toast(response.data.message);
      router.push({ name: nextRoute, params: { uuid: response?.data?.product.uuid } });

    } catch (exception) {
      hideLoading();
      errors.value = exception?.response?.data?.message
        ? exception?.response?.data?.message
        : "An Error Occured";
      otpNotVerified(exception?.response?.status);
      inValidToken(exception?.response?.data?.message);
    }
  }

  // edit product
  const editProduct = async (module, productuuid, isLoad = true, parameters = null) => {
    try {
      isLoad ? showLoading() : '';
      if (route.name == 'artical-detail') {
        await clientIPAddress()
      }
      var params = {
        edit: true,
        user_id: userStore.user.id,
        ip_address: clientIP.value,
        module_id: tagStore.getLevelOneTagId,
        disableStatusFilter: true
      }
      if (parameters) {
        params = { ...parameters, ...params };
      }
      const response = await $http.get(
        `/api/${module}/products/${productuuid}`, {
        params: params
      }
      );
      isLoad ? hideLoading() : '';
      attributeTags.value = response.data.assignedStandardTags;
      bodyStyles.value = response.data.bodyStyles ? response.data.bodyStyles : [];
      productBodyStyle.value = response.data.productBodyStyle ? response.data.productBodyStyle : [];
      return response.data.data;
    } catch (exception) {
      isLoad ? hideLoading() : '';
      exception.response?.data?.status === 404 ? router.push({ name: 'not-found' }) : null;
      inValidToken(exception?.response?.data?.message);
    }
  }

  const updateProduct = async (module, productuuid, formData, nextRoute = null) => {
    try {
      showLoading();
      const token = userStore.user ? userStore.user.access_token : null;
      const response = await $http.post(
        `/api/${module}/products/${productuuid}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      hideLoading();
      toast(response.data.message);
      errors.value = null;

      router.push({ name: nextRoute, params: { uuid: productuuid } });

      return response.data;
    } catch (exception) {
      hideLoading();
      otpNotVerified(exception.response.status);
      errors.value = exception.response.data.message;
      inValidToken(exception?.response?.data?.message);
    }
  };

  // update product's main image
  const updateProductMainImage = async (formData, module, productuuid, image_id = null) => {
    try {
      showLoading();
      const token = userStore?.user?.access_token ?? null;
      const response = await $http.post(
        `/api/${module}/products/main-image/${productuuid}/${image_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      hideLoading();

      toast(response.data.message);
      errors.value = null;
      return response.data;
    } catch (exception) {
      hideLoading();
      otpNotVerified(exception.response.status);
      errors.value = exception.response.data.message;
      inValidToken(exception?.response?.data?.message);
    }
  }

  // delete product
  const deleteProduct = async (module, uuid, params) => {
    try {
      const result = await confirm("Do you want to delete?", "Yes, Delete!");

      if (result.isConfirmed) {
        showLoading();
        const response = await $http.delete(`/api/${module}/products/${uuid}`);
        hideLoading();
        await getProducts(module, params);
        toast(response.data.message);
      }
    } catch (exception) {
      hideLoading();
      inValidToken(exception?.response?.data?.message);
    }
  };

  // delete product's secondary images
  const deleteProductMedia = async (module, uuid, id) => {
    try {
      const result = await confirm("Do you want to delete?", "Yes, Delete!");

      if (result.isConfirmed) {
        const response = await $http.delete(`/api/${module}/product-media-delete/${uuid}/${id}`);
        toast(response.data.message);
        return { id: id };
      }
    } catch (exception) {
      otpNotVerified(exception.response.status);
      errors.value = exception.response.data.message;
      inValidToken(exception?.response?.data?.message);
    }
  }

  // product tags [extra tags, ignored tags, filtered tags, brand tags]
  const getProductTag = async (uuid, loading = true) => {
    try {
      filteredAllTags.value = []
      loading ? showLoading() : '';
      var uniq = {}
      const response = await $http.get(`api/tags/${uuid}`);
      response.data.allTags.filter(tag => {
        tag.priority == "4" ? filteredAllTags.value.push(tag) : null
      });

      arrFiltered.value = (response?.data?.allproductTags).filter(obj => !uniq[obj.text.toLowerCase()] && (uniq[obj.text.toLowerCase()] = true));
      extraTags.value = response?.data?.extraTags;
      allIgnoredAutocomplete.value = response?.data?.allIgnoredAutocomplete;
      productIgnoredTag.value = response?.data?.productIgnoredTags;
      allproductBrandTags.value = response?.data?.allproductBrandTags;
      brandTags.value = response?.data?.allBrandTags
      loading ? hideLoading() : '';
    } catch (exception) {
      loading ? hideLoading() : '';
      inValidToken(exception?.response?.data?.message);
    }
  };

  const assignTags = async (module, productuuid, formData, route) => {
    try {
      showLoading();
      const token = userStore.user ? userStore.user.access_token : null;
      const response = await $http.post(
        `/api/${module}/tags/${productuuid}/assign`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      hideLoading();
      await getProductTag(productuuid, true);
      toast(response.data.message);
      router.push({ name: route && route == 'articles.tags' ? 'articles' : 'garage.index' });
      errors.value = null;
      return response;
    } catch (exception) {
      hideLoading();
      otpNotVerified(exception.response.status);
      errors.value = exception.response.data.message;
      inValidToken(exception?.response?.data?.message);
    }
  };



  // relatedItems
  async function relatedItems(params) {
    try {
      showLoading();
      const response = await $http.post(`api/related-items`, params)
      hideLoading()
      return response.data.data
    } catch (exception) {
      hideLoading()
      inValidToken(exception?.response?.data?.message);
    }
  }

  // ClientIP
  const clientIPAddress = async () => {
    await fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        clientIP.value = data.ip
        return data.ip
      })
      .catch(error => {
        console.error('Error getting IP address: ' + error);
      });
  }

  //headlines
  const headlineProducts = async (module, params = null, isLoad = true) => {
    try {
      isLoad ? showLoading() : '';
      const response = await $http.get(`api/${module}/headlines`, {
        params: params
      })
      headlineStore.savePrimaryHeadline(response?.data?.primary_headline)
      headlineStore.saveSecondaryHeadLine(response?.data?.secondary_headline)
      isLoad ? hideLoading() : ''
    } catch (exception) {
      isLoad ? hideLoading() : ''
      inValidToken(exception?.response?.data?.message);
    }
  }

  const transformStatus = (status) => {
    return status === 'active' ? true : false;
  }

  const updateStatus = async (module, uuid, data = null) => {
    try {
      const result = await confirm("Do you want to change status?", "Yes, Change!")

      if (result.isConfirmed) {
        const response = await $http.patch(`api/${module}/product/change-status/${uuid}`, data);
        toast(response.data.message);
        if (data?.status == 'sold') {
          eventBus.emit('sold-products');
        }
        const checkbox = e.target;
        checkbox.checked = !checkbox.checked;
      }
    } catch (exception) {
      inValidToken(exception?.response?.data?.message);
    }
  }

  return {
    meta,
    errors,
    products,
    getProducts,
    addProduct,
    editProduct,
    updateProduct,
    updateProductMainImage,
    deleteProduct,
    deleteProductMedia,
    getProductTag,
    assignTags,
    relatedItems,
    headlineProducts,
    updateStatus,
    transformStatus,
    filteredAllTags,
    extraTags,
    arrFiltered,
    autocompleteItems,
    allIgnoredAutocomplete,
    productIgnoredTag,
    allproductBrandTags,
    brandTags,
    dataNotFound,
    attributeTags,
    bodyStyles,
    productBodyStyle
  };
};