<script setup>
import { ref, watch, inject, onMounted, onBeforeUnmount } from 'vue';
import { useCommentApi } from '@composables/comment';
import { useModuleSettings } from '@composables/modules';
import Modal from '../core/Modal.vue';
import Error from '../core/Error.vue';
import { useToastr } from "@composables/toastr";

const showModal = ref(false);
const eventBus = inject('eventBus');
const data = ref(null);
const productId = ref(null);
const updatedComment = ref(null);
const commentModal = ref(null);
const module = ref(null);
const { errors, update, addComment } = useCommentApi();
const { commentsTabTitle } = useModuleSettings();
const modalTitle = ref('Edit');
const { confirm, toast } = useToastr();
const disbaleButtons = ref(false)

const emit = defineEmits();

const closeModal = () => {
    const modal = document.getElementById('modalCenter')
    showModal.value = false
    modal.classList.remove('show');
    modal.style.display = 'none'

    errors.value = null;
}

const submit = async () => {
    if (data.value) {
        const response = await update(commentModal.value, { id: data.value.id, product_id: productId.value, module: module.value, type: 'product', comment: updatedComment.value.comment });
        response ? closeModal() : null;
        response ? await emit('get-comments') : null;
    } else {
        disbaleButtons.value = true
        const response = await addComment(commentModal.value, { product_id: productId.value, module: module.value, type: 'product', comment: updatedComment.value.comment }, false);
        response ? updatedComment.value.comment = null : null;
        response ? closeModal() : null;
        response ? toast(response.message) : null;
        if (response) {
            eventBus.emit('comment-added', {
                productId: productId.value
            })
        }
        disbaleButtons.value = false
    }

}


onMounted(() => {
    eventBus.on('openCommentModal', async (args) => {
        const modal = document.getElementById('modalCenter')
        modalTitle.value = args.comment ? 'Edit' : 'Add'
        modal.classList.add('show');
        modal.style.display = 'block'
        showModal.value = true
        data.value = args.comment ? args.comment : null;
        module.value = args.module;
        productId.value = args.product_id;
        updatedComment.value = { ...args.comment };

    });
});

onBeforeUnmount(() => {
    eventBus.off('openCommentModal'); // Remove the event listener
});

watch(() => data.value, (newValue) => {
    updatedComment.value = { ...newValue };
});
</script>

<template>
    <div>
        <transition name="modal" mode="out-in">
            <Modal :id="'modalCenter'" :modal="showModal" @close="closeModal">
                <template #modal-header>
                    <!-- Your modal header content goes here -->
                    <h5 class="modal-title" id="modalCenterTitle"> {{ modalTitle }} {{ commentsTabTitle }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                        @click="closeModal"></button>
                </template>
                <template #modal-body>
                    <!-- Your modal body content goes here -->
                    <div class="row" ref="commentModal">
                        <div class="col-12 mb-3">
                            <label for="comment" class="form-label required">{{ commentsTabTitle }}</label>
                            <textarea v-if="updatedComment" class="form-control" rows="5" v-model="updatedComment.comment"
                                required></textarea>
                            <Error v-if="errors" :message="errors" />
                        </div>
                    </div>
                </template>
                <template #modal-footer>
                    <!-- Your modal footer content goes here -->
                    <button type="button" class="btn btn-label-secondary" :disabled="disbaleButtons"
                        @click="closeModal">Close</button>
                    <button type="submit" class="btn btn-primary" :disabled="disbaleButtons" @click="submit">Save</Button>
                </template>
            </Modal>
        </transition>
    </div>
</template>