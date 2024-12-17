<template>
    <input :class="btnClasses" :placeholder="placeholder" autofocus />
</template>

<script setup>
    // defining props and assigning default values
    const props = defineProps({
        placeholder: {
            type: String,
            default: 'Type something here'
        },
        btnClasses: {
            type: String,
            default: 'form-control'
        },
    })
</script>