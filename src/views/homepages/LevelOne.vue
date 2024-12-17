<script setup>
// System & Libraries Imports
import { defineAsyncComponent, onMounted, onBeforeUnmount, ref, inject, watch, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'

// Components Imports
import CategoryModal from '@components/general/CategoryModal.vue'
import Pagination from '@components/core/Pagination.vue'
import Slider from '@components/core/Slider.vue'
import FeaturedContainer from '@components/general/FeaturedContainer.vue'
import FeaturedCard from '@components/general/FeaturedCard.vue'
import TagCard from '@components/core/TagCard.vue'
import HorizontalProductsLayout from '@components/general/HorizontalProductsLayout.vue'
import YourEvents from '@components/general/YourEvents.vue'

// Composables Imports
import { useModuleSettings } from '@composables/modules.js'
import { useHelper } from "@composables/helper"
import { useMessage } from "@composables/message.js"
import { useWishlist } from '@/composables/wishlist.js'
import { useProductApi } from '@composables/products.js'
import { useBusinessApi } from '@composables/business.js'
import { useCategoriesApi } from '@composables/categories.js'
import { useTagsApi } from '@composables/tagLevels'
import { useEvents } from '@composables/events.js'

// Stores Imports
import { useTagStore } from '@stores/tags.js'
import { useProductsStore } from '@stores/products'
import { useBusinessStore } from '@stores/business'
import { useHeadlinesStore } from '@stores/headlines.js'
import { dreamCategoriesStore } from '@stores/categories'
import { useFavoriteProudctsStore } from "@stores/favoriteProducts"
import { useUserStore } from "@stores/user";
import { useFavoriteBusinessStore } from "@stores/favoriteBusiness"
import HorizontalAdCard from '@components/general/HorizontalAdCard.vue'
import multiAd from '@/assets/images/Ads/multiAd.png';

// System & Libraries
const route = useRoute();
const $loading = useLoading();
const eventBus = inject('eventBus')

// Composables
const { showLoading, hideLoading, isLevelPages } = useHelper()
const { recordNotFound } = useMessage()
const { wishlist } = useWishlist()
const { getBusinesses } = useBusinessApi()
const { levelTwoTags, levelOneAuthors } = useTagsApi();
const { getProducts, headlineProducts } = useProductApi()
const { getMyCategories, dataNotFound } = useCategoriesApi()
const { events, getCalendarEvents } = useEvents()
const { productHeading, author, itemContainerValidator, showHeadlines, popularSectionTitle, showFeaturedBusiness, bookmarkedModuleTitle, bookmarkedBusinessTitle } = useModuleSettings()

// Stores
const tagStore = useTagStore()
const userStore = useUserStore()
const productStore = useProductsStore()
const businessStore = useBusinessStore()
const headlineStore = useHeadlinesStore()
const categoriesStore = dreamCategoriesStore()
const favoriteProductsStore = useFavoriteProudctsStore()
const favoriteBusinessStore = useFavoriteBusinessStore()

// Data Properties
const currentPage = ref(1);
const todaysComponentRef = ref(null)
const popularComponentRef = ref(null)
const popularMakesRef = ref(null)
const bodyStylesRef = ref(null)
const bookmarkedComponentRef = ref(null)
const bookmarkedBusinessComponentRef = ref(null)
const featuredComponentRef = ref(null)
const latestComponentRef = ref(null)
const favoriteAuthorComponentRef = ref(null)
const myCategoriesComponentRef = ref(null)
const bookmarkTaskerRef = ref(null)
const recentlyViewedRef = ref(null)
const weeklyComponentRef = ref(null)
const latestTagsProductsRef = ref(null)
const bookmarkedTagsProductsRef = ref(null)
const bookmarkedTagsProducts = ref([])
const featuredListingComponentRef = ref(null)
const bookmarkedListingForSaleRef = ref(null)
const bookmarkedListingForRentRef = ref(null)
const regionsRef = ref(null)
const displayAdBar = ref(false)
const levelAuthors = ref([])
const calendarViewName = ref('This Week')

// regions data array ref
const regions = ref([])

// state management of lazy loading components
const componentStates = ref({
    todaysComponent: false,
    popularComponent: false,
    bookmarkedComponent: false,
    bookmarkedBusinessComponent: false,
    favoriteAuthorComponent: false,
    myCategoriesComponent: false,
    latestComponent: false,
    bookmarkTasker: false,
    weeklyComponent: false,
    bookmarkTagsProductsComponent: false,
    featuredListingForRentComponent: false,
    bookmarkedListingForSaleComponent: false,
    bookmarkedListingForRentComponent: false,
    regionsComponent: false,
});

// get featured users
const getFeaturedUsers = async () => {
    let params = {
        withProducts: true,
        unique_users: true,
        withBusiness: itemContainerValidator.value('featuredAgents') ? true : false
    };
    if (tagStore.getLevelOneTagSlug == 'taskers') {
        params.getLevelTags = true;
    }
    await levelTwoTags(tagStore.getLevelOneTagId, params);
    levelAuthors.value = levelOneAuthors.value
}

const getVehicleTags = async (type, limit = 6, pagination = false, component) => {
    const loader = $loading.show({
        container: component,
        color: '#ff6846',
    });
    await levelTwoTags(tagStore.getLevelOneTagId, { limit: limit, type: type, pagination: pagination }, false);
    loader.hide();
}

/*
*  Async components start
*/
const ItemContainer = defineAsyncComponent(() =>
    import('@components/general/ItemContainer.vue')
)

const ProductCard = defineAsyncComponent(() =>
    import('@components/core/ProductCard.vue')
)

const MyCategories = defineAsyncComponent(() =>
    import('@components/general/MyCategories.vue')
)

const BusinessCard = defineAsyncComponent(() =>
    import('@components/core/BusinessCard.vue')
)
/*
*  Async components end
*/


// mange prious page
const previousPage = async () => {
    currentPage.value--;
    await getCategories(myCategoriesComponentRef.value, currentPage.value)
}

// manage next page
const nextPage = async () => {
    currentPage.value++;
    await getCategories(myCategoriesComponentRef.value, currentPage.value)
}

// get headlines
const getHeadlines = async () => {
    await headlineProducts(tagStore.getLevelOneTagId, null, false)
}

// get faetured products
const featuredProducts = async (type = null, component = null) => {
    const loader = component ? $loading.show({
        container: component,
        color: '#ff6846',
    }) : '';
    await getProducts(tagStore.getLevelOneTagSlug, { is_featured: true, limit: 4, with_user_address: true, type: type }, true);
    component ? loader.hide() : ''
}

// get today's products
const todayProducts = async (component) => {
    const loader = $loading.show({
        container: component,
        color: '#ff6846',
    });
    await getProducts(tagStore.getLevelOneTagSlug, { today_created: true, limit: 4, with_user_address: true }, true)
    loader.hide()
}

//get bookmarked products
const bookmarkedProducts = async (component, type = null) => {
    const loader = $loading.show({
        container: component,
        color: '#ff6846',

    });
    await wishlist({ limit: 4, type: 'product', module: tagStore.getLevelOneTagSlug, with_user_address: true, listing_type: type }, 'product', false)
    loader.hide()
}

const bookmarkedTaskers = async (component) => {
    const loader = $loading.show({
        container: component,
        color: '#ff6846',

    });
    await wishlist({ limit: 4, type: 'user', module: tagStore.getLevelOneTagId, with_user_address: true, user_id: userStore.user.id }, 'user', false)
    loader.hide()
}

// get bookmarked business
const bookmarkedBusiness = async (component) => {
    const loader = $loading.show({
        container: component,
        color: '#ff6846',

    });
    await wishlist({ limit: 4, type: 'business', module: tagStore.getLevelOneTagSlug }, 'business', false)
    loader.hide()
}

// get popular products
const popularProducts = async (component) => {
    const loader = $loading.show({
        container: component,
        color: '#ff6846',

    });
    await getProducts(tagStore.getLevelOneTagSlug, { popular_product: true, limit: 4, with_user_address: true }, true)
    loader.hide()
}

// get favorite reporter's products
const favoriteReporters = async (component) => {
    const loader = $loading.show({
        container: component,
        color: '#ff6846',

    });
    await getProducts(tagStore.getLevelOneTagSlug, { favorite_users: true, latest: true, limit: 4, with_user_address: true }, true)
    loader.hide()
}

// get categories
const getCategories = async (component, page) => {
    try {
        const loader = $loading.show({
            container: component,
            color: '#ff6846',
        });
        const result = await getMyCategories(tagStore.getLevelOneTagSlug, page, false)
        loader.hide()
    } catch (error) {
        loader.hide()
        toast(error, 'error')
    }
}

//get latest proudcts
const latestProducts = async (component) => {
    const loader = $loading.show({
        container: component,
        color: '#ff6846',

    });
    await getProducts(tagStore.getLevelOneTagSlug, { latest: true, limit: 4, with_user_address: true }, true)
    loader.hide()
}

// get recently viewd products
const recentlyViewedProducts = async (component) => {
    const loader = $loading.show({
        container: component,
        color: '#ff6846'
    })
    await getProducts(tagStore.getLevelOneTagSlug, { with_user_address: true, recently_viewed: true, limit: 4 }, true)
    loader.hide()
}

// get featured businesses
const getFeaturedBusiness = async () => {
    await getBusinesses(tagStore.getLevelOneTagSlug, {
        is_featured: true,
        withLevelTwoTags: true,
        limit: 8
    }, false)
}

// get weekly products
const getWeeklyProducts = async (component) => {
    const loader = $loading.show({
        container: component,
        color: '#ff6846'
    })
    await getProducts(tagStore.getLevelOneTagId, { weekly_products: true, limit: 6 }, true)
    loader.hide()
}

const getLevelTwoLatestProducts = async () => {
    const latest = await levelTwoTags(tagStore.getLevelOneTagId, { 'latest': true, 'withProducts': true, 'productLimit': 4 }, false);
}

const getBookmarkedTagsProducts = async (component) => {
    const loader = $loading.show({
        container: component,
        color: '#ff6846'
    })
    bookmarkedTagsProducts.value = await levelTwoTags(tagStore.getLevelOneTagId, { 'favoriteProducts': true, 'withProducts': true, 'productLimit': 4 }, false);
    loader.hide()
}

// get regions
const getRegions = async (component) => {
    const loader = $loading.show({
        container: component,
        color: '#ff6846'
    })
    const tags = await levelTwoTags(tagStore.getLevelOneTagId, { withChildrens: true, regions: true }, false)

    // get unique childrens and merge them
    // let mergeRegionsObjects = new Set(tags.flatMap(obj => obj.childrens.map(child => JSON.stringify(child))));
    // let mergedChildren = Array.from(mergeRegionsObjects).map(child => JSON.parse(child));
    regions.value = tags
    loader.hide()
}

// get booked events
const getMyEvents = async (module, type = 'week', start = null, end = null, container = null) => {
    await getCalendarEvents(module, { limit: 30, type: type, start: start, end: end }, container)
}

// open add category modal
const addCategory = () => {
    eventBus.emit('openModal');
}

// check an item is in the viewport or not
const isComponentInViewport = (componentRef, componentName) => {
    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                loadComponent(componentName, componentRef);
                observer.disconnect();
            } else {
                componentRef.value.classList.add('h-50')
            }
        },
        { root: null, threshold: 0.25, once: true }
    );
    observer.observe(componentRef.value);
};

