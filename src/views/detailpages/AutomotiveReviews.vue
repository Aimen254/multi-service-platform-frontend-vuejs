<script setup>
import StarRating from 'vue-star-rating';
import { useTagStore } from '@stores/tags';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import Select2 from 'vue3-select2-component';
import { useUserStore } from '@stores/user';
import { ref, onMounted, computed } from 'vue';
import { reviews } from '@composables/reviews.js';
import Error from '@components/core/Error.vue';
import Pagination from '@components/core/Pagination.vue'
import { useHelper } from '@composables/helper'
import { useModuleSettings } from '@composables/modules'
const { itemContainerValidator } = useModuleSettings();

const { resetStringFormat } = useHelper();
const { automotiveReviews, Makers, automotiveData, automotiveLevel2, getreviews, errors, ratings, updateOrCreateReviews, data, product_year, rating, meta } = reviews();
const userStore = useUserStore();

const reviewesRef = ref(null);
const currentPage = ref(1);
const limit = ref(4)
const selectedYear = ref()
const ShowButton = ref(false)

const tagStore = useTagStore();
const form = ref({
    comment: '',
    exterior_styling: '',
    interior_design: '',
    make_id: '',
    model_id: '',
    comfort: '',
    overall_rating: '',
    performance: '',
    reliability: '',
    title: '',
    type: 'product',
    user_id: userStore.user.id,
    value_for_the_money: '',
    year: selectedYear.value,
    module_id: tagStore.getLevelOneTagId
});

const showSearchingForm = ref(true);
const isRatingForm = ref(false);
const showTable = ref(false);

const review = async () => {
    automotiveReviews(tagStore.getLevelOneTagSlug);
}

const ReviewsApi = async () => {
    await getreviews(tagStore.getLevelOneTagId, {
        type: 'product',
        make_id: form.value.make_id,
        model_id: form.value.model_id,
        limit: limit.value,
        page: currentPage.value,
        limitedData: true,
    });
}

const getModels = (event) => {
    Makers(event.id);
}
const previousPage = async () => {
    currentPage.value--;
    await ReviewsApi();

}
const nextPage = async () => {
    currentPage.value++;
    await ReviewsApi();

}
const submitReview = async () => {
    const response = await updateOrCreateReviews({ ...form.value}, tagStore.getLevelOneTagId, reviewesRef.value);
    await search();
    isRatingForm.value = Object.keys(errors.value).length > 0;
    form.value = errors.value ? form.value : {};
    showTable.value = Object.keys(errors.value).length === 0;
    showSearchingForm.value = Object.keys(errors.value).length === 0;
    ShowButton.value = true;
    if (response == 200) {
        form.value = ''
        errors.value = {};
    }
}

const showRatingForm = () => {
    isRatingForm.value = true;
    showSearchingForm.value = false
    showTable.value = false

}
const search = async () => {
    showTable.value = errors.value ? true : false;
    ShowButton.value = true;
    await ReviewsApi();
    errors.value = {};

}

onMounted(() => {
    review();
})

</script>

