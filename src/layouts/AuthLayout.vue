<script setup>
import { RouterView, useRoute } from 'vue-router'
import Sidebar from '@components/partials/Sidebar.vue'
import Navbar from '@components/partials/Navbar.vue'
import Footer from '@components/partials/Footer.vue'
import Tags from '@components/general/Tags.vue'
import { useHelper } from '@composables/helper.js'
import { useSettingsApi } from '@/composables/settings.js'
import AdCard from '@components/general/AdCard.vue'
import HorizontalAdCard from '@components/general/HorizontalAdCard.vue'
import { useModuleSettings } from '@composables/modules.js'
import { onMounted, ref, onBeforeMount, inject, watch } from 'vue'
import horizantalAd from '@/assets/images/Ads/horizontalAd.png';
import { useTagStore } from '@stores/tags.js'

const tagStore = useTagStore()
const eventBus = inject('eventBus')
const { paddingTop, itemContainerValidator,excludeModule } = useModuleSettings();
const route = useRoute();
const { isHomePages, isAdPages, isLevelPages } = useHelper();
const { getSettings } = useSettingsApi()
const displayAdBar = ref(false)
const showAdd = ref(true)

function toggleDisplayAdBar() {
  if (window.innerWidth >= 1200) {
    showAdd.value = showAdd.value !== true;
    displayAdBar.value = !displayAdBar.value;
    eventBus.emit('sidebar-collaps', {
      displayAdBar: displayAdBar.value
    });
  }
}

const handleResize = () => {
  showAdd.value = window.innerWidth >= 1200;
}

onBeforeMount(() => {
  const mainSidebarStatus = localStorage.getItem("menu-collapsed");
  displayAdBar.value = mainSidebarStatus !== "true";
  showAdd.value = window.innerWidth >= 1200;
})

onMounted(async () => {
  window.addEventListener('resize', handleResize)
  await getSettings()
})

watch(route, () => {
  const mainSidebarStatus = localStorage.getItem("menu-collapsed");
  displayAdBar.value = mainSidebarStatus !== "true";
})

</script>

<template>
  <div>
    <Navbar id="nav-bar-contatiner" />
    <div class="layout-wrapper layout-content-navbar">
      <div class="layout-container">
        <Sidebar :display-block="showAdd" @toggle-sidebar="toggleDisplayAdBar" />
        <div class="layout-page">
          <div class="content-wrapper">
            <div class="container-fluid flex-grow-1 container-p-y"
              :class="{ 'pe-0': showAdd && (!isHomePages(route.name) || isAdPages(route.name)) }">
              <div class="homePage" v-if="!isHomePages(route.name)">
                <Tags id="tag-container" />
              </div>
              <div class="d-flex">
                <div
                  :class="[(showAdd && route.name !== 'home') && (!isHomePages(route.name) || isAdPages(route.name)) ? 'w-80 padding-right-1-2-5' : 'w-100']">
                  <div
                    v-if="(isLevelPages(route.name) && route.name !== 'level-one-page' && excludeModule('horizontalAdCard')) || (route.name === 'level-one-page' && itemContainerValidator('horizontalAdCard') && excludeModule('horizontalAdCard'))">
                    <!-- !['recipes', 'blogs', 'news'].includes(tagStore.getLevelOneTagSlug) -->
                    <HorizontalAdCard class="card-container slide-fade" :imgsrc="horizantalAd" />
                  </div>
                  <RouterView />

                </div>

                <div
                  :class="{ 'w-20': (showAdd && route.name !== 'home') && (!isHomePages(route.name) || isAdPages(route.name)) }"
                  :style="{ 'padding-top': route.name === 'artical-detail' ? paddingTop : '' }"
                  v-show="(showAdd && route.name !== 'home') && (!isHomePages(route.name) || isAdPages(route.name))">
                  <Transition :duration="550">
                    <AdCard class="card-container slide-fade" v-show="showAdd" style="text-align: center;" />
                  </Transition>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-3">
            <Footer />
          </div>
        </div>
      </div>
      <!-- Overlay -->
      <div class="layout-overlay layout-menu-toggle"></div>
      <!-- Drag Target Area To SlideIn Menu On Small Screens -->
      <div class="drag-target"></div>
    </div>
  </div>
</template>

<style scoped>
/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.ad-bar {
  padding-top: 67px;
}
</style>