// Implement component loading logic here
const loadComponent = async (componentName, componentRef) => {
    componentStates.value = { ...componentStates.value, [componentName]: true }
    switch (componentName) {
        case 'todaysComponent':
            await todayProducts(componentRef.value)
            break;
        case 'popularComponent':
            await popularProducts(componentRef.value)
            break;
        case 'bookmarkedComponent':
            await bookmarkedProducts(componentRef.value)
            break;
        case 'bookmarkTasker':
            await bookmarkedTaskers(componentRef.value)
            break;
        case 'bookmarkedBusinessComponent':
            await bookmarkedBusiness(componentRef.value)
            break;
        case 'favoriteAuthorComponent':
            await favoriteReporters(componentRef.value)
            break;
        case 'myCategoriesComponent':
            await getCategories(componentRef.value)
            break;
        case 'latestComponent':
            await latestProducts(componentRef.value)
            break;
        case 'recentlyViewedComponent':
            await recentlyViewedProducts(componentRef.value)
            break;
        case 'weeklyComponent':
            await getWeeklyProducts(componentRef.value)
            break;
        case 'popularMakes':
            await getVehicleTags('make', 12, true, popularMakesRef.value);
            break;
        case 'bodyStyles':
            await getVehicleTags('body_style', 12, true, bodyStylesRef.value);
            break;
        case 'bookmarkTagsProductsComponent':
            await getBookmarkedTagsProducts(componentRef.value)
            break;
        case 'featuredListingForRentComponent':
            await featuredProducts('for-rent', componentRef.value)
            break;
        case 'bookmarkedListingForSaleComponent':
            await bookmarkedProducts(componentRef.value, 'for-sale')
            break
        case 'bookmarkedListingForRentComponent':
            await bookmarkedProducts(componentRef.value, 'for-rent')
            break;
        case 'regionsComponent':
            await getRegions(componentRef.value)
            break;
        default:
            break;
    }
    componentRef.value.classList.remove('h-50');
};

