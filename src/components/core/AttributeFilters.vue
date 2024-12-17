<script setup>
import { onMounted, ref, watch } from "vue";
import Select2 from 'vue3-select2-component';
import noUiSlider from 'nouislider';
import { useHelper } from "@composables/helper";
import wNumb from 'wnumb';

const props = defineProps({
    attributeFilter: Object,
    attributeName: String,
    attribute: Object,
    priceRange: Object
});

const emit = defineEmits();
const { resetStringFormat, ucfirst } = useHelper();
const attributeFilter = props.attributeFilter;
const attributeName = props.attributeName;
const priceRange = props.priceRange;

const attribute = ref(props.attribute ?? null);
const priceFilterRef = ref(null);
const priceFilterRange = ref({ min: 0, max: 0 });
const rangeValuesOnUpdate = ref({ min: priceFilterRange.value.min, max: priceFilterRange.value.max })

// initiate price range slider
const initNoUiSliderPrice = () => {
    const slider = priceFilterRef.value;
    const minValue = Math.floor(priceFilterRange.value.min);
    const maxValue =  Math.floor(priceFilterRange.value.max);
    // initilizing
    noUiSlider.create(slider, {
        start: [minValue, maxValue],
        connect: true,
        tooltips: false,
        range: {
            'min': minValue,
            'max': maxValue
        }
    });

    // updating values
    slider.noUiSlider.on('change', (values, handle) => {
        let value = parseFloat(values[handle]);
        value = Math.floor(value);
        priceFilterRange.value[handle === 1 ? 'max' : 'min'] = value;
        emit('filter-attributes', priceFilterRange.value);
    });

    slider.noUiSlider.on('update', (values, handle) => {
        let value = parseFloat(values[handle]);
        value = Math.floor(value);
        let formattedValue = wNumb({ decimals: 0, thousand: ',' }).to(value);
        rangeValuesOnUpdate.value[handle === 1 ? 'max' : 'min'] = formattedValue;
    });

}

// set filters
const setFilters = ({ text }, key) => {
    emit('filter-attributes', { key: key, value: attribute.value, text });
}

// reseting input fields
const resetInputs = () => {
    attribute.value = null;
}

// exposing methods & properties
defineExpose({
    resetInputs
});

onMounted(() => {
    if (attributeFilter?.min_price && attributeFilter?.max_price) {
        priceFilterRange.value.min = Object.keys(priceRange).length > 0 && priceRange.min != undefined ? priceRange.min : parseFloat(attributeFilter?.min_price);
        priceFilterRange.value.max = Object.keys(priceRange).length > 0 && priceRange.min != undefined ? priceRange.max : parseFloat(attributeFilter?.max_price);
        initNoUiSliderPrice();
    }
})
</script>

<template>
    <div v-if="attributeName !== 'price'" class="col-lg-3 col-md-4 my-2">
        <label class="text-capitalize">{{ resetStringFormat(attributeName) }}</label>
        <Select2 :placeholder="ucfirst(resetStringFormat(attributeName))" v-model="attribute" :options="attributeFilter"
            @select="setFilters($event, attributeName)"></Select2>
    </div>
    <div v-else class="col-lg-3 col-md-4 my-2">
        <label class="text-capitalize">{{ resetStringFormat(attributeName) }}</label>
        <div ref="priceFilterRef"></div>
        <div class="d-flex justify-content-between pt-2">
            <div>{{ rangeValuesOnUpdate.min }}</div>
            <div>{{ rangeValuesOnUpdate.max }}</div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@assets/scss/main.scss';

:deep(.select2-container) {
    margin: 0;
    width: 100% !important;
    display: inline-block;
    position: relative;
    vertical-align: middle;
    box-sizing: border-box;
}

:deep(.select2-container--default .select2-selection--single .select2-selection__arrow b) {
    margin-top: 3px;
}

:deep(.select2-container .select2-selection--single) {
    box-sizing: border-box;
    cursor: pointer;
    display: block;
    height: 50px;
    user-select: none;
    -webkit-user-select: none;
    border-radius: 6px;
    color: #676767;
    height: calc(1.53em + 0.875rem + 2px);

}

:deep(.select2-container--default .select2-selection--single .select2-selection__rendered) {
    line-height: 2.25rem;
    color: #697a8d;
    padding-left: 0.875rem;
}

.select2-container--default .select2-selection--single .select2-selection__arrow b {
    position: absolute;
    height: 12px;
    width: 17px;
    top: 40%;
    background-repeat: no-repeat;
    background-size: 17px 12px;
}

:deep(.active .select2-container .select2-selection--single) {
    border-color: $primary
}

:deep(.active .select2-container--default .select2-selection--single .select2-selection__rendered) {
    color: $primary;
}

:deep(.active .select2-container--default .select2-selection--single .select2-selection__arrow b) {
    border-color: $primary transparent transparent transparent;
}
</style>