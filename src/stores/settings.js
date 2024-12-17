import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useTagStore } from '@stores/tags';

export const useSettingsStore = defineStore("settings", () => {
  const tagStore = useTagStore();
  const settings = ref({});
  const banner = ref({});

  function saveSettings(data) {
    settings.value = data;
    banner.value = data;
  }

  const getSettings = computed(() => {
    return settings.value;
  });
  const bannerDimensions = computed(() => {
    const mediaSizes = settings.value.data?.mediaSizes?.banner;
    if (mediaSizes?.width && mediaSizes?.height) {
      return `${mediaSizes.width} x ${mediaSizes.height}`;
    }
  });

  const productDimensions = computed(() => {
    let mediaSizes = null
    switch (tagStore.getLevelOneTagSlug) {
      case 'news':
        mediaSizes = settings.value.data?.mediaSizes?.news;
        break;
      case 'recipes':
        mediaSizes = settings.value.data?.recipesMedia?.recipes
        break;
      case 'blogs':
        mediaSizes = settings.value.data?.blogsMedia?.blog
        break;
      case 'employment':
        mediaSizes = settings.value.data?.employmentMedia?.posts
        break;
      case 'services':
        mediaSizes = settings.value.data?.mediaSizes?.services
        break;
      case 'obituaries':
        mediaSizes = settings.value.data?.obituariesMedia?.obituaries
        break;
      case 'automotive':
        mediaSizes = settings.value.data?.automotiveMedia?.vehicle
        break;
      case 'notices':
        mediaSizes = settings.value.data?.noticesMedia?.notice
        break;
      case 'boats':
        mediaSizes = settings.value.data?.boatsMedia?.boat;
        break;
      case 'government':
        mediaSizes = settings.value.data?.governmentMedia?.posts;
        break;
      case 'marketplace':
        mediaSizes = settings.value.data?.classifiedsMedia?.classified
        break;
      case 'taskers':
        mediaSizes = settings.value.data?.taskersMedia?.tasker;
        case 'real-estate':
          mediaSizes = settings.value.data?.RealEstateMedia?.property;
       case 'events':
            mediaSizes = settings.value.data?.eventsMedia?.events;
        break;
    }
    if (mediaSizes?.width && mediaSizes?.height) {
      return `${mediaSizes.width} x ${mediaSizes.height}`;
    }
  });

  const businessMediaDimensions = computed(() => {
    return settings.value.data?.mediaSizes
  })

  const publicProfileAvatar = computed(() => {
    const mediaSizes = settings.value.data?.mediaSizes?.public_profile.avatar;
    if (mediaSizes?.width && mediaSizes?.height) {
      return `${mediaSizes.width} x ${mediaSizes.height}`;
    }
  });

  const publicProfileBanner = computed(() => {
    const mediaSizes = settings.value.data?.mediaSizes?.public_profile.banner;
    if (mediaSizes?.width && mediaSizes?.height) {
      return `${mediaSizes.width} x ${mediaSizes.height}`;
    }
  });

  const avatarDimensions = computed(() => {
    const mediaSizes = settings.value.data?.mediaSizes?.avatar;
    if (mediaSizes?.width && mediaSizes?.height) {
      return `${mediaSizes.width} x ${mediaSizes.height}`;
    }
  });

  const status = computed(() => {
    return settings.value.data

  });



  return {
    saveSettings,
    getSettings,
    bannerDimensions,
    productDimensions,
    avatarDimensions,
    publicProfileAvatar,
    publicProfileBanner,
    status,
    businessMediaDimensions
  };
});
