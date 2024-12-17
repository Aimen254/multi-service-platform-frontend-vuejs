<script setup>
import Button from '@components/core/Button.vue'
import { useModuleSettings } from '@composables/modules.js'
import { useUserStore } from '@stores/user.js'
import { useContactApi } from '@composables/contact.js'
import { useTagStore } from '@stores/tags'
import { reactive, ref } from 'vue';
import Error from '@components/core/Error.vue'
import { useLoading } from 'vue-loading-overlay'
const $loading = useLoading()

const { singularOwnerTitle, productRequestType } = useModuleSettings()
const userStore = useUserStore()

const { requestProduct, errors } = useContactApi()
const tagStore = useTagStore()

const props = defineProps({
    product: Object
})

const maxCount = ref(500)
const remainingCount = ref(500)

// set contact form 
const form = reactive({
    first_name: userStore?.user.first_name,
    last_name: userStore?.user.last_name,
    email: userStore?.user.email,
    phone: userStore?.user.phone,
    subject: 'check_availability',
    comment: '',
    module: props.product,
    product_id: props.product.id,
    user_id: userStore?.user.id,
})

const updateCount = () => {
    remainingCount.value = maxCount.value - form.comment.length;
}

const submit = async () => {
    const btn = document.getElementById('contact_btn')
    const loader = $loading.show({
        container: btn,
        color: '#ff6846',
        width: 40,
        height: 40,
    });
    await requestProduct(tagStore.getLevelOneTagId, form, btn)
    loader.hide()
}

</script>

<template>
    <div class="col-md-4">
        <div class="d-flex justify-content-between align-items-center">
            <h5>{{ productRequestType }}</h5>
            <div>
                <p class="d-flex align-items-center fs-5 mb-1">
                    <span class="ms-4">Contact {{ singularOwnerTitle }}</span>
                </p>
                <p class="d-flex align-items-center fs-5">
                    <i class="bx bxs-phone me-2"></i>
                    {{ product?.business?.phone }}
                </p>
            </div>
        </div>
        <div class="card">
            <div class="card-body">
                <form @submit.prevent="submit()">
                    <div class="row">
                        <Error v-if="errors" :message="errors"></Error>
                        <div class="col-lg-12 mb-3">
                            <label class="form-label required" for="first_name">First Name</label>
                            <input type="text" id="first_name" v-model="form.first_name" disabled class="form-control"
                                placeholder="Enter First Name" />
                        </div>
                        <div class="col-lg-12 mb-3">
                            <label class="form-label required" for="last_name">Last Name</label>
                            <input type="text" id="last_name" v-model="form.last_name" disabled class="form-control"
                                placeholder="Enter Last Name" />
                        </div>

                        <div class="col-lg-12 mb-3">
                            <label class="form-label required" for="email">Email</label>
                            <input type="email" id="email" v-model="form.email" disabled class="form-control"
                                placeholder="Enter Email" />
                        </div>
                        <div class="col-lg-12 mb-3">
                            <label class="form-label" for="phone">Phone</label>
                            <input type="text" id="phone" v-model="form.phone" class="form-control"
                                placeholder="Enter Phone" />
                        </div>

                        <div class="col-lg-12 mb-3">
                            <label for="subject" class="form-label required">Subject</label>
                            <select id="subject" class="form-select" v-model="form.subject">
                                <option value="check_availability">Check availability</option>
                                <option value="ask_question">Ask a question</option>
                                <option value="request_product">{{ productRequestType }} </option>
                            </select>
                        </div>

                        <div class="col-lg-12 mb-3">
                            <label for="comments" class="form-label required">Comments &#40; {{ remainingCount }}
                                characters &#41;</label>
                            <textarea maxlength="500" class="form-control" id="comments" style="resize: none;" rows="3"
                                @input="updateCount" v-model="form.comment">
                            </textarea>
                        </div>

                        <div class="col-12 mt-3">
                            <Button id="contact_btn" btnClasses="btn btn-primary w-100">Submit</Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>