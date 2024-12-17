<script setup>
const props = defineProps({
    meta: Object,
});

const emit = defineEmits();

const previousPage = () => {
    emit('previousPage');
}
const nextPage = () => {
    emit('nextPage');
}
</script>
<template>
    <div class="row pb-0 align-items-center">
        <div class="col-md-6 text-center text-md-start">Showing {{ meta?.first ?? '0' }} to {{ meta?.last ?? '0' }} of {{
            meta?.total ?? '0' }}
        </div>
        <div class="col-md-6 d-flex justify-content-md-end justify-content-center mt-3 mt-md-0">
            <button type="button" class="btn btn-primary" @click="previousPage"
                :disabled="!meta?.previous">Previous</button>
            <button type="button" class="btn btn-primary ms-2" @click="nextPage" :disabled="!meta?.next">Next</button>
        </div>
    </div>
</template>