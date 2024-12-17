<script setup>
import Button from '@components/core/Button.vue'
import { useModuleSettings } from '@composables/modules.js'
import { useUserStore } from '@stores/user.js'
import { useContactApi } from '@composables/contact.js'
import { useTagStore } from '@stores/tags'
import { reactive, ref } from 'vue';
import Error from '@components/core/Error.vue'
import { useLoading } from 'vue-loading-overlay'


const props = defineProps({
    product: Object
})

const { singularOwnerTitle, requestBtnTitle, productRequestType, itemContainerValidator, contactFormOptions } = useModuleSettings();
const { requestProduct, errors } = useContactApi();
const userStore = useUserStore();
const tagStore = useTagStore();
const $loading = useLoading();

const maxCount = ref(500);
const remainingCount = ref(500);

// set contact form 
const form = reactive({
    first_name: userStore?.user.first_name,
    last_name: userStore?.user.last_name,
    email: userStore?.user.email,
    phone: userStore?.user.phone,
    subject: '',
    comment: '',
    module: props.product,
    product_id: props.product.id,
    user_id: userStore?.user.id,
});

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
    <div class="col-md-4"
        :class="{ 'card-spacing': itemContainerValidator('resume'), 'my-1': !itemContainerValidator('resume') }">
        <div class="d-flex justify-content-end align-items-baseline">
            <p v-if="tagStore.getLevelOneTagSlug !== 'marketplace' && !itemContainerValidator('hidePhoneNo')"
                class="d-flex mb-1">
                <span class="ms-4 text-dark fs-6">Contact {{ itemContainerValidator('contactAgent') ? 'Agent' :
                    singularOwnerTitle }}</span>
            </p>
        </div>

        <div class="d-flex justify-content-between align-items-baseline"
            :style="tagStore.getLevelOneTagSlug == 'marketplace' ? 'margin-top: 2rem;' : ''">
            <p class="text-dark fs-6">{{ productRequestType }}</p>
            <div v-if="!itemContainerValidator('hidePhoneNo')">
                <p class="d-flex align-items-baseline">
                    <i class="bx bxs-phone"></i>
                    {{ product?.user ? product.user.phone : product?.business?.phone }}
                </p>
            </div>
        </div>
        <div class="card my-1">
            <div class="card-body">
                <form @submit.prevent="submit()">
                    <div class="row">
                        <div class="col-lg-12 mb-3">
                            <label class="form-label required" for="first_name">First Name</label>
                            <input type="text" id="first_name" v-model="form.first_name" disabled class="form-control"
                                placeholder="Enter First Name" />
                            <Error v-if="errors?.first_name" :message="errors?.first_name[0]"></Error>
                        </div>
                        <div class="col-lg-12 mb-3">
                            <label class="form-label required" for="last_name">Last Name</label>
                            <input type="text" id="last_name" v-model="form.last_name" disabled class="form-control"
                                placeholder="Enter Last Name" />
                            <Error v-if="errors?.last_name" :message="errors?.last_name[0]"></Error>
                        </div>

                        <div class="col-lg-12 mb-3">
                            <label class="form-label required" for="email">Email</label>
                            <input type="email" id="email" v-model="form.email" disabled class="form-control"
                                placeholder="Enter Email" />
                            <Error v-if="errors?.email" :message="errors?.email[0]"></Error>
                        </div>
                        <div class="col-lg-12 mb-3">
                            <label class="form-label" for="phone">Phone</label>
                            <input type="text" id="phone" v-model="form.phone" class="form-control"
                                placeholder="Enter Phone" />
                            <Error v-if="errors?.phone" :message="errors?.phone[0]"></Error>
                        </div>

                        <div class="col-lg-12 mb-3">
                            <label for="subject" class="form-label required">Subject</label>
                            <select id="subject" class="form-select" v-model="form.subject">
                                <option value="" selected disabled>Select Subject</option>
                                <option v-for="option in contactFormOptions" :key="option" :value="option.key">
                                    {{ option.value }}
                                </option>
                            </select>
                        </div>

                        <div class="col-lg-12 mb-3">
                            <label for="comments" class="form-label required">Comments &#40; {{ remainingCount }}
                                characters &#41;</label>
                            <textarea maxlength="500" class="form-control" id="comments" style="resize: none;" rows="3"
                                @input="updateCount" v-model="form.comment">
                            </textarea>
                            <Error v-if="errors?.comment" :message="errors?.comment[0]"></Error>
                        </div>

                        <div class="col-12 mt-3">
                            <Button id="contact_btn" btnClasses="btn btn-primary w-100">{{ requestBtnTitle }}</Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card-spacing {
    margin-top: 1.626rem;
}
</style>