// lazy loading components
const checkComponentsInViewport = async () => {
    if (todaysComponentRef.value) {
        isComponentInViewport(todaysComponentRef, 'todaysComponent');
    }

    if (latestComponentRef.value) {
        isComponentInViewport(latestComponentRef, 'latestComponent')
    }

    if (popularComponentRef.value) {
        isComponentInViewport(popularComponentRef, 'popularComponent');
    }

    if (bookmarkedComponentRef.value) {
        isComponentInViewport(bookmarkedComponentRef, 'bookmarkedComponent');
    }

    if (favoriteAuthorComponentRef.value) {
        isComponentInViewport(favoriteAuthorComponentRef, 'favoriteAuthorComponent');
    }

    if (bookmarkedBusinessComponentRef.value) {
        isComponentInViewport(bookmarkedBusinessComponentRef, 'bookmarkedBusinessComponent');
    }

    if (recentlyViewedRef.value) {
        isComponentInViewport(recentlyViewedRef, 'recentlyViewedComponent')
    }

    if (myCategoriesComponentRef.value) {
        isComponentInViewport(myCategoriesComponentRef, 'myCategoriesComponent');
    }
    if (bookmarkTaskerRef.value) {
        isComponentInViewport(bookmarkTaskerRef, 'bookmarkTasker');
    }

    if (weeklyComponentRef.value) {
        isComponentInViewport(weeklyComponentRef, 'weeklyComponent')
    }

    if (popularMakesRef.value) {
        isComponentInViewport(popularMakesRef, 'popularMakes');
    }

    if (bodyStylesRef.value) {
        isComponentInViewport(bodyStylesRef, 'bodyStyles');
    }

    if (bookmarkedTagsProductsRef.value) {
        isComponentInViewport(bookmarkedTagsProductsRef, 'bookmarkTagsProductsComponent');
    }

    if (featuredListingComponentRef.value) {
        isComponentInViewport(featuredListingComponentRef, 'featuredListingForRentComponent')
    }

    if (bookmarkedListingForSaleRef.value) {
        isComponentInViewport(bookmarkedListingForSaleRef, 'bookmarkedListingForSaleComponent')
    }

    if (bookmarkedListingForRentRef.value) {
        isComponentInViewport(bookmarkedListingForRentRef, 'bookmarkedListingForRentComponent')
    }

    if (regionsRef.value) {
        isComponentInViewport(regionsRef, 'regionsComponent')
    }

}

onBeforeMount(async () => {
    if (tagStore.getLevelOneTagId) {
        dataNotFound.value = null
        productStore.removeProducts()
        businessStore.removeBusiness()
        categoriesStore.removeAllCategories()
        tagStore.removeLatestLevelTwoProducts()
        await favoriteProductsStore.removeFavoriteProducts()
        await favoriteBusinessStore.removeFavoriteBusiness()
        await headlineStore.removeHeadLines()
        if (itemContainerValidator.value('featuredUsers')) {
            await getFeaturedUsers()
        }
        // showing loader
        !itemContainerValidator.value('horizontalProductsLayout') ? showLoading() : ''
        if (showFeaturedBusiness()) {
            await getFeaturedBusiness()
        }
        if (showHeadlines()) {
            await getHeadlines()
        }
        if (itemContainerValidator.value('featuredProducts')) {
            await featuredProducts()
        }

        if (itemContainerValidator.value('latestTagsProducts')) {
            await getLevelTwoLatestProducts()
        }

        // featured products by type for sale
        if (itemContainerValidator.value('featuredProductsByType')) {
            featuredComponentRef.value?.classList.remove('h-50');
            await featuredProducts('for-sale')
        }

        if (productStore.getFeaturedProducts?.length === 0) {
            if (!itemContainerValidator.value('horizontalProductsLayout')) {
                featuredComponentRef.value?.classList.remove('h-50');
            }
        }
        if (tagStore.getLatestLevelTwoTagsProducts.length === 0) {
            if (!itemContainerValidator.value('horizontalProductsLayout')) {
                latestTagsProductsRef.value?.classList.remove('h-50');
            }
        }

        if (itemContainerValidator.value('yourEvents')) {
            await getMyEvents(route.params?.levelOneslug)
        }

        !itemContainerValidator.value('horizontalProductsLayout') ? hideLoading() : ''
        await checkComponentsInViewport()
        eventBus.on('bookmark-tags-products', async () => {
            if (bookmarkedTagsProductsRef.value) {
                await getBookmarkedTagsProducts(bookmarkedTagsProductsRef.value)
            }
        })

        // calendar view name
        eventBus.on('calendar-view-name', async (args) => {
            calendarViewName.value = args?.view === 'month' ? 'This Month' : 'This Week'
            await getMyEvents(route.params?.levelOneslug, args.view, args?.start, args?.end, args?.elementRef)
        })

        // call api if event bookmarked
        eventBus.on('bookmarked-events', async () => {
            showLoading()
            await getMyEvents(route.params?.levelOneslug, 'week', null, null)
            hideLoading()
        })
    }
})

