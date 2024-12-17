<script setup>
import { ref } from 'vue';
import { useEvents } from '@composables/events.js'
import { useRoute } from 'vue-router';
const route = useRoute()
const { changeStatus } = useEvents()
const productItem = ref({});
const props = defineProps({
    product: Object
})
productItem.value = props.product
</script>

<template>
    <div class="col-md-12 col-lg-12 col-xl-12 mb-4">
        <div class="card h-100">
            <div class="card-body pt-3 pb-3 ps-5">
                <div class="row">
                    <div class="ps-0">
                        <h5>Event Status</h5>
                    </div>
                    <div class="form-check form-check-success mt-2">
                        <input name="customRadioPrimary" class="form-check-input"
                            @click.prevent="changeStatus(route.params?.levelOneslug, productItem.calendar_event?.id, $event)"
                            v-model="productItem.calendar_event.status" type="radio" value="going"
                            id="customRadioPrimary" />
                        <label class="form-check-label text-success" for="customRadioPrimary">Going </label>
                    </div>
                    <div class="form-check form-check-danger mt-2">
                        <input name="customRadioPrimary"
                            @click.prevent="changeStatus(route.params?.levelOneslug, productItem.calendar_event?.id, $event)"
                            v-model="productItem.calendar_event.status" class="form-check-input" type="radio"
                            value="not_going" id="customRadioPrimary" />
                        <label class="form-check-label text-danger" for="customRadioPrimary">Not Going </label>
                    </div>
                    <div class="form-check form-check-warning mt-2">
                        <input name="customRadioPrimary" class="form-check-input"
                            @click.prevent="changeStatus(route.params?.levelOneslug, productItem.calendar_event?.id, $event)"
                            v-model="productItem.calendar_event.status" type="radio" value="maybe"
                            id="customRadioPrimary" />
                        <label class="form-check-label text-warning" for="customRadioPrimary">Maybe </label>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>
