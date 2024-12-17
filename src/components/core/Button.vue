<template>
    <button :class="props.btnClasses" :type="type">
        <slot></slot>
    </button>
</template>

<script setup>
    // defining props and assigning default values
    const props = defineProps({
        btnClasses: {
            type: String,
            default: 'btn btn-primary d-grid'
        },
        type: {
            type: String,
            default: 'submit'
        }
    })
</script>