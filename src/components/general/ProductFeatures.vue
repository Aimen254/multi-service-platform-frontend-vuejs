<script setup>
const props = defineProps({
    features: Array
})
</script>

<template>
    <div class="col-md-12 col-lg-12 col-xl-12 mb-4">
        <div class="card h-100">
            <div class="card-body pt-3 pb-1">
                <div class="row" v-if="features.length > 0">
                    <template v-for="feature in features" :key="feature">
                        <div class="col-6 d-flex align-items-center mb-2"
                            v-if="feature.slug != 'for-rent' && feature.slug != 'for-sale'">
                            <div>
                                <span><b class="text-capitalize">{{ feature.attribute[0].name }}:</b></span>
                            </div>
                            <div class="ms-3">
                                <span>{{ feature.text }}</span>
                            </div>
                        </div>
                    </template>
                </div>
                <div class="row mb-2" v-else>
                    There are no database entries that meet your criteria.
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>