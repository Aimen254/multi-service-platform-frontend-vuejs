<script setup>
import { computed, ref } from 'vue';
import { useAuthApi } from '@composables/authentication';
import { useRoute } from 'vue-router';

const { logout } = useAuthApi();
const route = useRoute();

/**
 * check if newspaper delivery address's all
 * routes are active
 */
const isRouteActive = computed(() => {
    let activeTab = false;
    switch (route.name) {
        case 'newspaper.delivery':
        case 'newspaper.delivery.create':
        case 'newspaper.delivery.edit':
            activeTab = true;
            break;
    }
    return activeTab;
});
</script>

<template>
    <div>
        <!-- profile detail -->
        <router-link :to="{ name: 'profile.detail' }" exact active-class="activeTab"
            class="d-flex align-items-center cursor-pointer menu-link">
            <i class='menu-icon tf-icons bx bxs-user'></i>
            <div class="mx-2" data-i18n="Profile Detail">Profile
                Detail
            </div>
        </router-link>
        <hr class="">

        <!-- newspaper delivery -->
        <router-link :to="{ name: 'newspaper.delivery' }" :class="{ 'activeTab': isRouteActive }"
            class="d-flex align-items-center cursor-pointer menu-link">
            <i class='menu-icon tf-icons bx bxs-news'></i>
            <div class="mx-2" data-i18n="Newspaper Delivery">
                Newspaper Delivery</div>
        </router-link>
        <hr class="">

        <!-- change password -->
        <router-link :to="{ name: 'change.password' }" exact active-class="activeTab"
            class="d-flex align-items-center cursor-pointer menu-link">
            <i class='menu-icon tf-icons bx bxs-lock-alt'></i>
            <div class="mx-2" data-i18n="Change Password">Change
                Password</div>
        </router-link>
        <hr class="">

        <!-- logout -->
        <div class="d-flex align-items-center cursor-pointer">
            <i class='menu-icon tf-icons bx bx-log-out'></i>
            <div class="mb-0 mx-2" data-i18n="Logout" @click="logout">Logout</div>
        </div>
        <hr class="my-3">
    </div>
</template>