onBeforeUnmount(() => {
    eventBus.off('bookmark-tags-products'); // Remove the event listener
    eventBus.off('calendar-view-name')
    eventBus.off('bookmarked-events')
});

// watch on routes to change level one content
watch(
    async () => route.params,
    async (newParams, oldParams) => {
        if (route?.name == 'level-one-page') {
            levelAuthors.value = []
            dataNotFound.value = null
            productStore.removeProducts()
            businessStore.removeBusiness()
            categoriesStore.removeAllCategories()
            await favoriteProductsStore.removeFavoriteProducts()
            await favoriteBusinessStore.removeFavoriteBusiness()
            await headlineStore.removeHeadLines()
            !itemContainerValidator.value('horizontalProductsLayout') ? showLoading() : ''
            if (showFeaturedBusiness()) {
                await getFeaturedBusiness()
            }
            if (showHeadlines()) {
                await getHeadlines()
            }
            if (itemContainerValidator.value('featuredProducts')) {
                await featuredProducts()
            }

            // featured products by type for sale
            if (itemContainerValidator.value('featuredProductsByType')) {
                featuredComponentRef.value.classList.remove('h-50');
                await featuredProducts('for-sale')
            }

            if (itemContainerValidator.value('latestTagsProducts')) {
                await getLevelTwoLatestProducts()
            }

            if (productStore.getFeaturedProducts.length === 0) {
                if (!itemContainerValidator.value('horizontalProductsLayout')) {
                    featuredComponentRef.value.classList.remove('h-50');
                }
            }

            if (tagStore.getLatestLevelTwoTagsProducts.length === 0) {
                if (!itemContainerValidator.value('horizontalProductsLayout')) {
                    latestTagsProductsRef.value.classList.remove('h-50');
                }
            }
            if (itemContainerValidator.value('yourEvents')) {
                await getMyEvents(route.params?.levelOneslug)
            }
            !itemContainerValidator.value('horizontalProductsLayout') ? hideLoading() : ''
            await checkComponentsInViewport()
        }
    })

</script>

