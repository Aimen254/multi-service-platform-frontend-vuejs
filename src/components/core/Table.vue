<script setup>
</script>

<template>
    <div class="p-4">
        <div id="table">
            <slot name="filters" />
            <div class="table-responsive text-nowrap mb-3">
                <table class="table">
                    <slot name="content" />
                </table>
            </div>
        </div>
        <slot name="pagination" />
    </div>
</template>