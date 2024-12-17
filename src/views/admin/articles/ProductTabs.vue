<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router'
import { useModuleSettings } from '@composables/modules';
const route = useRoute()
const { itemContainerValidator } = useModuleSettings();

</script>
<template>
    <!-- Navbar pills -->
    <div class="row">
        <div class="col-md-12">
            <div class="bs-stepper shadow-none">
                <div class="bs-stepper-header border-bottom-0">
                    <div class="step" :class="['articles.form', 'garage.form'].includes(route.name) ? 'active' : ''"
                        data-target="#basicInformation">
                        <span class="step-trigger">
                            <span class="bs-stepper-circle"><i class="bx bx-edit"></i></span>
                            <span class="bs-stepper-label mt-1">
                                <span class="bs-stepper-title">Basic Information</span>
                                <span class="bs-stepper-subtitle">Edit Basic Information</span>
                            </span>
                        </span>
                    </div>
                    <div class="line" v-if="!itemContainerValidator('noMainImage')">
                        <i class="bx bx-chevron-right"></i>
                    </div>
                    <div class="step" :class="['articles.media', 'garage.media'].includes(route.name) ? 'active' : ''"  v-if="!itemContainerValidator('noMainImage')"
                        data-target="#media">
                        <span class="step-trigger">
                            <span class="bs-stepper-circle"><i class="bx bx-image"></i></span>
                            <span class="bs-stepper-label mt-1">
                                <span class="bs-stepper-title">Media</span>
                                <span class="bs-stepper-subtitle">Edit Images</span>
                            </span>
                        </span>
                    </div>
                    <div class="line">
                        <i class="bx bx-chevron-right"></i>
                    </div>
                    <div class="step" :class="['articles.tags', 'garage.tags'].includes(route.name) ? 'active' : ''"
                        data-target="#tags">
                        <span class="step-trigger">
                            <span class="bs-stepper-circle"><i class="bx bx-purchase-tag"></i></span>
                            <span class="bs-stepper-label mt-1">
                                <span class="bs-stepper-title">Tags</span>
                                <span class="bs-stepper-subtitle">Enter Tags</span>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--/ Navbar pills -->
</template>

<style></style>