<template>
    <div>
        <div v-if="!itemContainerValidator('horizontalProductsLayout')">
            <!-- headlines section -->
            <div class="row" v-if="headlineStore.getPrimaryHeadline">
                <div class="col-md-6">
                    <div v-if="headlineStore.getPrimaryHeadline" class="h-100 primary-headline-padding-bottom">
                        <Slider :product="headlineStore.getPrimaryHeadline" />
                    </div>
                    <div v-else>
                        {{ recordNotFound() }}
                    </div>
                </div>
                <FeaturedContainer
                    v-if="headlineStore.getSecondaryHeadline.length > 0 && headlineStore.getPrimaryHeadline">
                    <template v-slot:header>
                    </template>

                    <template v-slot:content>
                        <div class="col-md-6">
                            <div v-for="product in headlineStore.getSecondaryHeadline" :key="product.id">
                                <FeaturedCard :product="product" />
                            </div>
                        </div>
                    </template>
                </FeaturedContainer>
            </div>

            <!-- events calender -->
            <div v-if="itemContainerValidator('yourEvents')">
                <ItemContainer>

                    <template #heading>
                        <div class="d-flex mb-3 my-4 justify-content-between align-items-center">
                            <h4 class="text-capitalize  ">Your Events - {{ calendarViewName }}</h4>
                        </div>
                    </template>

                    <template #content>
                        <div class="row mb-2">
                            <div class="col-12">
                                <YourEvents :events="events" />
                            </div>
                        </div>
                    </template>
                </ItemContainer>

            </div>
            <!-- featured businesses section -->
            <div v-if="businessStore?.getFeaturedBusiness?.length > 0">
                <ItemContainer>

                    <template #heading>
                        <div class="d-flex mb-3 my-4 justify-content-between align-items-center">
                            <h4 class="text-capitalize  ">Featured {{ author }}</h4>
                            <router-link
                                :to="{ name: 'featured-businesses', params: { levelOneslug: tagStore?.getLevelOneTagSlug } }"
                                class="menu-link">
                                <div class="btn btn-outline-primary  mb-2" data-i18n="Featured">View All</div>
                            </router-link>
                        </div>
                    </template>

                    <template #content>
                        <div class="row mb-2">
                            <div class="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4"
                                v-if="businessStore.getFeaturedBusiness.length > 0"
                                v-for="business in businessStore.getFeaturedBusiness" :key="business">
                                <BusinessCard :business="business" />
                            </div>
                            <div v-else>
                                {{ recordNotFound() }}
                            </div>
                        </div>
                    </template>
                </ItemContainer>
            </div>

            <!-- featured users section -->
            <FeaturedContainer v-if="itemContainerValidator('featuredUsersLevelOne')">

                <template #header>
                    <h4 class="text-capitalize mt-4">
                        {{ itemContainerValidator('featuredAgents') ? `Featured Agents` : `Featured ${(author)}` }}
                    </h4>
                </template>

                <template #content>
                    <div class="row">
                        <div class="col-sm-12 col-md-6 col-xl-4 col-lg-6" v-for="user in levelAuthors" :key="user.id">
                            <FeaturedCard :product="user" :type="'user'" />
                        </div>
                    </div>
                </template>
            </FeaturedContainer>

            <!-- featured products section -->
            <div ref="featuredComponentRef" class="h-50">
                <ItemContainer v-if="itemContainerValidator('featuredProducts')">

                    <template #heading>
                        <div class="d-flex mb-3  my-4 justify-content-between align-items-center">
                            <h4 class="text-capitalize  ">Featured {{ productHeading }}</h4>
                            <router-link
                                :to="{ name: 'featured', params: { levelOneslug: tagStore?.getLevelOneTagSlug } }"
                                v-if="productStore?.getFeaturedProducts?.length > 0" class="menu-link">
                                <div class="btn btn-outline-primary  mb-2" data-i18n="Featured">View All</div>
                            </router-link>
                        </div>
                    </template>

                    <template #content>
                        <div class="row mb-2">
                            <div class="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4"
                                v-if="productStore.getFeaturedProducts.length > 0"
                                v-for="product in productStore.getFeaturedProducts" :key="index">
                                <ProductCard :product="product" />
                            </div>
                            <div v-else>
                                {{ recordNotFound() }}
                            </div>
                        </div>
                    </template>
                </ItemContainer>
            </div>
            <!-- Ads for takser section  -->
            <div class="col-lg-12 col-md-12 col-sm-12 my-3">
                <div v-show="!(route.params?.levelOneslug === 'obituaries')">
                    <Transition :duration="550">
                        <HorizontalAdCard class="card-container slide-fade" :imgsrc="multiAd" />
                    </Transition>
                </div>
            </div>

            <!-- featured products/listings for sale -->
            <div class="h-50" v-if="itemContainerValidator('featuredProductsByType')">
                <ItemContainer>

                    <template #heading>
                        <div class="d-flex mb-3  my-4 justify-content-between align-items-center">
                            <h4 class="text-capitalize  ">Featured {{ productHeading }} For Sale</h4>
                            <router-link
                                :to="{ name: 'featured', params: { levelOneslug: tagStore?.getLevelOneTagSlug, type: 'for-sale' } }"
                                v-if="productStore.getFeaturedProductsForSale.length > 0" class="menu-link">
                                <div class="btn btn-outline-primary  mb-2" data-i18n="Featured">View All</div>
                            </router-link>
                        </div>
                    </template>

                    <template #content>
                        <div class="row mb-2">
                            <div class="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4"
                                v-if="productStore.getFeaturedProductsForSale.length > 0"
                                v-for="product in productStore.getFeaturedProductsForSale" :key="index">
                                <ProductCard :product="product" />
                            </div>
                            <div class="mb-4" v-else>
                                {{ recordNotFound() }}
                            </div>
                        </div>
                    </template>
                </ItemContainer>
            </div>

            <!-- featured products/listings for rent -->
            <div style="position: relative;" v-if="itemContainerValidator('featuredProductsByType')">
                <div class="h-50" ref="featuredListingComponentRef">
                    <ItemContainer v-if="componentStates.featuredListingForRentComponent">

                        <template #heading>
                            <div class="d-flex mb-3 my-4 justify-content-between align-items-center">
                                <h4 class="text-capitalize  ">Featured {{ productHeading }} For Rent</h4>
                                <router-link
                                    :to="{ name: 'featured', params: { levelOneslug: tagStore?.getLevelOneTagSlug, type: 'for-rent' } }"
                                    v-if="productStore.getFeaturedProductsForRent.length > 0" class="menu-link">
                                    <div class="btn btn-outline-primary  mb-2" data-i18n="Featured">View All</div>
                                </router-link>
                            </div>
                        </template>

                        <template #content>
                            <div class="row mb-2">
                                <div class="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4"
                                    v-if="productStore.getFeaturedProductsForRent.length > 0"
                                    v-for="product in productStore.getFeaturedProductsForRent" :key="index">
                                    <ProductCard :product="product" />
                                </div>
                                <div class="mb-4" v-else>
                                    {{ recordNotFound() }}
                                </div>
                            </div>
                        </template>
                    </ItemContainer>
                </div>
            </div>

            <!-- bookmarkes products/listings for sale -->
            <div style="position: relative;" v-if="itemContainerValidator('bookmarkProductsByType')">
                <div ref="bookmarkedListingForSaleRef" class="h-50">
                    <ItemContainer v-if="componentStates.bookmarkedListingForSaleComponent">

                        <template #heading>
                            <div class="d-flex mb-3  my-4  justify-content-between align-items-center">
                                <h4 class="text-capitalize">Bookmarked {{ productHeading }} For Sale</h4>
                                <router-link
                                    :to="{ name: 'bookmarks', params: { levelOneslug: tagStore?.getLevelOneTagSlug, type: 'for-sale' } }"
                                    v-if="favoriteProductsStore.getBookmarkedForSale.length > 0" class="menu-link">
                                    <div class="btn btn-outline-primary  mb-2" data-i18n="Featured">View All</div>
                                </router-link>
                            </div>
                        </template>

                        <template #content>
                            <div class="row mb-2">
                                <div class="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4 "
                                    v-if="favoriteProductsStore.getBookmarkedForSale.length > 0"
                                    v-for="bookmarked in favoriteProductsStore.getBookmarkedForSale" :key="bookmarked">
                                    <ProductCard :product="bookmarked.product" />
                                </div>
                                <div class="mb-4" v-else>
                                    {{ recordNotFound() }}
                                </div>
                            </div>
                        </template>
                    </ItemContainer>
                </div>
            </div>

            <!-- bookmarkes products/listings for Rent -->
            <div style="position: relative;" v-if="itemContainerValidator('bookmarkProductsByType')">
                <div ref="bookmarkedListingForRentRef" class="h-50">
                    <ItemContainer v-if="componentStates.bookmarkedListingForRentComponent">

                        <template #heading>
                            <div class="d-flex mb-3  my-4  justify-content-between align-items-center">
                                <h4 class="text-capitalize">Bookmarked {{ productHeading }} For Rent</h4>
                                <router-link
                                    :to="{ name: 'bookmarks', params: { levelOneslug: tagStore?.getLevelOneTagSlug, type: 'for-rent' } }"
                                    v-if="favoriteProductsStore.getBookmarkedForRent.length > 0" class="menu-link">
                                    <div class="btn btn-outline-primary  mb-2" data-i18n="Featured">View All</div>
                                </router-link>
                            </div>
                        </template>

                        <template #content>
                            <div class="row mb-2">
                                <div class="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4 "
                                    v-if="favoriteProductsStore.getBookmarkedForRent.length > 0"
                                    v-for="bookmarked in favoriteProductsStore.getBookmarkedForRent" :key="bookmarked">
                                    <ProductCard :product="bookmarked.product" />
                                </div>
                                <div class="mb-4" v-else>
                                    {{ recordNotFound() }}
                                </div>
                            </div>
                        </template>
                    </ItemContainer>
                </div>
            </div>

            <!-- regions list -->
            <div style="position: relative;" v-if="itemContainerValidator('regions')">
                <div ref="regionsRef" class="h-50">
                    <ItemContainer v-if="componentStates.regionsComponent">

                        <template #content>
                            <div class="row mb-2" v-if="regions.length > 0" v-for="tag in regions" :key="tag">
                                <div class="py-3 d-flex justify-content-between align-items-center">
                                    <h4 class="text-capitalize ">{{ tag.name }} Regions</h4>
                                </div>
                                <div class="col-xl-3 col-lg-4 col-md-6 mb-4" v-if="tag.childrens.length > 0"
                                    v-for="child in tag.childrens" :key="child">
                                    <TagCard :tag="child" :levelTwoTag="tag" tagType="region" />
                                </div>
                                <div v-else>
                                    {{ recordNotFound() }}
                                </div>
                            </div>
                            <div v-else class="mb-2">
                                {{ recordNotFound() }}
                            </div>
                        </template>
                    </ItemContainer>
                </div>
            </div>

            <!-- latest notices with level two tags -->
            <div class="h-50" ref="latestTagsProductsRef">
                <ItemContainer v-if="itemContainerValidator('latestTagsProducts')"
                    v-for="tag in tagStore.getLatestLevelTwoTagsProducts" :key="tag">

                    <template #heading>
                        <div class="d-flex mb-3  my-4  justify-content-between align-items-center">
                            <h4 class="text-capitalize">Latest {{ tag?.name }}</h4>
                            <router-link
                                :to="{ name: 'latest-products', params: { levelOneslug: tagStore?.getLevelOneTagSlug, levelTwoslug: tag.slug } }"
                                v-if="tag.products.length > 0" class="menu-link">
                                <div class="btn btn-outline-primary  mb-2" data-i18n="Featured">View All</div>
                            </router-link>
                        </div>
                    </template>

                    <template #content>
                        <div class="row mb-2">
                            <div class="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4 " v-if="tag.products.length > 0"
                                v-for="product in tag.products" :key="product">
                                <ProductCard :product="product" />
                            </div>
                            <div v-else>
                                {{ recordNotFound() }}
                            </div>
                        </div>
                    </template>
                </ItemContainer>
            </div>

            <!-- book marked products by tags -->
            <div style="position: relative;" v-if="itemContainerValidator('bookmarkTagsProducts')">
                <div ref="bookmarkedTagsProductsRef" class="h-50">
                    <ItemContainer v-if="componentStates.bookmarkTagsProductsComponent"
                        v-for="tag in bookmarkedTagsProducts" :key="tag">

                        <template #heading>
                            <div class="d-flex mb-3  my-4  justify-content-between align-items-center">
                                <h4 class="text-capitalize">Bookmarked {{ tag.name }}</h4>
                                <router-link
                                    :to="{ name: 'bookmarks', params: { levelOneslug: tagStore?.getLevelOneTagSlug, levelTwoslug: tag.slug } }"
                                    v-if="bookmarkedTagsProducts.length > 0" class="menu-link">
                                    <div class="btn btn-outline-primary  mb-2" data-i18n="Featured">View All</div>
                                </router-link>
                            </div>
                        </template>

                        <template #content>
                            <div class="row mb-2">
                                <div class="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4 " v-if="tag.products.length > 0"
                                    v-for="product in tag.products" :key="product">
                                    <ProductCard :product="product" />
                                </div>
                                <div v-else>
                                    {{ recordNotFound() }}
                                </div>
                            </div>
                        </template>
                    </ItemContainer>
                </div>
            </div>

            <!-- bookmarked businesses section -->
            <div style="position: relative;" v-if="itemContainerValidator('bookmarkedBusiness')">
                <div ref="bookmarkedBusinessComponentRef" class="h-50">
                    <ItemContainer v-if="componentStates.bookmarkedBusinessComponent">

                        <template #heading>
                            <div class="d-flex mb-3  my-4  justify-content-between align-items-center">
                                <h4 class="text-capitalize  ">{{ bookmarkedBusinessTitle }}</h4>
                                <router-link v-if="favoriteBusinessStore.getFavoriteBusiness.length > 0"
                                    :to="{ name: 'bookmark-businesses', params: { levelOneslug: tagStore?.getLevelOneTagSlug } }"
                                    class="menu-link">
                                    <div class="btn btn-outline-primary  mb-2" data-i18n="Bookmarked Business">View All
                                    </div>
                                </router-link>
                            </div>
                        </template>

                        <template #content>
                            <div class="row mb-2">
                                <div class="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4"
                                    v-if="favoriteBusinessStore.getFavoriteBusiness"
                                    v-for="favorite in favoriteBusinessStore.getFavoriteBusiness" :key="favorite">
                                    <BusinessCard :business="favorite.business" />
                                </div>
                                <div v-else>
                                    {{ recordNotFound() }}
                                </div>
                            </div>
                        </template>
                    </ItemContainer>
                </div>
            </div>

            <!-- todays products section -->
            <div style="position: relative;" v-if="itemContainerValidator('today')">
                <div ref="todaysComponentRef" class="h-50">
                    <ItemContainer v-if="componentStates.todaysComponent">

                        <template #heading>
                            <div class="py-3  d-flex justify-content-between align-items-center">
                                <h4 class="text-capitalize ">Today's {{ productHeading }}</h4>
                                <router-link
                                    :to="{ name: 'today-articles', params: { levelOneslug: tagStore?.getLevelOneTagSlug } }"
                                    class="menu-link" v-if="productStore.getTodayProducts.length > 0">
                                    <div class="btn btn-outline-primary  mb-2" data-i18n="Today Articles">View All</div>
                                </router-link>
                            </div>
                        </template>

                        <template #content>
                            <div class="row mb-2">
                                <div class="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4"
                                    v-if="productStore.getTodayProducts.length > 0"
                                    v-for="product in productStore.getTodayProducts" :key="product">
                                    <ProductCard :product="product" />
                                </div>
                                <div v-else>
                                    {{ recordNotFound() }}
                                </div>
                            </div>
                        </template>
                    </ItemContainer>
                </div>
            </div>

            <!-- recently viewed products section -->
            <div style="position: relative;" v-if="itemContainerValidator('recentlyViewed')">
                <div ref="recentlyViewedRef" class="h-50">
                    <ItemContainer v-if="componentStates.recentlyViewedComponent">

                        <template #heading>
                            <div class="py-3  d-flex justify-content-between align-items-center">
                                <h4 class="text-capitalize ">Recently Viewed</h4>
                                <router-link
                                    :to="{ name: 'recently-viewed', params: { levelOneslug: tagStore?.getLevelOneTagSlug } }"
                                    class="menu-link" v-if="productStore.getRecentlyViewedProducts.length > 0">
                                    <div class="btn btn-outline-primary  mb-2" data-i18n="Today Articles">View All</div>
                                </router-link>
                            </div>
                        </template>

                        <template #content>
                            <div class="row mb-2">
                                <div class="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4"
                                    v-if="productStore.getRecentlyViewedProducts.length > 0"
                                    v-for="product in productStore.getRecentlyViewedProducts" :key="product">
                                    <ProductCard :product="product" />
                                </div>
                                <div v-else>
                                    {{ recordNotFound() }}
                                </div>
                            </div>
                        </template>
                    </ItemContainer>
                </div>
            </div>

            <!-- latest products section -->
            <div style="position: relative;" v-if="itemContainerValidator('latest')">
                <div ref="latestComponentRef" class="h-50">
                    <ItemContainer v-if="componentStates.latestComponent">

                        <template #heading>
                            <div class="py-3  d-flex justify-content-between align-items-center">
                                <h4 class="text-capitalize ">Latest {{ productHeading }}</h4>
                                <router-link v-if="productStore.getLatestProducts.length > 0"
                                    :to="{ name: 'latest-products', params: { levelOneslug: tagStore?.getLevelOneTagSlug } }"
                                    class="menu-link">
                                    <div class="btn btn-outline-primary  mb-2" data-i18n="Today Articles">View All</div>
                                </router-link>
                            </div>
                        </template>

                        <template #content>
                            <div class="row mb-2">
                                <div class="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4"
                                    v-if="productStore.getLatestProducts.length > 0"
                                    v-for="product in productStore.getLatestProducts" :key="product">
                                    <ProductCard :product="product" />
                                </div>
                                <div v-else>
                                    {{ recordNotFound() }}
                                </div>
                            </div>
                        </template>
                    </ItemContainer>
                </div>
            </div>

            <!-- bookmarked taskers section -->
            <div style="position: relative;" v-if="itemContainerValidator('authors')">
                <div ref="bookmarkTaskerRef" h-50>
                    <FeaturedContainer v-if="componentStates.bookmarkTasker">

                        <template v-slot:header>
                        </template>

                        <template v-slot:content>
                            <div class="row mb-2" v-if="userStore.getFavoriteUsers.length > 0">
                                <h4 class="text-capitalize mb-4">Bookmarked {{ tagStore.getLevelOneTagSlug }}</h4>
                                <div class="col-md-4 mb-2" v-for="favorite in  userStore.getFavoriteUsers"
                                    :key="favorite">
                                    <FeaturedCard :product="favorite.user" :type="'user'" />
                                </div>

                            </div>
                        </template>
                    </FeaturedContainer>
                </div>
            </div>

            <!-- bookmarked products section -->
            <div style="position: relative;" v-if="itemContainerValidator('bookmarked')">
                <div ref="bookmarkedComponentRef" class="h-50">
                    <ItemContainer v-if="componentStates.bookmarkedComponent">

                        <template #heading>
                            <div class="py-3  d-flex justify-content-between align-items-center">
                                <h4 class="text-capitalize ">{{ bookmarkedModuleTitle }}</h4>
                                <router-link v-if="favoriteProductsStore.getFavoriteProducts.length > 0"
                                    :to="{ name: 'bookmarks', params: { levelOneslug: tagStore?.getLevelOneTagSlug } }"
                                    class="menu-link">
                                    <div class="btn btn-outline-primary  mb-2" data-i18n="Bookmarked">
                                        View All
                                    </div>
                                </router-link>
                            </div>
                        </template>

                        <template #content>
                            <div class="row mb-2">
                                <div class="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4"
                                    v-if="favoriteProductsStore.getFavoriteProducts.length > 0"
                                    v-for="favorite in favoriteProductsStore.getFavoriteProducts" :key="favorite">
                                    <ProductCard :product="favorite.product" />
                                </div>
                                <div v-else>
                                    {{ recordNotFound() }}
                                </div>
                            </div>
                        </template>
                    </ItemContainer>
                </div>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 my-3">
                <div v-show="isLevelPages(route.name) && !(route.params?.levelOneslug === 'obituaries')">
                    <Transition :duration="550">
                        <HorizontalAdCard class="card-container slide-fade" :imgsrc="multiAd" />
                    </Transition>
                </div>
            </div>
            <!-- popular makes section -->
            <div style="position: relative;" v-if="itemContainerValidator('popularMakes')">
                <div ref="popularMakesRef" class="h-50">
                    <ItemContainer v-if="componentStates.popularMakes">

                        <template #heading>
                            <div class="py-3 d-flex justify-content-between align-items-center">
                                <h4 class="text-capitalize ">Popular Makes</h4>
                                <router-link
                                    :to="{ name: 'popular-makes', params: { levelOneslug: tagStore.getLevelOneTagSlug } }"
                                    class="btn btn-outline-primary mb-2">
                                    View All
                                </router-link>
                            </div>
                        </template>

                        <template #content>
                            <div class="row mb-2">
                                <div class="col-xxl-2 col-lg-2 col-md-4 col-sm-6 mb-4"
                                    v-if="tagStore.getPopularMakes.length > 0" v-for="tag in tagStore.getPopularMakes">
                                    <TagCard :tag="tag" tagType="makes" />
                                </div>
                                <div v-else>
                                    {{ recordNotFound() }}
                                </div>
                            </div>
                        </template>
                    </ItemContainer>
                </div>
            </div>

            <!-- body styles section -->
            <div style="position: relative;" v-if="itemContainerValidator('bodyStyles')">
                <div ref="bodyStylesRef" class="h-50">
                    <ItemContainer v-if="componentStates.bodyStyles">

                        <template #heading>
                            <div class="py-3 d-flex justify-content-between align-items-center">
                                <h4 class="text-capitalize ">Body Styles</h4>
                                <router-link
                                    :to="{ name: 'body-styles', params: { levelOneslug: tagStore.getLevelOneTagSlug } }"
                                    class="btn btn-outline-primary mb-2" v-if="tagStore.getBodyStyles.length > 0">
                                    View All
                                </router-link>
                            </div>
                        </template>

                        <template #content>
                            <div class="row mb-2">
                                <div class="col-xxl-2 col-lg-2 col-md-4 col-sm-6 mb-4"
                                    v-if="tagStore.getBodyStyles.length > 0" v-for="tag in tagStore.getBodyStyles">
                                    <TagCard :tag="tag" tagType="body_styles" />
                                </div>
                                <div v-else>
                                    {{ recordNotFound() }}
                                </div>
                            </div>
                        </template>
                    </ItemContainer>
                </div>
            </div>

            <!-- popular products section -->
            <div style="position: relative;" v-if="itemContainerValidator('popular')">
                <div ref="popularComponentRef" class="h-50">
                    <ItemContainer v-if="componentStates.popularComponent">

                        <template #heading>
                            <div class="py-3  d-flex justify-content-between align-items-center">
                                <h4 class="text-capitalize ">{{ popularSectionTitle }}</h4>
                                <router-link v-if="productStore.getPopularProducts.length > 0"
                                    :to="{ name: 'popular', params: { levelOneslug: tagStore?.getLevelOneTagSlug } }"
                                    class="menu-link">
                                    <div v-if="productStore.getPopularProducts.length > 0"
                                        class="btn btn-outline-primary mb-2" data-i18n="Popular">
                                        View All
                                    </div>
                                </router-link>
                            </div>
                        </template>

                        <template #content>
                            <div class="row mb-2">
                                <div class="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4"
                                    v-if="productStore.getPopularProducts.length > 0"
                                    v-for="product in productStore.getPopularProducts" :key="product">
                                    <ProductCard :product="product" />
                                </div>
                                <div v-else>
                                    {{ recordNotFound() }}
                                </div>
                            </div>
                        </template>
                    </ItemContainer>
                </div>
            </div>

            <!-- favorite author products section -->
            <div style="position: relative;" v-if="itemContainerValidator('favoriteAuthors')">
                <div ref="favoriteAuthorComponentRef" class="h-50">
                    <ItemContainer
                        v-if="componentStates.favoriteAuthorComponent && tagStore.getLevelOneTagSlug !== 'taskers'">

                        <template #heading>
                            <div class="py-3 d-flex justify-content-between align-items-center">
                                <h4 class="text-capitalize">Favorite {{ author }}</h4>
                                <router-link v-if="productStore.getFavoriteReporterProducts.length > 0"
                                    :to="{ name: 'favorite-authors', params: { levelOneslug: tagStore.getLevelOneTagSlug } }"
                                    class="btn btn-outline-primary  mb-2">
                                    View All
                                </router-link>
                            </div>
                        </template>

                        <template #content>
                            <div class="row mb-2">
                                <div class="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4"
                                    v-if="productStore.getFavoriteReporterProducts.length > 0"
                                    v-for="product in productStore.getFavoriteReporterProducts" :key="product">
                                    <ProductCard :product="product" />
                                </div>
                                <div v-else>
                                    {{ recordNotFound() }}
                                </div>
                            </div>
                        </template>
                    </ItemContainer>
                </div>
            </div>

            <!-- weekly products section -->
            <div style="position: relative;" v-if="itemContainerValidator('weeklyProducts')">
                <div ref="weeklyComponentRef" class="h-50">
                    <ItemContainer v-if="componentStates.weeklyComponent">

                        <template #heading>
                            <div class="py-3 d-flex justify-content-between align-items-center">
                                <h4 class="text-capitalize">This Week's {{ productHeading }}</h4>
                            </div>
                        </template>

                        <template #content>
                            <div class="row mb-2">
                                <div class="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4"
                                    v-if="productStore.getWeeklyProducts.length > 0"
                                    v-for="product in productStore.getWeeklyProducts" :key="product">
                                    <FeaturedCard :product="product" />
                                </div>
                                <div v-else>
                                    {{ recordNotFound() }}
                                </div>
                            </div>
                        </template>
                    </ItemContainer>
                </div>
            </div>

            <!-- my categories section -->
            <div style="position: relative;" v-if="itemContainerValidator('myCategories')">
                <div ref="myCategoriesComponentRef" class="h-50">
                    <!-- my categories -->
                    <ItemContainer
                        v-if="categoriesStore.getMyCategories.length > 0 && componentStates.myCategoriesComponent">

                        <template #heading>
                            <div class="d-flex align-items-center">
                                <h4 class="text-capitalize" style="padding-top: 6px;">My Categories</h4>
                                <div class="btn btn-outline-primary  ms-5 " @click="addCategory">
                                    <i class='menu-icon tf-icons bx bx-plus'></i>
                                    Add Category
                                </div>
                            </div>
                        </template>

                        <template #content v-if="categoriesStore.getMyCategories.length > 0">
                            <MyCategories v-for="category in categoriesStore.getMyCategories" :key="category"
                                :category="category" />
                            <Pagination :meta="categoriesStore.getMeta" @previousPage="previousPage"
                                @nextPage="nextPage" />
                        </template>
                    </ItemContainer>

                    <!-- display this if not found data -->
                    <ItemContainer
                        v-if="categoriesStore.getMyCategories.length == 0 && componentStates.myCategoriesComponent">

                        <template #heading>
                            <div class="d-flex align-items-center">
                                <h4 class="text-capitalize" style="padding-top: 6px;">My Categories</h4>
                                <div class="btn btn-outline-primary  ms-5 " @click="addCategory">
                                    <i class='menu-icon tf-icons bx bx-plus'></i>
                                    Add Category
                                </div>
                            </div>
                        </template>

                        <template #content>
                            {{ categoriesStore.dataNotFound }}
                        </template>
                    </ItemContainer>
                    <CategoryModal />
                </div>
            </div>
        </div>
        <div v-else>
            <HorizontalProductsLayout />
        </div>
    </div>
</template>

<style scoped>
.h-50 {
    min-height: 50vh !important;
}
</style>
