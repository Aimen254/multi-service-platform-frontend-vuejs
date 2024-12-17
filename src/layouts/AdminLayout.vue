<script setup>
import { ref, computed } from 'vue'
import { RouterView } from 'vue-router'
import AdminSidebar from '@components/general/AdminSidebar.vue'
import { useHelper } from '@composables/helper';
import { useUserStore } from '@/stores/user'
import { useModuleSettings } from '@composables/modules';

const { getImage } = useHelper();
const userStore = useUserStore()

const { getApectRatio } = useModuleSettings()

const user = computed(() => {
    return userStore.user
})

</script>

<template>
    <div class="row" v-if="user">
        <div class="col-lg-3">
            <div class="" id="sidebar">
                <!-- user avatar -->
                <div class="col-md-12 col-sm-12 mb-2" id="user_avatar">
                    <div class="d-flex align-items-center p-3 rounded bg-white shadow-sm position-relative">
                        <img :src="getImage(user.avatar)" class="rounded-circle mx-2"
                            :style="{ 'aspect-ratio': getApectRatio('logo') }" alt="Profile Image" width="47" height="47">
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
                        <div class="card p-4 shadow rounded">
                            <AdminSidebar />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-9">
            <div class="card mb-4" id="content">
                <RouterView />
            </div>
        </div>
    </div>
</template>