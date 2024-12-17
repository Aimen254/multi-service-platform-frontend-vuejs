<script setup>
import { ref, onMounted, watch, inject, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import ZoomSlider from '@components/core/ZoomSlider.vue';
import { useProductApi } from '@composables/products.js';
import ItemContainer from '@components/general/ItemContainer.vue'
import ProductCard from '@components/core/ProductCard.vue'
import UserProfileHeader from '@components/general/UserProfileHeader.vue';
import BusinessDetailCard from '@components/general/BusinessDetailCard.vue'
import Reviews from '@components/core/Reviews.vue';
import Comments from '@components/core/Comments.vue';
import AutomotiveFeatures from '@components/core/AutomotiveFeatures.vue';
import ProductFeatures from '@components/general/ProductFeatures.vue'
import ContactForm from '@components/general/ContactForm.vue'
import CalendarEventStatus from '@components/general/CalendarEventStatus.vue'
import { useTagStore } from '@/stores/tags';
import { useModuleSettings } from '@composables/modules'
import { useHelper } from "@composables/helper";
import DetailsPageComments from "@components/core/DetailsPageComments.vue";

const { getImage } = useHelper();
const route = useRoute();
const tagStore = useTagStore();
const { editProduct, relatedItems, attributeTags } = useProductApi();

const eventBus = inject('eventBus')
const products = ref(null);
const relatedProduct = ref([]);
const activeSection = ref('description');
const { productHeading, reviewsType, displayContactForm, itemContainerValidator, productOwnerInfoTab, productReviewTab, commentsTabTitle } = useModuleSettings();
const relatedItemsRef = ref(null)
const articalDetail = async () => {
    products.value = null
    relatedProduct.value = []
    const levelOneslug = route.params.levelOneslug;
    const uuid = route.params.uuid;
    const response = await editProduct(levelOneslug, uuid);
    products.value = response

    const params = {
        level_one: products.value?.level_one_tag.id,
        level_two: products.value?.level_two_tag.id,
        level_three: products.value?.level_three_tag.id,
        level_four: products.value?.level_four_tag.id,
        product_id: products.value?.id,
        with_user_address: true
    };
    if (relatedItemsRef.value) {
        await relatedArtical(params);
    }
};

const relatedArtical = async (params) => {
    const response = await relatedItems(params);
    relatedProduct.value = response
};

function toggleSection(section) {
    activeSection.value = section;
}

watch(
    () => route.params,
    (newParams, oldParams) => {
        if (route.name == 'artical-detail') {
            articalDetail()
        }
    }
);

onMounted(async () => {
    eventBus.on('avg_rating', (args) => {
        products.value.business.reviews_avg = args.rating
    })

    // get event status
    eventBus.on('calendar-event-status', (args) => {
        products.value.calendar_event = args.event
    })
    await articalDetail()
});

onBeforeUnmount(async () => {
    eventBus.off('avg_rating')
    eventBus.off('calendar-event-status')
});

</script>

<template>
    <div class="row">
        <div class="col-md-8" :class="{ 'my-2': route?.params?.levelOneslug === 'marketplace' }">
            <div :class="{ 'product-detail-heading': displayContactForm }">
                <h4 class="text-capitalize">{{ route?.params?.levelOneslug }}</h4>
            </div>
            <ZoomSlider :product="products" v-if="products" />
            <div v-if="products">
                <div class="d-flex cursor-pointer my-2">
                    <!-- description tab -->
                    <span>
                        <h5 @click="toggleSection('description')"
                            :class="{ 'active-section': activeSection === 'description' }">
                            Description
                        </h5>
                    </span>

                    <!-- author information tab -->
                    <span v-if="itemContainerValidator('authorInfo')" class="tab-gap">
                        <h5 @click="toggleSection('authorInfo')"
                            :class="{ 'active-section': activeSection === 'authorInfo' }">
                            {{ productOwnerInfoTab }} Info
                        </h5>
                    </span>

                    <span
                        v-if="(itemContainerValidator('authorInfo') && itemContainerValidator('automotivefeatures')) || itemContainerValidator('productFeatures')"
                        class="tab-gap">
                        <h5 @click="toggleSection('features')"
                            :class="{ 'active-section': activeSection === 'features' }">
                            Features
                        </h5>
                    </span>

                    <!-- reviews tab -->
                    <span v-if="itemContainerValidator('reviews')" class="tab-gap">
                        <h5 @click="toggleSection('review')" :class="{ 'active-section': activeSection === 'review' }">
                            {{ productReviewTab }}
                        </h5>
                    </span>

                    <!-- comments tab -->
                    <span v-if="itemContainerValidator('commentsComponent') && products.is_commentable" class="tab-gap">
                        <h5 @click="toggleSection('comments')"
                            :class="{ 'active-section': activeSection === 'comments' }">
                            {{ commentsTabTitle }}
                        </h5>
                    </span>

                    <!-- status tab -->
                    <span v-if="itemContainerValidator('calendarEvents') && products?.calendar_event" class="tab-gap">
                        <h5 @click="toggleSection('calendarEventsStatus')"
                            :class="{ 'active-section': activeSection === 'calendarEventsStatus' }">
                            Status
                        </h5>
                    </span>
                </div>

                <div v-if="activeSection === 'description'">
                    <p v-html="products.vehicle.sellers_notes" class="nav-link"
                        v-if="itemContainerValidator('sellerNotes')"></p>
                    <p v-html="products.description" class="nav-link" v-else></p>

                    <div v-if="itemContainerValidator('events')">
                        <DetailsPageComments :comments="products.comments"></DetailsPageComments>
                    </div>

                </div>
                <div v-if="activeSection === 'authorInfo'">
                    <UserProfileHeader v-if="products.user && !itemContainerValidator('productHasBusinessAndUser')"
                        :user="products.user" />
                    <BusinessDetailCard v-if="products.business" :business="products.business" :user="products.user" />
                </div>
                <div v-if="activeSection === 'review'">
                    <Reviews :product="products" :type="reviewsType" />
                </div>
                <div v-if="activeSection === 'comments' && itemContainerValidator('comments')">
                    <Comments :product="products"></Comments>
                </div>
                <div v-if="activeSection === 'features' && itemContainerValidator('automotivefeatures')">
                    <AutomotiveFeatures :features="attributeTags" :product="products" :vehicle="products.vehicle" />
                </div>
                <div v-if="activeSection === 'features' && itemContainerValidator('productFeatures')">
                    <ProductFeatures :features="attributeTags" />
                </div>
                <div
                    v-if="activeSection === 'calendarEventsStatus' && itemContainerValidator('calendarEvents') && products?.calendar_event">
                    <CalendarEventStatus :product="products" />
                </div>
            </div>
        </div>

        <!--        <div class="col-md-4" v-if="tagStore.getLevelOneTagSlug === 'events'">-->
        <!--            <BuyTicket v-if="products" :product="products" />-->
        <!--        </div>-->

        <ContactForm v-if="displayContactForm && products" :product="products" />

    </div>

    <div v-if="itemContainerValidator('related')" ref="relatedItemsRef">
        <ItemContainer v-if="relatedProduct.length > 0">
            <template #heading>
                <div class="py-3 d-flex justify-content-between align-items-center">
                    <h4 class="text-capitalize ">{{ `Related ${route?.params?.levelOneslug}` }}</h4>
                </div>
            </template>

            <template #content>
                <div class="row">
                    <div class="col-lg-3 col-xxl-3 col-md-6 col-sm-12" v-for="product in relatedProduct" :key="product">
                        <ProductCard :product="product" />
                    </div>
                </div>
            </template>

        </ItemContainer>
    </div>
</template>

<style scoped>
.active-section {
    color: #FF6846 !important;
}

.tab-gap {
    margin-left: 3rem !important;
}
</style>