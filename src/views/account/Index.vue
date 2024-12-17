<script setup>
import { ref, onMounted, onUpdated, computed } from 'vue'
import { RouterView } from 'vue-router';
import InnerSidebar from '@components/general/InnerSidebar.vue';

// import helper
import { useHelper } from '@/composables/helper';
// image helper
const { getImage } = useHelper();

// user store
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

const user = computed(() => {
    return userStore.user
})

// height
const sideBarHeight = ref()
const contentHeight = ref()

onMounted(() => {
    setTimeout(function () {
        const sidebar = document.getElementById('sidebar').clientHeight;
        const content = document.getElementById('content').clientHeight;
        const avatarHeight = document.getElementById('user_avatar').clientHeight;

        if (sidebar > content) {
            contentHeight.value = sidebar
        } else {
            sideBarHeight.value = content - avatarHeight - 8
        }
    }, 100);
})

onUpdated(() => {
    const sidebar = document.getElementById('sidebar')
    const content = document.getElementById('content')
    const avatar = document.getElementById('user_avatar')
    if (sidebar) {
        const navHeight = sidebar.clientHeight
        const innercontentHeight = content.clientHeight
        const avatarHeight = avatar.clientHeight
        if (navHeight > innercontentHeight) {
            contentHeight.value = navHeight
        } else {
            sideBarHeight.value = innercontentHeight - avatarHeight - 8
        }
    }
})
</script>

<template>
    <div class="row" v-if="user">
        <div class="col-md-3">
            <div class="" id="inner-sidebar">
                <!-- user avatar -->
                <div class="col-md-12 col-sm-12 mb-2" id="user_avatar">
                    <div class="d-flex align-items-center p-3 rounded bg-white shadow-sm position-relative">
                        <img :src="getImage(user.avatar)" class="rounded-circle mx-2" alt="Profile Image" width="47"
                            height="47">
                        <div class="ms-1">
                            <div class="text-muted fs-6">Hello,</div>
                            <div class="fw-bold">{{ user.first_name + ' ' + user.last_name }}</div>
                        </div>
                        <div class="bg-red position-absolute top-1 end-0 me-2"></div>
                    </div>
                </div>

                <!-- side bar content -->
                <div class="row">
                    <div class="col-md-12 mx-auto">
                        <div class="card p-4 shadow rounded" :style="{ height: sideBarHeight + 'px' }">
                            <InnerSidebar />
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="col-md-9">
            <div class="card mb-4" id="content" :style="{ height: contentHeight + 'px' }">
                <RouterView />
            </div>
        </div>
    </div>
</template>
<style></style>