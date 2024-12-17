<script setup>
import { ref, inject, onMounted } from 'vue';
import { useCommentApi } from '@composables/comment';
import { useTagStore } from '@stores/tags';
import { useUserStore } from '@stores/user';
import { useHelper } from "@composables/helper";
import { useToastr } from "@composables/toastr";
import CommentModel from '../general/CommentModel.vue';
import { useModuleSettings } from '@composables/modules';
import Error from '../core/Error.vue';
import Pagination from '../core/Pagination.vue';
import { useRoute } from 'vue-router';

const { errors, meta, productComments, dataNotFound, comments, deleteComment, addComment } = useCommentApi();
const route = useRoute()
const { getImage } = useHelper();
const { confirm, toast } = useToastr();
const tagStore = useTagStore();
const { commentsTabTitle } = useModuleSettings();
const isSubmitting = ref(false);

const props = defineProps({
    product: Object
});
// console.log(props,"props");

const form = ref({
    comment: null,
    type: 'product',
    product_id: props.product.id ?? null,
    module: route?.params?.levelOneslug
});

const userStore = useUserStore();
const currentPage = ref(1);
const eventBus = inject('eventBus');
const commentSection = ref(null);

const getComments = async (page = 1) => {
    await comments(commentSection.value, { type: 'product', product_id: props.product.id, limit: 5, page: page });
}

const remove = async (id) => {
    const response = await deleteComment(commentSection.value, id);
    response ? currentPage.value = 1 : null;
    response ? await getComments(currentPage.value) : null;
}

const submit = async () => {
    isSubmitting.value = true;
    const response = await addComment(commentSection.value, form.value);
    response ? form.value.comment = null : null;
    response ? await getComments() : null;
    response ? toast(response.message) : null;
    isSubmitting.value = false;
}

const previousPage = async () => {
    currentPage.value--;
    await getComments(currentPage.value);
}

const nextPage = async () => {
    currentPage.value++;
    await getComments(currentPage.value);
}

const editComment = (comment) => {
    eventBus.emit('openCommentModal', {
        comment: comment,
        module: route?.params?.levelOneslug,
        product_id: props.product?.id,
        page: currentPage.value
    });
}

onMounted(() => {
    getComments();
});
</script>
<template>
    <div class="card bg-transparent border-0 shadow-none py-3 comment-section" ref="commentSection">
        <div class="flex-grow-1" v-if="product">
            <div class="overflow-hidden card">
                <div class="chat-history-footer my-2">
                    <form class="form-send-message d-flex justify-content-between align-items-center"
                        @submit.prevent="submit()">
                        <input class="form-control message-input border-0 me-3 shadow-none"
                            :placeholder="`Type your ${commentsTabTitle} here...`" v-model="form.comment" required />
                        <div class="message-actions d-flex align-items-center">
                            <label for="attach-doc" class="form-label mb-0">
                                <input type="file" id="attach-doc" hidden />
                            </label>
                            <button type="submit" :disabled="isSubmitting" class="btn btn-primary d-flex send-msg-btn"
                                style="margin-right: 10px;">
                                <span class="align-middle d-md-inline-block d-none">Post</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Error v-if="errors" :message="errors"></Error>
        </div>
        <div class="col-md-12 py-3">
            <div class="card mb-3" v-for="(comment, index) in productComments" :key="index">
                <div class="body">
                    <div class="d-flex p-3 rounded position-relative">
                        <div class="user-avatar">
                            <img :src="getImage(comment.user.avatar)" class="rounded-circle" alt="Profile Image"
                                width="47" height="47">
                        </div>
                        <div class="user-info">
                            <div class="d-flex justify-content-between">
                                <div class="fw-bold">{{ comment?.user.name }}</div>
                                <div class="ms-auto ">{{ comment?.created_at }}</div>
                            </div>
                            <p>{{ comment?.comment }}</p>
                            <div v-if="userStore.user && userStore.user.id === comment.user.id">
                                <i class='bx bxs-edit fs-5 me-3 cursor-pointer' @click="editComment(comment)"></i>
                                <i class='bx bxs-trash fs-5 cursor-pointer' @click="remove(comment?.id)"></i>
                            </div>
                        </div>
                        <div class="bg-red position-absolute top-1 end-0 me-2"></div>
                    </div>
                </div>
            </div>
            <div v-if="dataNotFound">
                {{ dataNotFound }}
            </div>

            <div v-if="productComments.length > 0">
                <Pagination v-if="meta" :meta="meta" @previousPage="previousPage" @nextPage="nextPage" />
            </div>
        </div>
    </div>
    <div>
        <CommentModel @get-comments="getComments(currentPage)" />
    </div>
</template>

<style scoped>
.card {
    overflow-wrap: break-word;
}

.user-avatar {
    margin-right: 15px;

    /* Adjust the margin as needed */
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