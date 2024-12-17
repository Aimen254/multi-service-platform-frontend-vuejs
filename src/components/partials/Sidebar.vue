
<script setup>
import { ref, computed, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useHelper } from '@composables/helper.js'
import { useTagStore } from '@stores/tags'
import IconLocalVerse from '../icons/IconLocalVerse.vue'
import SidebarLogo from '@/assets/images/logos/localverse_long.png'
import { useUserStore } from '@stores/user';
import { useModuleSettings } from '@composables/modules.js'

const userStore = useUserStore()
const { itemContainerValidator, modulesIcon } = useModuleSettings()

const route = useRoute();
const { toggleMenu, isAdminActive, isHomePages } = useHelper();
// level one tags store
const tagStore = useTagStore();
const emit = defineEmits();

const levelOne = ref(route.params?.levelOneslug ? route.params?.levelOneslug : tagStore.getLevelOneTagSlug ? tagStore.getLevelOneTagSlug : null)

// properties
const props = defineProps({
  menuItem: {
    type: Object,
    displayBlock: Boolean,
    default: { "label": "News", "icon": "bx bxs-news", "url": "javascript:void(0);" }
  }
});

// data properties
const displayBlock = ref(false);
const hasLayoutCollapsed = ref(false);

// helpers

//tags computed property
const tags = computed(() => {
  if (levelOne.value) {
    return tagStore.levelOneTags.filter(tag => tag.slug == levelOne.value);
  } else {
    return tagStore.levelOneTags
  }
});

const isHomePage = computed(() => route.name != "home");

// methods
const isHovered = () => {
  checkLayoutHasCollapsedClass();
  if (hasLayoutCollapsed.value) {
    document.documentElement.classList.add('layout-menu-hover');
    displayBlock.value = true;
  }
}

const isOut = () => {
  document.documentElement.classList.remove('layout-menu-hover');
  displayBlock.value = false;
}

const checkLayoutHasCollapsedClass = () => {
  const element = document.querySelector('html');
  hasLayoutCollapsed.value = element?.classList.contains('layout-menu-collapsed');
}

const isSmallScreen = () => {
  return window.innerWidth <= 1024; 
}
const toggleSideBar = () => {
  if (!isHomePages(route.name) || route.name === 'artical-detail') {
    emit('toggle-sidebar');
    toggleMenu()
    if(isSmallScreen()){
      displayBlock.value = false;
    }
  }
}

const homePage = () => {
  tagStore.removeLevelOneTag()
  tagStore.removeLevelTwoTag()
  tagStore.removeLevelThreeTag()
  tagStore.removeLevelFourTag()

}

const removeOwner = () => {
  // remove user
  userStore.removeOwner()
}

const setLevelOneTag = (tag) => {

  const levelOneTagId = tag.id
  const levelOneTagSlug = tag.slug
  tagStore.saveLevelOneTag({ levelOneTagId, levelOneTagSlug })
  tagStore.removeLevelTwoTag()
  tagStore.removeLevelThreeTag()
  tagStore.removeLevelFourTag()

  // remove owner
  userStore.removeOwner()
}
const collpasMenu = () => {
  localStorage.setItem('menu-collapsed', 'true');
  document.documentElement.classList.add('layout-menu-collapsed');
}

watch(
  async () => route.params,
  async (newParams, oldParams) => {
    if (route?.name == 'home') {
      tagStore.removeLevelOneTag()
    }
    levelOne.value = route.params?.levelOneslug ? route.params?.levelOneslug : tagStore.getLevelOneTagSlug
  })

</script>

