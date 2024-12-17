<script setup>
import { useTagStore } from '@stores/tags';
import { useHelper } from "@composables/helper";

const { getImage } = useHelper();
const tagStore = useTagStore();

const props = defineProps({
  comments: Object
});

</script>
<template>
    <div class="card bg-transparent border-0 shadow-none py-3 comment-section" ref="commentSection">
        <div class="col-md-12 py-3">
            <div class="card mb-3" v-for="(comment, index) in comments" :key="index">
                <div class="body">
                    <div class="d-flex p-3 rounded position-relative">
                        <div class="user-avatar">
                            <img :src="getImage(comment.user.avatar)" class="rounded-circle" alt="Profile Image" width="47"
                                height="47">
                        </div>
                        <div class="user-info">
                            <div class="d-flex justify-content-between">
                                <div class="fw-bold">{{ comment?.user.name }}</div>
                                <div class="ms-auto ">{{ comment?.created_at }}</div>
                            </div>
                            <p>{{ comment?.comment }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    overflow-wrap: break-word;
}

.user-avatar {
    margin-right: 15px;
}

:deep(.vl-background) {
    border: none !important;
    box-shadow: none !important;
    background-color: #f5f5f9 !important;
}

.user-info {
    flex-grow: 1;
    margin-bottom: 6px;
}
</style>