<template>
    <div class="card">
        <div class="card-body">
            <form class="mt-4" @submit.prevent="search" v-if="showSearchingForm">
                <div class="row">
                    <div class="col-md-6">
                        <Select2 v-model="form.make_id" :options="automotiveData" placeholder="Select Make"
                            @select="getModels"></Select2>
                        <Error v-if="errors?.make_id" :message="errors.make_id[0]"></Error>

                    </div>
                    <div class="col-md-6">
                        <Select2 v-model="form.model_id" :options="automotiveLevel2" placeholder="Select Model">
                        </Select2>
                        <Error v-if="errors?.model_id" :message="errors.model_id[0]"></Error>
                    </div>
                    <button type="submit" class="btn btn-primary my-4">Search</button>
                </div>
            </form>


            <div class="col-md-2">
                <div class="btn btn-primary mb-5" @click="showRatingForm" v-if="ShowButton">Write a Review</div>
            </div>
            <h6 class="my-4 d-flex" v-if="showSearchingForm">
                <div v-if="ratings?.average"> <star-rating star-size="20" v-model:rating="ratings.average"
                        :show-rating="false" :read-only="true" active-color="#ff6846"></star-rating></div>
                <div class="mx-1 my-1">
                    {{ ratings?.average }}
                </div>
            </h6>
            <span v-for="(review, key) in data" :key="key">
                <div v-if="showSearchingForm">

                    <div class="row justify-content-between align-items-center">
                        <div class="col-lg-6 d-flex">
                            <div class="my-1">
                                <h5>{{ review?.user?.name }}</h5>
                            </div>
                            <div class="my-1 mx-2">
                                <div class="d-flex align-items-center">
                                    <star-rating :star-size="20" v-model:rating="review.rating" :show-rating="false"
                                        :read-only="true" active-color="#ff6846"></star-rating>
                                    <span class="mx-2">{{ review?.rating }} </span>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="col-12 my-1">
                            <strong> Title :</strong> {{ review?.vehicle_review?.title }}
                        </div>
                    </div>
                    <!-- <div class="my-1 my-4">
                        <strong> Vehicle Manufacturing Year :</strong> {{ review?.vehicle_review?.year }}
                    </div> -->
                    <div class="my-1">
                        <strong> Comments :</strong> {{ review.comment }}
                    </div>
                </div>

                <div class="row border-bottom my-4" v-if="showTable">
                    <div v-for="(value, key) in review.vehicle_review" :key="key" class="text-capitalize col-3 mb-2">
                        <strong>{{ resetStringFormat(key) }}:</strong> {{ value }}
                    </div>

                </div>


            </span>


            <Pagination :meta="meta" @previousPage="previousPage" @nextPage="nextPage" class="my-3" v-if="showTable" />
            <form v-if="isRatingForm" @submit.prevent="submitReview" class="mt-4">
                <h4>Write a Review </h4>
                <div class="row">
                    <div class="col-md-12 ">
                        <h5 class="mb-1">Comfort</h5>
                        <star-rating class="custom-star-rating mb-2" star-size="20" :show-rating="false"
                            v-model:rating="form.comfort" :animate="false" active-color="#ff6846" />
                    </div>
                    <Error v-if="errors?.comfort" :message="errors.comfort[0]"></Error>
                    <div class="col-md-12 mb-2 my-1 ">
                        <h5 class="mb-1">Interior Design</h5>
                        <star-rating class="custom-star-rating" star-size="20" :show-rating="false"
                            v-model:rating="form.interior_design" :animate="false" active-color="#ff6846" />
                    </div>
                    <Error v-if="errors?.comfort" :message="errors.interior_design[0]"></Error>
                    <div class="col-md-12 mb-2 my-1">
                        <h5 class="mb-1">Exterior Design</h5>
                        <star-rating class="custom-star-rating" star-size="20" :show-rating="false"
                            v-model:rating="form.exterior_styling" :animate="false" active-color="#ff6846" />
                    </div>
                    <Error v-if="errors?.comfort" :message="errors.exterior_styling[0]"></Error>
                    <div class="col-md-12 mb-2 my-1">
                        <h5 class="mb-1">Value For Money</h5>
                        <star-rating class="custom-star-rating" star-size="20" :show-rating="false"
                            v-model:rating="form.value_for_the_money" :animate="false" active-color="#ff6846" />
                    </div>
                    <Error v-if="errors?.value_for_the_money" :message="errors.value_for_the_money[0]"></Error>
                    <div class="col-md-12 mb-2 my-1">
                        <h5 class="mb-1">Performance</h5>
                        <star-rating class="custom-star-rating" star-size="20" :show-rating="false"
                            v-model:rating="form.performance" :animate="false" active-color="#ff6846" />
                    </div>
                    <Error v-if="errors?.performance" :message="errors.performance[0]"></Error>

                    <div class="col-md-12 mb-2 my-1">
                        <h5 class="mb-1">Reliability</h5>
                        <star-rating class="custom-star-rating" star-size="20" :show-rating="false"
                            v-model:rating="form.reliability" :animate="false" active-color="#ff6846" />
                    </div>
                    <Error v-if="errors?.reliability" :message="errors.reliability[0]"></Error>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label required" for="stock">Title</label>
                        <input type="text" id="stock" v-model="form.title"
                            class="form-control is-invalid border border-danger" placeholder="Enter Title" />
                        <Error v-if="errors?.title" :message="errors.title[0]"></Error>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label" for="year">Year</label>
                        <Select2 v-model="form.year" :options="product_year" placeholder="Select Model">
                        </Select2>
                        <Error v-if="errors?.year" :message="errors.year[0]"></Error>
                    </div>
                </div>
                <div class="mb-3 col-md-12 my-3">
                    <label class="form-label required" for="basic-default-message">Comment</label>
                    <div class="input-group input-group-merge">
                        <textarea id="basic-default-message" name="comment" v-model="form.comment"
                            class="form-control my-textarea" placeholder="Write Comment"></textarea>
                    </div>
                    <Error v-if="errors?.comment" :message="errors.comment[0]"></Error>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <button type="submit" class="btn btn-primary">Submit Review</button>
                    </div>
                </div>
            </form>


        </div>
    </div>
</template>


<style scoped lang="scss">
@import '../../assets/scss/main.scss';

::v-deep .select2-container {
    margin: 0;
    width: 100% !important;
    display: inline-block;
    position: relative;
    vertical-align: middle;
    box-sizing: border-box;
}

::v-deep .select2-container--default .select2-selection--single .select2-selection__arrow b {
    margin-top: 3px;
}

::v-deep .select2-container .select2-selection--single {
    box-sizing: border-box;
    cursor: pointer;
    display: block;
    height: 50px;
    user-select: none;
    -webkit-user-select: none;
    border-radius: 6px;
    color: #676767;
    height: calc(1.53em + 0.875rem + 2px);

}

::v-deep .select2-container--default .select2-selection--single .select2-selection__rendered {
    line-height: 2.25rem;
    color: #697a8d;
    padding-left: 0.875rem;
}

.select2-container--default .select2-selection--single .select2-selection__arrow b {
    position: absolute;
    height: 12px;
    width: 17px;
    top: 40%;
    background-repeat: no-repeat;
    background-size: 17px 12px;
}

::v-deep .active .select2-container .select2-selection--single {
    border-color: $primary
}

::v-deep .active .select2-container--default .select2-selection--single .select2-selection__rendered {
    color: $primary;
}

::v-deep .active .select2-container--default .select2-selection--single .select2-selection__arrow b {
    border-color: $primary transparent transparent transparent;
}

.w-100 {
    width: 6.25rem !important
}
</style>