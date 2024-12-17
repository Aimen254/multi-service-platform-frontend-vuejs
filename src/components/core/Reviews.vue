<script setup>
import { ref, onMounted, computed } from 'vue';
import StarRating from 'vue-star-rating';
import { reviews } from '@composables/reviews.js';
import { useTagStore } from '@stores/tags';
import { useUserStore } from '@stores/user';
import Pagination from '@components/core/Pagination.vue';
import { useHelper } from '@composables/helper';
import Error from '@components/core/Error.vue';
import { useModuleSettings } from '@composables/modules.js'
import { useRoute } from 'vue-router';
const { itemContainerValidator } = useModuleSettings()
const { formatDateTime } = useHelper();
const userStore = useUserStore();
const tagStore = useTagStore();
const showForm = ref(false);
const currentPage = ref(1);
const reviewesRef = ref(null)
const route = useRoute()
const { updateOrCreateReviews, getreviews, data, rating, ratings, meta, errors, dataNotFound } = reviews();

const props = defineProps({
    product: Object,
    type: String
});

const modelId = computed(() => {
    switch (props.type) {
        case 'user':
            return props?.product?.user?.id;
        case 'business':
            return props?.product?.business?.id;
        default:
            return props?.product?.id;
    }
})

const form = ref({
    comment: '',
    user_id: userStore.user.id,
    rating: 0,
    type: props.type,
    model_id: modelId
});

const toggleForm = () => {
    showForm.value = !showForm.value;
};

const clearErrors = () => {
    errors.value.comment = '';
    errors.value.rating = '';
}

const submitReview = async () => {
    try {
        await updateOrCreateReviews(form.value, tagStore.getLevelOneTagId ? tagStore.getLevelOneTagId : route?.params?.levelOneslug, reviewesRef.value);
        form.value.comment = ''
        form.value.rating = ''
        review()
    } catch (error) {
    }
}

const review = async (page = 1) => {
    getreviews(tagStore.getLevelOneTagId ? tagStore.getLevelOneTagId : route?.params?.levelOneslug, {
        'id': modelId.value, make_id: props.product.vehicle?.maker?.id, model_id: props.product.vehicle?.model?.id, type: props.type, limit: 4, page: page
    })
}

const previousPage = async () => {
    currentPage.value--;
    await review(currentPage.value)

}

const nextPage = async () => {
    currentPage.value++;
    await review(currentPage.value)
}

onMounted(() => {
    review()
})


</script>

<template>
    <div class="row">
        <div class="col-md-12 p-3">
            <div class="card shadow-sm mb-3" ref="reviewesRef">
                <div class="card-body border-bottom">
                    <div :class="{ 'justify-content-between float-end': !itemContainerValidator('automotiveReview') }">
                        <div v-if="!itemContainerValidator('automotiveReview')">
                            <h5>Have Something To say?</h5>
                            <button type="button" class="btn btn-primary float-end" @click="toggleForm">Write
                                Review</button>
                        </div>
                        <div class="d-flex align-items-center" v-if="itemContainerValidator('automotiveReview')">
                            <div class="float-start mb-4" v-if="ratings?.average">
                                <span><strong>Average Reviews :</strong> {{ ratings?.average }}</span>
                                <star-rating star-size="20" v-model:rating="ratings.average" :show-rating="false"
                                    :read-only="true" active-color="#ff6846"></star-rating>
                            </div>

                            <!-- Right side: Have Something To Say? -->
                            <div class="ms-auto">
                                <div class="d-flex flex-column align-items-end">
                                    <h5>Have Something To Say?</h5>
                                    <router-link :to="{ name: 'add-reviews' }" class="menu-link">
                                        <div class="btn btn-primary mb-2" data-i18n="Featured">Write Review
                                        </div>
                                    </router-link>
                                </div>
                            </div>
                        </div>


                    </div>

                    <form @submit.prevent="submitReview" class="mt-4" v-if="showForm">
                        <div>
                            <h5 style="line-height: 1px;" v-if="route?.params?.levelOneslug == 'marketplace'">Seller
                                Reviews
                            </h5>
                            <h5 style="line-height: 1px;" v-else>Reviews</h5>
                            <star-rating class="custom-star-rating" :star-size="20" :show-rating="false"
                                v-model:rating="form.rating" :animate="false" active-color="#ff6846" />

                        </div>
                        <Error v-if="errors.rating" :message="errors?.rating[0]"></Error>
                        <div class="mb-3 col-md-12 my-3">
                            <label class="form-label" for="basic-default-message"></label>
                            <div class="input-group input-group-merge">
                                <textarea id="basic-default-message" name="comment" v-model="form.comment"
                                    class="form-control my-textarea" placeholder="Brief Description"></textarea>
                            </div>
                            <Error v-if="errors.comment" :message="errors?.comment[0]"></Error>

                        </div>
                        <button type="submit" class="btn btn-primary">Submit Review</button>
                    </form>
                </div>

                <div class="card-body border bottom" v-if="dataNotFound && !itemContainerValidator('automotiveReview')">
                    {{ dataNotFound }}
                </div>
                <div class="card-body border-bottom" v-else v-for="review in data" :key="review"
                    v-if="!itemContainerValidator('automotiveReview')">
                    <div class="d-flex justify-content-between">
                        <div>
                            <h5 class="mb-1">{{
                        review.user.name }} </h5>
                            <small>{{ formatDateTime(review.created_at) }}</small>
                        </div>
                        <div class="d-flex align-items-center">
                            <star-rating :star-size="20" v-model:rating="review.rating" :show-rating="false"
                                :read-only="true" active-color="#ff6846"></star-rating>
                        </div>

                    </div>
                    <p class="mt-2">{{ review.comment }}</p>
                </div>
                <div class="row my-3 mx-1" v-if="!itemContainerValidator('automotiveReview')">
                    <Pagination :meta="meta" @previousPage="previousPage" @nextPage="nextPage" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.my-textarea {
    height: 100px;
    width: 100%;
}

.custom-star-rating :hover {
    background: inherit !important;
}
</style>
