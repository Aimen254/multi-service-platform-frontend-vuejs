<script setup>
import {useModuleSettings} from '@composables/modules.js';
import {useHelper} from "@composables/helper";

const { resetStringFormat } = useHelper();
const {attributes, vehicleFeatures} = useModuleSettings();

const props = defineProps({
  product: Object,
  vehicle: Object,
  features: Object
});
</script>

<template>
  <div class="col-md-12 col-lg-12 col-xl-12 mb-4">
    <div class="card h-100">
      <div class="card-body pt-3 pb-1">
        <div class="row">
          <template v-for="key in vehicleFeatures" :key="key">
            <div class="col-12 d-flex align-items-center mb-2"
                 v-if="vehicle[key] !== ''">
              <div>
                <span class="text-capitalize"><b>{{ resetStringFormat(key) }}:</b></span>
              </div>
              <div class="ms-3">
                <span class="text-capitalize">{{ vehicle[key] }}</span>
              </div>
            </div>
          </template>
          <template v-for="key in attributes" :key="key">
            <div class="col-12 d-flex align-items-center mb-2"
                 v-if="product[key]">
              <div>
                <span class="text-capitalize"><b>{{ resetStringFormat(key) }}:</b></span>
              </div>
              <div class="ms-3">
                <span class="text-capitalize" v-if="key === 'body_styles'">{{ product[key].text }}</span>
                <span class="text-capitalize" v-else>{{ product[key] }}</span>
              </div>
            </div>
          </template>
          <template v-for="feature in features" :key="feature">
            <div class="col-12 d-flex align-items-center mb-2"
                 v-if="feature.slug != 'for-rent' && feature.slug != 'for-sale'">
              <div>
                <span><b>{{ feature.attribute[0].name }}:</b></span>
              </div>
              <div class="ms-3">
                <span>{{ feature.text }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>