<template>
  <aside id="layout-menu" class="sidebar layout-menu menu-vertical menu bg-menu-theme" @mouseover="isHovered"
    @mouseleave="isOut">
    <div class="app-brand demo">
      <router-link :to="{ name: 'home' }" class="app-brand-link" @click="homePage(); removeOwner()">
        <span class="app-brand-logo demo">
          <IconLocalVerse />
        </span>
        <img :src="SidebarLogo" alt="" class="app-brand-text demo menu-text fw-bold ms-2 logo" />
      </router-link>
      <a @click="toggleSideBar()" class="layout-menu-toggle menu-link text-large ms-auto cursor-pointer"
        :class="{ 'd-block': displayBlock }">
        <i class="bx bx-chevron-left bx-sm align-middle"></i>
      </a>
    </div>

    <div class="menu-inner-shadow"></div>
    <perfect-scrollbar>
      <ul class="menu-inner py-1">
        <li class="menu-item" :class="route.name == 'home' ? 'active' : ''">
          <router-link :to="{ name: 'home' }" class="menu-link" @click="homePage(); removeOwner()">
            <i class="menu-icon tf-icons bx bxs-news"></i>
            <div class="text-truncate" data-i18n="myLV">myLV</div>
          </router-link>
        </li>
        <li class="menu-item" v-for="module in tags" :key="module"
          :class="route.params?.levelOneslug && module.slug == route.params?.levelOneslug && route.name !== 'my.categories' && route.name !== 'bookmarks' && route.name !== 'events-calendar' && !isAdminActive(route.name) ? 'active' : ''">
          <router-link :to="{ name: 'level-one-page', params: { levelOneslug: module.slug } }"
            @click="setLevelOneTag(module)" class="menu-link">
            <i class="menu-icon tf-icons" :class="modulesIcon(module.slug)"></i>
            <div class="text-truncate text-capitalize" data-i18n="News">{{ module.name }}</div>
          </router-link>
        </li>

        <li v-if="isHomePage && levelOne && itemContainerValidator('yourEvents')" @click="removeOwner()" class="menu-item"
          :class="route.name === 'events-calendar' ? 'active' : ''">
          <router-link :to="{ name: 'events-calendar', params: { levelOneslug: levelOne } }" class="menu-link">
            <i class="menu-icon tf-icons bx bx-calendar-event"></i>
            <div class="text-truncate" data-i18n="Calendar">Calendar</div>
          </router-link>
        </li>
        <li class="menu-item" v-if="isHomePage">
          <a href="#" class="menu-link">
            <i class="menu-icon tf-icons bx bx-arrow-back"></i>
            <div class="text-truncate" data-i18n="Back">Back</div>
          </a>
        </li>
        <li class="menu-item" v-if="isHomePage && levelOne" @click="removeOwner()"
          :class="route.name === 'bookmarks' ? 'active' : ''">
          <router-link :to="{ name: 'bookmarks', params: { levelOneslug: levelOne } }" class="menu-link">
            <i class="menu-icon tf-icons bx bxs-bookmark"></i>
            <div class="text-truncate" data-i18n="Bookmarked">Bookmarked</div>
          </router-link>
        </li>
        <li class="menu-item" v-if="isHomePage && levelOne && itemContainerValidator('sideBarCategories')"
          @click="removeOwner()" :class="route.name === 'my.categories' ? 'active' : ''">
          <router-link :to="{ name: 'my.categories', params: { levelOneslug: levelOne } }" class="menu-link">
            <i class="menu-icon tf-icons bx bx-list-ul"></i>
            <div class="text-truncate" data-i18n="My Categories">My Categories</div>
          </router-link>
        </li>
        <li v-if="isHomePage && levelOne" @click="removeOwner(); collpasMenu()" class="menu-item"
          :class="isAdminActive(route.name) ? 'active' : ''">
          <router-link :to="{ name: 'dashboard-bookmarked', params: { levelOneslug: levelOne } }" class="menu-link">
            <i class="menu-icon tf-icons bx bxs-check-shield"></i>
            <div class="text-truncate" data-i18n="Admin Panel">Admin Panel</div>
          </router-link>
        </li>
      </ul>
    </perfect-scrollbar>
  </aside>
</template>

<style scoped>
.app-brand .layout-menu-toggle i {
  line-height: 1.05 !important;
}
</style>