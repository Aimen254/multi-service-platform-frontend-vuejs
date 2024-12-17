import { ref, inject } from "vue";
import { useHelper } from "./helper";
import { useTagStore } from "@/stores/tags";
import { useToastr } from "./toastr";
import { useUserStore } from "@stores/user.js";
import { useMessage } from "@composables/message.js";

export const useTagsApi = () => {
  const $http = inject("$http");
  const { showLoading, hideLoading, inValidToken, } = useHelper();
  const tagStore = useTagStore();
  const { toast } = useToastr();
  const userStore = useUserStore();
  const { recordNotFound } = useMessage();
  const meta = ref({});

  const levelOneAuthors = ref([]);
  const levelTwoAuthors = ref([]);
  const levelThreeAuthors = ref([]);

  const dataNotFound = ref(null);

  function resetAuthors() {
    levelOneAuthors.value = [];
    levelTwoAuthors.value = [];
    levelThreeAuthors.value = [];
  }

  // level one tags api
  async function levelOneTags() {
    try {
      const response = await $http.get("api/level/one", {
        params: {
          limit: 50,
        },
      });
      localStorage.setItem("levelOneTags", JSON.stringify(response?.data?.data));
      tagStore.saveLevelOneTags(response?.data?.data);
      return response?.data?.data;
    } catch (exception) {
      inValidToken(exception?.response?.data?.message);
    }
  }

  async function levelTwoTags(module, params, loading = true, component = null
  ) {
    try {
      dataNotFound.value = null;
      resetAuthors();
      loading ? showLoading(component) : "";
      const token = userStore.user ? userStore.user.access_token : null;
      const response = await $http.get(`api/level/two/${module}`, {
        params: {
          ...params,
          module: tagStore.getLevelOneTagId
        },
      });
      loading ? hideLoading(component) : "";
      levelOneAuthors.value = response?.data?.authors ?? [];
      meta.value = response.data.meta ? response.data.meta : {};
      const data = transformeData(response.data.data);
      if (params?.pagination) {
        tagStore.saveLevelTwoTags(data);
      }
      if (params?.type === 'make') {
        tagStore.setPopularMakes(data);
      }
      if (params?.type === 'body_style') {
        tagStore.setBodyStyles(data);
      }
      if (params?.latest) {
        tagStore.saveLatestLevelTwoProducts(data)
      }
      dataNotFound.value = response.data.data.length == 0 ? recordNotFound() : null;
      return data;
    } catch (exception) {
      loading ? hideLoading(component) : "";
      inValidToken(exception?.response?.data?.message);
    }
  }

  async function levelThreeTags(module, levelTwo, params, loading = true, component = null) {
    try {
      meta.value = {}
      resetAuthors();
      loading ? showLoading(component) : ''
      const response = await $http.get(`api/level/three/${module}/${levelTwo}`, {
        params: {
          ...params,
          module: tagStore.getLevelOneTagId
        },
      });
      loading ? hideLoading(component) : ''
      levelTwoAuthors.value = response.data.authors ?? [];
      const data = transformeData(response.data.data)
      meta.value = response.data.meta;
      if (params.productLimit) {
        tagStore.saveLevelThreeTags(data)
      }
      return data
    } catch (exception) {
      loading ? hideLoading(component) : ''
      inValidToken(exception?.response?.data?.message);
    }
  }

  async function levelFourTags(module, levelTwo, levelThree, params, loading = true, component = null
  ) {
    try {
      resetAuthors();
      loading ? showLoading(component) : "";
      const response = await $http.get(
        `api/level/four/${module}/${levelTwo}/${levelThree}`,
        {
          params: {
            ...params,
            module: tagStore.getLevelOneTagId
          },
        }
      );

      loading ? hideLoading(component) : "";
      levelThreeAuthors.value = response?.data?.authors ?? [];
      const data = transformeData(response.data.data);
      meta.value = response.data.meta;
      return data;
    } catch (exception) {
      loading ? hideLoading(component) : "";
      inValidToken(exception?.response?.data?.message);
    }
  }

  function transformeData(data) {
    const transformedData = data.map((item) => {
      return {
        ...item,
        text: item?.name,
      };
    });
    return transformedData;
  }

  return {
    levelOneTags,
    levelTwoTags,
    levelThreeTags,
    levelFourTags,
    levelTwoAuthors,
    levelThreeAuthors,
    meta,
    dataNotFound,
    levelOneAuthors,
    levelTwoAuthors,
    levelThreeAuthors
  };
};
