<script setup>
import { useHelper } from '@composables/helper.js'
import NewspaperImage from '../../assets/images/logos/newspaper.png'

import { computed } from 'vue'
// user store
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

// level one tags store
import { useTagStore } from '@/stores/tags'
const tagStore = useTagStore()

import { useModuleSettings } from '@composables/modules';
const { getApectRatio } = useModuleSettings()

// helpers
const { toggleMenu, getImage } = useHelper();

const collpasMenu = () => {
    localStorage.setItem('menu-collapsed', 'true');
    document.documentElement.classList.add('layout-menu-collapsed');
}

const homePage = () => {
    tagStore.removeLevelOneTag()
    tagStore.removeLevelTwoTag()
    tagStore.removeLevelThreeTag()
    tagStore.removeLevelFourTag()

    // remove owner
    userStore.removeOwner()
}
const user = computed(() => {
    return userStore.user
})
</script>

<template>
    <nav class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
        id="layout-navbar">
        <div class="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-md-block d-xl-none">
            <a class="nav-item nav-link px-0 me-xl-4" href="javascript:void(0)" @click="toggleMenu()">
                <i class="bx bx-menu bx-sm"></i>
            </a>
        </div>


        <div class="navbar-nav-right d-flex align-items-center justify-content-between" id="navbar-collapse">
            <!-- Logo -->
            <router-link :to="{ name: 'home' }" @click="homePage()">
                <img :src="NewspaperImage" alt="" class="newspaper-logo mx-2">
            </router-link>
            <!-- Search -->
            <div class="col-md-5 search col-sm-6 ">
                <div class="input-group  input-group-merge">
                    <span class="input-group-text" id="basic-addon-search31"><i class="bx bx-search"></i></span>
                    <input class="form-control" type="text" placeholder="Search here" aria-label="Search..."
                        aria-describedby="basic-addon-search31" />
                </div>
            </div>
            <div class="navbar-nav align-items-center">
                <div class="nav-item navbar-search-wrapper mb-0 mx-auto">
                    <div class="input-group">
                        <select class="form-select" id="inputGroupSelect01">
                            <option value="1" selected>Entire site</option>
                            <option value="2">With in module</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- /Search -->

            <ul class="navbar-nav flex-row align-items-center ms-auto">
                <!-- User -->
                <li class="nav-item navbar-dropdown dropdown-user dropdown">
                    <router-link class="nav-link dropdown-toggle hide-arrow" @click="collpasMenu"
                        :to="{ name: 'profile.detail' }">
                        <div class="avatar avatar-online" v-if="user">
                            <img :src="getImage(user.avatar)" alt="" :style="{ 'aspect-ratio': getApectRatio('logo') }"
                                class="w-px-40 w-100 rounded-circle" />
                        </div>
                    </router-link>
                </li>
                <!--/ User -->
            </ul>
        </div>

        <!-- Search Small Screens -->
        <div class="navbar-search-wrapper search-input-wrapper d-none">
            <input type="text" class="form-control search-input container-xxl border-0" placeholder="Search here"
                aria-label="Search..." />
            <i class="bx bx-x bx-sm search-toggler cursor-pointer"></i>
        </div>
    </nav>
</template>

<style scoped>
@media (min-width: 768px) {
    .search {
        margin-left: 46px;
    }
}

@media (min-width: 1024px) {
    .search {
        margin-left: 123px;
    }
}
</style>
