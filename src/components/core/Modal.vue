<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  modal: Boolean,
  id: String
});

const emit = defineEmits();

const closeModal = () => {
  emit('close');
};
</script>
<template>
  <div>
    <div class="modal fade" v-bind:id="id" tabindex="-1" data-toggle="modal" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <slot name="modal-header"></slot>
          </div>
          <div class="modal-body">
            <slot name="modal-body"></slot>
          </div>
          <div class="modal-footer">
            <slot name="modal-footer"></slot>
          </div>
        </div>
      </div>
    </div>
    <div v-if="modal" class="modal-backdrop fade show" @click="closeModal"></div>
  </div>
</template>