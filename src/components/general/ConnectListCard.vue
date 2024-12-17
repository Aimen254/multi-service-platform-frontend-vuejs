<script setup>
import { onBeforeMount, ref } from "vue";

import { useHelper } from "@composables/helper";
const { getImage } = useHelper();

import { useUserStore } from '@stores/user.js'
const userStore = useUserStore()

import { useMessage } from "@composables/message.js"
const { recordNotFound } = useMessage()

const avtiveBusiness = ref(null)
const props = defineProps({
    businesses: Array
})

const emit = defineEmits();

const selectBusiness = (business = null) => {
    avtiveBusiness.value = business?.slug
    emit('filter-posts', { business: business });
}
onBeforeMount(() => {
    avtiveBusiness.value = localStorage.getItem('business')
})
</script>
<template>
    <div class="card mt-4">
        <div class="card-body">
            <ul class="p-0 m-0" v-if="businesses.length > 0">
                <li class="list-unstyled d-flex justify-content-between" v-for="(item, index) in businesses" :key="item"
                    :class="[index < businesses.length - 1 ? 'pb-3' : '']">
                    <div>
                        <div class="cursor-pointer" @click="selectBusiness(item?.business)">
                            <h6 class="mb-0" :class="{ 'text-primary': avtiveBusiness === item?.business?.slug }">{{
                                item?.business?.name }}</h6>
                        </div>
                        <div>
                            <span style="font-size: 14px;">
                                {{ item?.business?.level_two_tags[0]?.name }}
                                {{ '. ' + item?.business?.level_three_tags[0]?.name }}
                            </span>
                        </div>
                    </div>
                    <div v-if="index === 0 && avtiveBusiness">
                        <div class="badge bg-label-primary d-flex justify-content-between align-items-center cursor-pointer"
                            @click="selectBusiness()">
                            <span class='tf-icons bx bx-reset fs-5'></span>
                            <span class="ps-1">Reset</span>
                        </div>
                    </div>

                </li>
            </ul>
            <div v-else>
                {{ recordNotFound() }}
            </div>
        </div>
    </div>
</template>

<style></style>