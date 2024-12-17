
<script setup>
import { useRoute } from 'vue-router';
import { useBookings } from '@composables/eventBookings.js'
const { bookEvent } = useBookings()
const route = useRoute()
const props = defineProps({
  product: Object,
});
</script>
<template>
  <h5> Robotics Conference ${{ product?.price }} - ${{ product?.max_price }} </h5>
  <div class="btn-group mb-2" role="group" aria-label="View All" style="width: 100%;">
    <button type="button" @click="bookEvent(route.params?.levelOneslug, { 'product_id': product?.id })"
      class="btn btn-primary btn-block" style="width: 100%;" data-i18n="Featured">
      Buy Ticket</button>
  </div>
</template>