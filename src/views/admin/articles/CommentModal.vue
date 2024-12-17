<script setup>
import { ref, inject, onMounted } from 'vue';
import { useModuleSettings } from '@composables/modules';
import Modal from '@components/core/Modal.vue';
const eventBus = inject('eventBus')

const showModal = ref(false)
const comment = ref(null)
const { commentsTabTitle } = useModuleSettings();

const closeModal = () => {
    const modal = document.getElementById('modalCenter')
    showModal.value = false
    modal.classList.remove('show');
    modal.style.display = 'none'
    comment.value = null
}

onMounted(() => {
    eventBus.on('openModal', async (args) => {
        comment.value = args?.comment
        const modal = document.getElementById('modalCenter')
        modal.classList.add('show');
        modal.style.display = 'block'
        showModal.value = true
    })
})
</script>
<template>
    <div>
        <transition name="modal" mode="out-in">
            <Modal :id="'modalCenter'" :modal="showModal" @close="closeModal">
                <template #modal-header>
                    <!-- Your modal header content goes here -->
                    <h5 class="modal-title" id="modalCenterTitle">{{ commentsTabTitle }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                        @click="closeModal"></button>
                </template>
                <form action="">

                </form>
                <template #modal-body>
                    <!-- Your modal body content goes here -->
                    <div v-if="comment">
                        <div class="row">
                            <div class="col-md-12">
                                <p>{{ comment.comment }}</p>
                            </div>
                            <div class="col-6">
                                <div class="d-flex align-items-center">
                                    <div class="avatar flex-shrink-0">
                                        <img class="rounded mx-1" :src="comment?.user?.avatar" />
                                    </div>
                                    <div class="ms-4">
                                        <p class="mb-0">{{ comment.user?.name }}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6 d-flex align-items-center">
                                <div>
                                    <span>
                                        {{ comment?.created_at }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template #modal-footer>
                    <!-- Your modal footer content goes here -->
                    <button type="button" class="btn btn-label-secondary" @click="closeModal">Close</button>
                </template>
            </Modal>
        </transition>
    </div>
</template>

<style></style>