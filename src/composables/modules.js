import { computed, watch, ref } from "vue"
import { useTagStore } from '@stores/tags.js'
import { useUserStore } from '@stores/user.js'
import { useRoute } from 'vue-router'

export const useModuleSettings = () => {
    const modules = [
        'news',
        'recipes',
        'blogs',
        'obituaries',
        'employment',
        'services',
        'taskers',
        'marketplace'
    ];

    const route = useRoute()
    const todayProductsModules = ['news', 'obituaries'];
    const latestProductsModule = ['blogs', 'recipes'];
    const hideStatus = ['taskers', 'services'];

    const bookmarkedModules = ['news', 'blogs', 'recipes', 'employment', 'taskers', 'marketplace', 'automotive', 'boats', 'obituaries', 'events'];
    const bookmarkedBusinesses = ['employment', 'automotive', 'boats'];


    const contactFormModules = ['employment', 'services', 'taskers', 'marketplace', 'automotive', 'boats', 'real-estate'];
    const priceModules = ['employment', 'services', 'marketplace', 'taskers'];
    const rating = ['blogs', 'recipes', 'taskers'];
    const businessModulesRating = ['services','boats','automotive'];
    const authorModules = ['taskers', 'services'];
    const excludeFeaturedAuthorSection = ['obituaries', 'events'];
    const priceTypeModules = ['employment', 'services', 'employment'];
    const excludeBookmarkedProducts = ['service', 'employment', 'notices'];
    const bookMarkedProductsWithTagsModule = ['notices'];
    const moduleHasRatingAfterTitle = ['automotive', 'boats'];
    const automotiveReviews = ['automotive'];
    const moduleHasPriceAfterTitle = ['marketplace', 'automotive', 'employment', 'services', 'boats', 'taskers', 'real-estate'];
    const priceTypeOptions = ['employment'];
    const featuredLevelTwo = ['events'];
    const location = ['marketplace'];
    const locationFiled = ['marketplace', 'events'];
    const event_date = ['events'];
    const url = ['events'];
    const horizontalAdCard = ['events'];
    const featured_events = ['events'];
    const featuredUsersModules = ['taskers', 'marketplace', 'real-estate'];
    const hasFeaturedUsersLOne = ['marketplace', 'taskers', 'real-estate'];
    const hasFeaturedUsersLThree = ['marketplace', 'taskers', 'real-estate'];
    const favoriteAuthors = ['news', 'blogs', 'recipes', 'marketplace', 'taskers'];
    const hideAuthorOnDetailPage = ['marketplace', 'taskers', 'obituaries', 'services', 'employment'];
    const moduleHasPopularMakes = ['automotive'];
    const moduleHasBodyStyles = ['automotive'];
    const agent = ['real-estate'];
    const alterUserNameModules = ['real-estate'];
    const event_price = ['events']

    // const moduleHasComments = ['marketplace'];
    const moduleHasReviews = ['recipes', 'marketplace', 'services', 'taskers', 'boats', 'automotive'];
    const moduleHasAuthorInfo = ['news', 'recipes', 'blogs', 'employment', 'services', 'automotive', 'boats', 'taskers', 'marketplace', 'real-estate'];

    const moduleHasPrice = ['services', 'marketplace', 'employment', 'taskers', 'automotive', 'boats', 'real-estate', 'events'];
    const moduleHasCryptoCurrency = ['marketplace'];
    const moduleHasDelivery = ['marketplace'];
    const moduleHasStock = [];
    const moduleHasWeight = ['marketplace'];
    const moduleHasAttributeTags = ['marketplace', 'automotive', 'boats', 'real-estate', 'events'];
    const moduleHasDescription = ['notices'];
    const moduleHasFilters = ['automotive', 'boats', 'marketplace', 'retail', 'real-estate'];
    const moduleHasUsers = ['real-estate'];
    const moduleHasUserSettings = ['taskers'];
    const popularProductsModules = ['news', 'blogs', 'recipes'];
    const businessModules = ['services', 'employment', 'automotive', 'boats', 'government', 'real-estate'];
    const productRequestButtonModules = ['services', 'employment', 'taskers', 'real-estate', 'events'];
    const tagsUnderProductTitleModules = ['employment', 'services', 'taskers'];
    const recentltyViewedProductsModules = ['services', 'taskers', 'marketplace', 'events'];
    const locationModules = ['employment', 'services', 'taskers', 'marketplace'];
    const resumeModules = ['employment'];
    const businessModuleHasPhone = ['services', 'automotive', 'real-estate'];
    const excludeComments = ['services', 'employment', 'automotive', 'notices', 'boats'];
    const commentsComponent = ['recipes', 'blogs', 'obituaries', 'marketplace', 'taskers', 'government', 'events'];
    const excludeRelatedSection = ['obituaries', 'employment', 'services', 'taskers', 'marketplace', 'government', 'real-estate', 'events'];
    const weeklyProductsModule = ['obituaries'];
    const commentInProductLsiting = ['obituaries', 'marketplace'];
    const excludeMyCategoriesSection = ['obituaries'];
    const excludePublicProfileSection = ['obituaries', 'notices'];
    const excludeSideBarMycategoriesSection = ['obituaries', 'government']
    const tableWidth = ['taskers'];
    const max_price = ['events'];
    const event_location = ['events'];
    const excludeHorizontalAdCard = ['blogs', 'news','recipes']
    const excludeHorizontalAdCardModule = ['obituaries']
    const excludePublicProfileFields = ['taskers']

    const productYearModules = ['automotive', 'boats'];
    const hideAndShowBusinessModules = ['automotive', 'boats'];
    const myGarageModules = ['automotive', 'boats'];
    const productTypeModules = ['automotive', 'boats', 'real-estate'];
    const tagModules = ['automotive', 'boats', 'events'];
    const ignoredTags = ['automotive', 'boats'];
    const brandTagModules = ['marketplace'];
    const hasBodyStyleModules = ['automotive'];
    const hasNotProductNameModules = ['notices', 'boats'];
    const organizationModules = ['notices'];
    const homeDeliveryModules = ['automotive'];
    const virtualAppointmentModules = ['automotive'];
    const businessProductModules = ['automotive', 'boats'];
    const skuModules = ['automotive'];
    const trimModules = ['automotive', 'boats'];
    const sellerNotesModules = ['automotive', 'boats']
    const stockNoModules = ['automotive']
    const makersModules = ['automotive', 'boats'];
    const latestProductsWithTags = ['notices']
    const changeLevelTwoOnTypeModules = ['notices']
    const modulesHasNotFeatured = ['notices', 'government', 'real-estate']
    const horizontalProductLayoutModules = ['government']
    const excludeBookmarksOnStoreOrAuthorPage = ['taskers', 'automotive', 'services', 'marketplace', 'real-estate'];
    const requiredDescriptionModules = ['notices', 'government'];
    const requiredPriceModules = ['automotive', 'services', 'employment', 'marketplace', 'real-estate', 'boats', 'events'];
    const automotiveFeatures = ['automotive'];
    const optionalProductName = ['government']
    const optionalMainImage = ['government']
    const hidePhoneNoModules = ['employment'];
    const moduleHasNoImage = ['notices', 'employment']
    const pickupLocation = ['marketplace', 'automotive', 'boats']
    const hideBusinessModules = ['government'];
    const hideTitleModules = ['government'];
    const feturedCard = ['taskers'];
    const attributes = ['sku', 'body_styles'];
    const vehicleFeatures = ['type','vin','mileage','stock_no','trim','mpg'];
    const publicProfileModules = ['news', 'blogs', 'recipes', 'marketplace', 'taskers', 'automotive', 'boats'];
    const rowCol = ['taskers'];
    const away_team = ['events'];
    const eventPerformer = ['events'];
    const performer = ['events'];

    // events booking status
    const bookingStatus = ['events'];

    const calendarEvents = ['events']

    const message = ['automotive', 'marketplace', 'employment', 'services', 'events', 'real-estate', 'boats', 'taskers']

    // featured products by type
    const featuredProductsByType = ['real-estate'];

    const bookmarkProductsUserModules = ['news', 'recipes', 'blogs', 'real-estate'];
    const displayCategoryModules = ['real-estate'];
    const hideDateModules = ['obituaries', 'real-estate', 'events'];
    const ownerTypeModules = ['automotive'];
    const displayBusinessOnUserCardModules = ['real-estate'];

    const featuredAgents = ['real-estate'];

    // book mark products by type
    const bookmarkProductsByTyp = ['real-estate'];

    // regions
    const regionModules = ['real-estate']

    // product with business and user
    const productHasBusinessAndUser = ['real-estate', 'events']
    const excludeName = ['events']
    const EventApi = ['events'];

    // product featured
    const productFeatures = ['real-estate']

    // contact agent
    const contactAgent = ['real-estate']

    const minMaxPriceModules = ['real-estate'];

    // show and hide condition module and condition type wise
    const moduleHasCondition = {
        typeAttribute: ['marketplace'],
        typeProduct: ['automotive', 'boats']
    };

    const yourEvents = ['events']

    // order by price
    const orderByPrice = ['events']

    // show and hide data on product card component
    const productCardComponent = {
        showCommentsAndRating: ['recipes'],
        hidePublishDateAndWishlist: ['obituaries', 'real-estate', 'events'],
        hideAuthorInfo: ['obituaries', 'services', 'employment', 'notices'],
        DOBAndDOD: ['obituaries'],
        showRatings: ['marketplace', 'taskers'],
        location: ['taskers', 'services', 'employment'],
        hidePublishDate: ['marketplace', 'automotive', 'notices', 'boats', 'events'],
        productTagsUnderDate: ['notices'],
        productPriceType: ['services', 'taskers', 'employment'],
        productType: ['real-estate'],
        productAgentWithBroker: ['real-estate'],
        displayUsers: ['automotive'],
        displayHrLine: ['events'],
        productBodyBottomPadding: ['events']
    }

    // define aspect ratios for diffrent images
    const productblogImageRatio = '3/2'
    const logoRatio = '1/1'
    const bannerRatio = '3/1'

    // home page or grid view cards
    const businessCardImageRatio = '3/2'

    const tagStore = useTagStore()
    const userStore = useUserStore()

    // get module slug
    const levelOne = ref(route.params?.levelOneslug ? route.params?.levelOneslug : tagStore.getLevelOneTagSlug)
    const levelTwo = ref(route.params?.levelTwoslug ? route.params?.levelTwoslug : tagStore.getLevelTwoTagSlug)
    // product heading according to module
    const productHeading = computed(() => {
        switch (levelOne.value) {
            case 'news':
                return 'Articles';
            case 'blogs':
                return 'Blogs';
            case 'recipes':
                return 'Recipes';
            case 'services':
                return 'Services';
            case 'employment':
                return 'Positions';
            case 'marketplace':
                return 'Items';
            case 'obituaries':
                return 'Obits';
            case 'taskers':
                return 'Tasks';
            case 'automotive':
                return 'Vehicles';
            case 'notices':
                return 'Notices'
            case 'boats':
                return 'Boats';
            case 'government':
                return 'Posts'
            case 'real-estate':
                return 'Listings'
            case 'events':
                return "Events"
        }
    })

    // set author heading name accorindg to module
    const author = computed(() => {
        switch (levelOne.value) {
            case 'news':
                return 'Reporters';
            case 'blogs':
            case 'recipes':
                return 'Authors';
            case 'services':
                return 'Providers';
            case 'employment':
                return 'Employer';
            case 'marketplace':
                return 'Sellers';
            case 'taskers':
                return 'Taskers';
            case 'automotive':
                return 'Dealerships'
            case 'notices':
                return 'Organizations'
            case 'boats':
                return 'Dealerships';
            case 'obituaries':
                return 'Funeral Home';
            case 'government':
                return 'Departments'
            case 'real-estate':
                return 'Brokers'
        }
    })
    const FavoriteAuthor = computed(() => {
        switch (levelOne.value) {
            case 'taskers':
                return 'Bookmark';
            default:
                return 'Favorite';
        }
    });

    const companyTitle = computed(() => {
        switch (levelOne.value) {
            case 'automotive':
            case 'boats':
                return 'Dealerships';
            case 'notices':
                return 'Organization';
            case 'government':
                return 'Department';
            case 'real-estate':
                return 'Brokers';
            default:
                return 'Company';
        }
    });

    const singularCompanyTitle = computed(() => {
        switch (levelOne.value) {
            case 'automotive':
            case 'boats':
                return 'Dealership';
            case 'notices':
                return 'Organization';
            case 'government':
                return 'Department';
            case 'real-estate':
                return 'Broker';
            default:
                return 'Company';
        }
    });

    const singularOwnerTitle = computed(() => {
        switch (levelOne.value) {
            case 'news':
                return 'Reporter';
            case 'blogs':
            case 'recipes':
                return 'Author';
            case 'services':
                return 'Provider'
            case 'employment':
                return 'Employer'
            case 'taskers':
                return 'Tasker'
            case 'marketplace':
                return 'Seller';
            case 'obituaries':
                return 'Funeral Home';
            case 'automotive':
                return 'Seller';
            case 'boats':
                return 'Dealership';
            case 'notices':
                return 'Organization';
            case 'government':
                return 'Department';
            case 'real-estate':
                return 'Broker'
            case 'events':
                return 'Event'
        }
    });

    const bookmarkedModuleTitle = computed(() => {
        switch (levelOne.value) {
            case 'automotive':
            case 'boats':
                return 'Favorite ' + productHeading.value;
            default:
                return 'Bookmarked ' + productHeading.value;
        }
    });

    const bookmarkedBusinessTitle = computed(() => {
        switch (levelOne.value) {
            case 'automotive':
            case 'boats':
                return 'Favorite ' + author.value;
            default:
                return 'Bookmarked ' + author.value;
        }
    });

    const userName = computed(() => {
        switch (levelOne.value) {
            case 'real-estate':
                return 'Agents';
        }
    });

    const singularUserName = computed(() => {
        switch (levelOne.value) {
            case 'real-estate':
                return 'Agent';
        }
    });

    const hideShowItemsOnProductCard = computed(() => (type) => {
        switch (type) {
            case 'commentsAndRatings':
                return productCardComponent.showCommentsAndRating.includes(levelOne.value);
            case 'publishDateAndWishlist':
                return !productCardComponent.hidePublishDateAndWishlist.includes(levelOne.value);
            case 'authorDetails':
                return !productCardComponent.hideAuthorInfo.includes(levelOne.value);
            case 'publishDate':
                return !productCardComponent.hidePublishDate.includes(levelOne.value)
            case 'priceType':
                return productCardComponent.productPriceType.includes(levelOne.value);
            case "showRatings":
                return productCardComponent.showRatings.includes(levelOne.value)
            case 'location':
                return productCardComponent.location.includes(levelOne.value)
            case 'DOB_DOD':
                return productCardComponent.DOBAndDOD.includes(levelOne.value)
            case 'tagsUnderDate':
                return productCardComponent.productTagsUnderDate.includes(levelOne.value)
            case 'type':
                return productCardComponent.productType.includes(levelOne.value)
            case 'userWithBusiness':
                return productCardComponent.productAgentWithBroker.includes(levelOne.value)
            case 'displayUsers':
                return productCardComponent.displayUsers.includes(levelOne.value)
            case 'displayHr':
                return productCardComponent.displayHrLine.includes(levelOne.value)
            case 'bottomPadding':
                return productCardComponent.productBodyBottomPadding.includes(levelOne.value)

        }
    })

    const itemContainerValidator = computed(() => (type, adminSideBarOption = null) => {
        switch (type) {
            case 'today':
                return todayProductsModules.includes(levelOne.value)
            case 'event_price':
                return !event_price.includes(levelOne.value)
            case 'featured-events':
                return featured_events.includes(levelOne.value)
            case 'events_date':
                return event_date.includes(levelOne.value)
            case 'max-price':
                return max_price.includes(levelOne.value)
            case 'url':
                return url.includes(levelOne.value)
            case 'away_team':
                return away_team.includes(levelOne.value)
            case 'event_location':
                return event_location.includes(levelOne.value)
            case 'eventPerformer':
                return eventPerformer.includes(levelOne.value)
            case 'automotivefeatures':
                return automotiveFeatures.includes(levelOne.value)
            case 'latest':
                return latestProductsModule.includes(levelOne.value);
            case 'bookmarked':
                return bookmarkedModules.includes(levelOne.value);
            case 'popular':
                return popularProductsModules.includes(levelOne.value);
            case 'myGarageModules':
                return popularProductsModules.includes(levelOne.value);
            case 'favoriteAuthors':
                return favoriteAuthors.includes(levelOne.value);
            case 'featuredUsersLevelOne':
                return hasFeaturedUsersLOne.includes(levelOne.value);
            case 'featuredUsersLevelThree':
                return hasFeaturedUsersLThree.includes(levelOne.value);
            case 'attributeTags':
                return moduleHasAttributeTags.includes(levelOne.value);
            case 'authorInfo':
                return moduleHasAuthorInfo.includes(levelOne.value);
            case 'hideAuthorInfo':
                return hideAuthorOnDetailPage.includes(levelOne.value);
            case 'reviews':
                return moduleHasReviews.includes(levelOne.value);
            case 'price':
                return moduleHasPrice.includes(levelOne.value);
            case 'conditionTypeAttribute':
                return moduleHasCondition.typeAttribute.includes(levelOne.value);
            case 'conditionTypeProduct':
                return moduleHasCondition.typeProduct.includes(levelOne.value);
            case 'stock':
                return moduleHasStock.includes(levelOne.value);
            case 'weight':
                return moduleHasWeight.includes(levelOne.value);
            case 'description':
                return moduleHasDescription.includes(levelOne.value);
            case 'bookmarkedBusiness':
                return bookmarkedBusinesses.includes(levelOne.value);
            case 'companies':
                return businessModules.includes(levelOne.value)
            case 'resume':
                return resumeModules.includes(levelOne.value)
            case 'recentlyViewed':
                return recentltyViewedProductsModules.includes(levelOne.value)
            case 'location':
                return locationModules.includes(levelOne.value)
            case 'automotiveReviews':
                return locationModules.includes(levelOne.value)
            case 'ratings':
                return rating.includes(levelOne.value)
            case 'noMainImage':
                return moduleHasNoImage.includes(levelOne.value)
            case 'pickup-location':
                return pickupLocation.includes(levelOne.value)
            case 'fetured-card':
                return feturedCard.includes(levelOne.value)
            case 'tableTd':
                return tableWidth.includes(levelOne.value)
            case 'real-estate-agent':
                return userStore.user.user_type != 'agent' && agent.includes(levelOne.value)
            case 'rowCol':
                return rowCol.includes(levelOne.value)
            case 'location':
                return location.includes(levelOne.value)
            case 'location-input':
                return locationFiled.includes(levelOne.value)
            case 'automotiveReview':
                return automotiveReviews.includes(levelOne.value)
            case 'featured-products-LevelTwo':
                featuredLevelTwo.includes(levelOne.value)
            case 'performer':
                performer.includes(levelOne.value)
            case 'excludeName':
                return excludeName.includes(levelOne.value)
            case 'events':
                return EventApi.includes(levelOne.value)
            case 'horizontalAdCard':
                return !excludeHorizontalAdCard.includes(levelOne.value) 
            case 'hideModule':
                return !excludCategory
            case 'locked':
                if (levelOne.value === 'news') {
                    return userStore.user.user_type === 'reporter'
                } else if (businessModules.includes(levelOne.value)) {
                    if (levelOne.value == 'government') {
                        return userStore.user.user_type === 'government_employee'
                    } else if (levelOne.value == 'real-estate') {
                        return (userStore.user.user_type === 'agent' && adminSideBarOption === 'product') || userStore.user.user_type === 'business_owner'
                    }
                    else {
                        return userStore.user.user_type === 'business_owner'
                    }
                } else if (organizationModules.includes(levelOne.value)) {
                    return userStore.user.user_type === 'business_owner'
                } else {
                    return true
                }
            case 'lockedPublicProfile':
                if (levelOne.value === 'news') {
                    return userStore.user.user_type === 'reporter'
                }
                return true;
            case 'businessRating':
                return businessModulesRating.includes(levelOne.value)
            case 'comments':
                return !excludeComments.includes(levelOne.value)
            case 'myCategories':
                return !excludeMyCategoriesSection.includes(levelOne.value);
            case 'featuredAuthors':
                return !excludeFeaturedAuthorSection.includes(levelOne.value);
            case 'commentsComponent':
                return commentsComponent.includes(levelOne.value);
            case 'related':
                return !excludeRelatedSection.includes(levelOne.value)
            case 'authors':
                return authorModules.includes(levelOne.value)
            case 'displayCommentsInProductListing':
                return commentInProductLsiting.includes(levelOne.value);
            case 'publicProfile':
                return excludePublicProfileSection.includes(levelOne.value);
            case 'weeklyProducts':
                return weeklyProductsModule.includes(levelOne.value)
            case 'featuredCardTags':
                return weeklyProductsModule.includes(levelOne.value)
            case 'priceType':
                return priceTypeModules.includes(levelOne.value)
            case 'priceTypeOptions':
                return priceTypeOptions.includes(levelOne.value);
            case 'productType':
                return productTypeModules.includes(levelOne.value);
            case 'productYear':
                return productYearModules.includes(levelOne.value);
            case 'hideAndShowBusiness':
                return hideAndShowBusinessModules.includes(levelOne.value)
            case 'myGarage':
                const userType = userStore.user.user_type;
                return myGarageModules.includes(levelOne.value) && (userType === 'business_owner' || userType === 'customer');
            case 'tags':
                return tagModules.includes(levelOne.value);
            case 'brandTags':
                return brandTagModules.includes(levelOne.value);
            case 'ignoredTags':
                ignoredTags.includes(levelOne.value);
            case 'bodyStyle':
                return hasBodyStyleModules.includes(levelOne.value);
            case 'homeDelivery':
                return homeDeliveryModules.includes(levelOne.value);
            case 'virtualAppointment':
                return virtualAppointmentModules.includes(levelOne.value);
            case 'sku':
                return skuModules.includes(levelOne.value);
            case 'trim':
                return trimModules.includes(levelOne.value);
            case 'businessProducts':
                return businessProductModules.includes(levelOne.value);
            case 'stockNo':
                return stockNoModules.includes(levelOne.value);
            case 'sellerNotes':
                return sellerNotesModules.includes(levelOne.value);
            case 'makers':
                return makersModules.includes(levelOne.value);
            case 'phone':
                return businessModuleHasPhone.includes(levelOne.value);
            case 'ratingAfterTitle':
                return moduleHasRatingAfterTitle.includes(levelOne.value);
            case 'popularMakes':
                return moduleHasPopularMakes.includes(levelOne.value);
            case 'bodyStyles':
                return moduleHasBodyStyles.includes(levelOne.value);
            case 'productName':
                return !hasNotProductNameModules.includes(levelOne.value);
            case 'organization':
                return organizationModules.includes(levelOne.value);
            case 'featuredUsers':
                return featuredUsersModules.includes(levelOne.value);
            case 'latestTagsProducts':
                return latestProductsWithTags.includes(levelOne.value);
            case 'bookmarkTagsProducts':
                return bookMarkedProductsWithTagsModule.includes(levelOne.value);
            case 'changeLevelTwoOnType':
                return changeLevelTwoOnTypeModules.includes(levelOne.value);
            case 'filters':
                return moduleHasFilters.includes(levelOne.value);
            case 'featuredProducts':
                return !modulesHasNotFeatured.includes(levelOne.value);
            case 'horizontalProductsLayout':
                return horizontalProductLayoutModules.includes(levelOne.value);
            case 'hideStatus':
                return !hideStatus.includes(tagStore.getLevelTwoTagSlug);
            case 'sideBarCategories':
                return !excludeSideBarMycategoriesSection.includes(levelOne.value);
            case 'storeOrAuthorBookmarked':
                return !excludeBookmarksOnStoreOrAuthorPage.includes(levelOne.value);
            case 'requiredDescripiton':
                return requiredDescriptionModules.includes(levelOne.value);
            case 'requiredPrice':
                return requiredPriceModules.includes(levelOne.value);
            case 'optionalProductName':
                return !optionalProductName.includes(levelOne.value);
            case 'optionalMainImage':
                return !optionalMainImage.includes(levelOne.value);
            case 'hidePhoneNo':
                return hidePhoneNoModules.includes(levelOne.value);
            case 'hideBusiness':
                return hideBusinessModules.includes(levelOne.value);
            case 'hideTitle':
                return hideTitleModules.includes(levelOne.value);
            case 'featuredProductsByType':
                return featuredProductsByType.includes(levelOne.value);
            case 'bookmarkProductsUser':
                return bookmarkProductsUserModules.includes(levelOne.value);
            case 'displayCategory':
                return displayCategoryModules.includes(levelOne.value);
            case 'hideDate':
                return hideDateModules.includes(levelOne.value);
            case 'ownerType':
                return ownerTypeModules.includes(levelOne.value);
            case 'displayBusinessOnUserCard':
                return displayBusinessOnUserCardModules.includes(levelOne.value);
            case 'bookmarkProductsByType':
                return bookmarkProductsByTyp.includes(levelOne.value);
            case 'regions':
                return regionModules.includes(levelOne.value);
            case 'featuredAgents':
                return featuredAgents.includes(levelOne.value);
            case 'users':
                return moduleHasUsers.includes(levelOne.value);
            case 'userSettings':
                return moduleHasUserSettings.includes(levelOne.value);
            case 'productHasBusinessAndUser':
                return productHasBusinessAndUser.includes(levelOne.value)
            case 'productFeatures':
                return productFeatures.includes(levelOne.value)
            case 'contactAgent':
                return contactAgent.includes(levelOne.value)
            case 'minMaxPrice':
                return minMaxPriceModules.includes(levelOne.value)
            case 'displayPublicProfile':
                return publicProfileModules.includes(levelOne.value);
            case 'alterUserName':
                return alterUserNameModules.includes(levelOne.value)
            case 'hidePublicProfilFields':
                return excludePublicProfileFields.includes(levelOne.value)
            case 'yourEvents':
                return yourEvents.includes(levelOne.value)
            case 'bookingStatus':
                return bookingStatus.includes(levelOne.value)
            case 'tickets':
                return yourEvents.includes(levelOne.value)
            case 'calendarEvents':
                return calendarEvents.includes(levelOne.value)
            case 'message':
                return message.includes(levelOne.value)
            case 'orderByPrice':
                return orderByPrice.includes(levelOne.value)
        }
    })

    const excludeModule = computed(() => (type) => {
        switch (type) {
            case 'horizontalAdCard':
                return !excludeHorizontalAdCardModule.includes(route.params.levelOneslug) 
        }
    })
    const showHeadlines = () => {
        const modulesArray = route.params.levelTwoslug ? ['news'] : ['news', 'recipes', 'blogs']
        return modulesArray.includes(levelOne.value)
    }

    const popularSectionTitle = computed(() => {
        switch (levelOne.value) {
            case 'news':
                return 'Popular Articles';
            case 'blogs':
                return 'Popular Blogs';
            case 'recipes':
                return 'Popular Recipes';
            case 'services':
                return 'Recently Viewed';
        }
    })

    const showFeaturedBusiness = () => {
        return businessModules.includes(levelOne.value)
    }

    const showCompany = computed(() => {
        return businessModules.includes(levelOne.value)
    })

    const showPrice = computed(() => {
        return moduleHasPrice.includes(levelOne.value)
    })

    const toUpperCase = computed(() => {
        switch (route.params?.levelTwoslug) {
            case 'bmw':
                return 'BMW';
            case 'svg':
                return 'SVG';
            case 'infiniti':
                return 'INFINITI';
            case 'Gmc':
                return 'GMC';
            case 'suv':
                return 'SUV';
            default:
                return route.params?.levelTwoslug
        }
    });


    const priceTitle = computed(() => {
        switch (levelOne.value) {

            case 'employment':
                return 'Salary'
            case 'events':
                return 'minimum price'
            case 'services':
            case 'taskers':
            case 'marketplace':
            case 'automotive':
            case 'boats':
            case 'real-estate':
                return 'Price'
        }
    })

    const showLocation = computed(() => {
        return locationModules.includes(levelOne.value)
    })

    const showRatings = computed(() => {
        const slug = levelOne.value;
        switch (slug) {
            case 'news':
            case 'blogs':
            case 'employment':
            case 'services':
                return false;
            default:
                return true;
        }
    });

    const showRequestButton = computed(() => {
        return productRequestButtonModules.includes(levelOne.value)
    })

    const requestBtnTitle = computed(() => {
        switch (levelOne.value) {
            case 'employment':
                return 'Apply Now';
            case 'services':
                return 'Request Service';
            case 'taskers':
                return 'Task Request';
            case 'marketplace':
            case 'automotive':
            case 'boats':
                return 'Submit';
            case 'real-estate':
                return 'Listing Detail'
            case 'events':
                return 'Event Info'
        }
    });

    const productTags = computed(() => {
        return tagsUnderProductTitleModules.includes(levelOne.value)
    })

    const priceAfterTitle = computed(() => {
        return moduleHasPriceAfterTitle.includes(levelOne.value);
    });

    const showBookmarkedProducts = () => {
        return bookmarkedModules.includes(levelOne.value)
    }

    const bookmarkedProductsExclude = () => {
        return !excludeBookmarkedProducts.includes(levelOne.value);
    }

    const articleType = computed(() => {
        switch (levelOne.value) {
            case 'news':
                return 'Articles';
            case 'blogs':
                return 'My Blogs';
            case 'recipes':
                return 'My Recipes';
            case 'marketplace':
                return 'Marketplace Items';
            case 'employment':
                return 'Positions';
            case 'services':
                return 'Services';
            case 'taskers':
                return 'Tasks'
            case 'obituaries':
                return 'My Obits';
            case 'notices':
                return 'Notices';
            case 'automotive':
                return 'Vehicles';
            case 'boats':
                return 'Boats';
            case 'government':
                return 'Posts';
            case 'real-estate':
                return 'Listings';
            case 'events':
                return 'Events';
        }
    });

    const favoriteOwners = computed(() => {
        return favoriteAuthors.includes(levelOne.value)
    })

    const iconType = computed(() => {
        switch (levelOne.value) {
            case 'news':
                return 'menu-icon tf-icons bx bx-news';
            case 'blogs':
                return 'menu-icon tf-icons bx bxs-book-content';
            case 'recipes':
                return 'menu-icon tf-icons bx bx-restaurant';
            case 'marketplace':
                return 'menu-icon tf-icons bx bxs-briefcase';
            case 'employment':
                return 'menu-icon tf-icons bx bxs-notepad';
            case 'services':
                return 'menu-icon tf-icons bx bxs-paint-roll'
            case 'taskers':
                return ' menu-icon my-1 bx bxs-message-error'
            case 'obituaries':
                return 'menu-icon tf-icons bx bxs-user-badge';
            case 'takers':
                return 'menu-icon tf-icons bx bxs-hard-hat';
            case 'automotive':
                return 'menu-icon tf-icons bx bxs-car';
            case 'notices':
                return 'menu-icon tf-icons bx bxs-info-circle';
            case 'boats':
                return 'menu-icon tf-icons bx bxs-ship';
            case 'government':
                return 'menu-icon tf-icons bx bxs-castle';
            case 'real-estate':
                return 'menu-icon tf-icons bx bxs-building-house';
            case 'events':
                return 'menu-icon tf-icons bx bx-news'
        }
    });


    const singularProductTitle = computed(() => {
        let title = '';
        switch (levelOne.value) {
            case 'news':
                title = 'Article ';
                break;
            case 'blogs':
                title = 'Blog';
                break;
            case 'recipes':
                title = 'Recipe';
                break;
            case 'marketplace':
                title = 'Item';
                break;
            case 'employment':
                title = 'Position';
                break;
            case 'services':
                title = 'Service';
                break;
            case 'taskers':
                title = 'Task Title';
                break;
            case 'obituaries':
                title = 'Obituary';
                break;
            case 'automotive':
                title = 'Vehicle';
                break;
            case 'notices':
                title = 'Notice';
                break;
            case 'boats':
                title = 'Boat';
                break;
            case 'government':
                title = 'Post';
                break;
            case 'real-estate':
                title = 'Title';
                break;

        }
        return title;
    })

    const btnTitle = computed(() => {
        let title = '';
        switch (levelOne.value) {
            case 'news':
                title = 'Article';
                break;
            case 'blogs':
                title = 'Blog';
                break;
            case 'recipes':
                title = 'Recipe';
                break;
            case 'marketplace':
                title = 'Item';
                break;
            case 'employment':
                title = 'Position';
                break;
            case 'services':
                title = 'Service';
                break;
            case 'taskers':
                title = 'Task Title';
                break;
            case 'obituaries':
                title = 'Obituary';
                break;
            case 'automotive':
                title = 'Vehicle';
                break;
            case 'notices':
                title = 'Notice';
                break;
            case 'boats':
                title = 'Boat';
                break;
            case 'government':
                title = 'Post';
                break;
            case 'real-estate':
                title = 'Listing';
            case 'events':
                title = 'Event';

                break;
        }
        return title;
    })

    const paddingTop = computed(() => {
        switch (levelOne.value) {
            case 'marketplace':
                return '5rem';
            case 'events':
                return '2.2rem'
            default:
                return '4.188rem';
        }

    })

    const productOwnerInfoTab = computed(() => {
        switch (levelOne.value) {
            case 'news':
            case 'recipes':
            case 'blogs':
                return 'Author'
            case 'services':
                return 'Provider'
            case 'employment':
                return 'Employer'
            case 'taskers':
                return 'Tasker'
            case 'marketplace':
                return 'Seller';
            case 'automotive':
                return 'Dealership';
            case 'boats':
                return 'Dealership';
            case 'real-estate':
                return 'Broker';
        }
    })

    const productReviewTab = computed(() => {
        switch (levelOne.value) {
            case 'recipes':
                return 'Reviews';
            case 'services':
                return 'Provider Rating'
            case 'taskers':
                return 'Tasker Rating'
            case 'marketplace':
            case 'automotive':
                return 'Seller Reviews';
            case 'automotive':
                return 'Reviews';

            case 'boats':
                return 'Boats Reviews';
        }

    })

    const displayContactForm = computed(() => {
        return contactFormModules.includes(levelOne.value)
    })

    const productRequestType = computed(() => {
        switch (levelOne.value) {
            case 'services':
                return 'Request Service'
            case 'taskers':
                return 'Task Request'
            case 'employment':
                return 'Request Employment';
            case 'taskers':
                return 'Tasker';
            case 'marketplace':
                return 'Contact Seller';
            case 'automotive':
                return 'Get a Price Qoute';
            case 'boats':
                return 'Get a Price Qoute';
            case 'real-estate':
                return 'Contact The Listing Agent'

        }
    })

    const isBusinessRewiews = () => {
        return businessModules.includes(levelOne.value)
    }

    const isBusinessModule = () => {
        return businessModules.includes(levelOne.value) || organizationModules.includes(levelOne.value)
    }
    const bodyStyleModule = () => {
        return hasBodyStyleModules.includes(levelOne.value);
    }

    const commentsTabTitle = computed(() => {
        switch (levelOne.value) {
            case 'obituaries':
                return 'Memories'
            default:
                return 'Comments'
        }
    });

    const reviewsType = computed(() => {
        let type = null;
        switch (levelOne.value) {
            case 'services':
                type = 'business';
                break;
            case 'marketplace':
            case 'taskers':
                type = 'user';
                break;
            default:
                type = 'product';
                break;
        }
        return type;
    });

    const dateTitle = computed(() => {
        switch (levelOne.value) {
            case 'notices':
            case 'government':
                return 'Uploaded At';
            case 'events':
                return 'Date';
            default:
                return 'Created At';
        }
    });

    const isCryptoCurrencyAcceptable = computed(() => {
        return moduleHasCryptoCurrency.includes(levelOne.value);
    });

    const isDeliverable = computed(() => {
        return moduleHasDelivery.includes(levelOne.value);
    });

    const productDescriptionTitle = computed(() => {
        switch (levelOne.value) {
            case 'news':
                return 'Article Body';
            case 'automotive':
            case 'boats':
                return 'Notes';
            default:
                return 'Public Description';
        }
    })

    const priceTypeTitle = computed(() => {
        switch (levelOne.value) {
            case 'services':
            case 'taskers':
                return 'Price Type';
            case 'employment':
                return 'Salary Type';
        }
    });

    const pupularSectionTitle = computed(() => {
        switch (levelOne.value) {
            case 'news':
                return 'Popular Articles';
            case 'blogs':
                return 'Popular Blogs';
            case 'recipes':
                return 'Popular Recipes';
            case 'services':
                return 'Recently Viewed';
        }
    })

    const modulesIcon = computed(() => (module) => {
        switch (module) {
            case 'news':
                return 'bx bx-news';
            case 'blogs':
                return 'bx bxs-book-content';
            case 'recipes':
                return 'bx bx-restaurant';
            case 'marketplace':
                return 'bx bxs-briefcase';
            case 'employment':
                return 'bx bxs-notepad';
            case 'services':
                return 'bx bxs-paint-roll';
            case 'obituaries':
                return 'bx bxs-user-badge';
            case 'automotive':
                return 'bx bxs-car'
            case 'boats':
                return 'bx bxs-ship'
            case 'government':
                return 'bx bxs-castle'
            case 'taskers':
                return 'bx bxs-hard-hat'
            case 'posts':
                return 'bx bxs-book-open'
            case 'notices':
                return 'bx bxs-info-circle'
            case 'real-estate':
                return 'bx bxs-home'

            default:
                return 'bx bx-news';
        }
    })

    const stockType = computed(() => {
        switch (levelOne.value) {
            case 'marketplace':
                return 'Avaiable Items';
            case 'automotive':
                return 'Stock';
        }
    });

    // set author locaked section role name accorindg to module
    const sideBarOwnerName = computed(() => {
        switch (levelOne.value) {
            case 'news':
                return 'Reporters';
            case 'blogs':
            case 'recipes':
                return 'Authors';
            case 'services':
                return 'Providers';
            case 'employment':
                return 'Employer';
            case 'marketplace':
                return 'Sellers';
            case 'taskers':
                return 'Taskers';
            case 'automotive':
                return 'Dealerships'
            case 'notices':
                return 'Organizations'
            case 'boats':
                return 'Dealerships';
            case 'obituaries':
                return 'Funeral Home';
            case 'government':
                return 'Governments';
            case 'real-estate':
                return 'Broker'
            case 'events':
                return 'Promoters'
        }
    })

    const requiredAttributesSlug = computed(() => {
        switch (levelOne.value) {
            case 'marketplace':
                return ['color', 'condition']
            case 'automotive':
                return ['exterior-color', 'interior-color']
            case 'boats':
                return ['fuel-type', 'engine', 'color']
            case 'real-estate':
                return ['bed', 'bath', 'square-feet']
            case 'events':
                return ['test-attribute']

        }
    })

    const bookmarkProductsUserTitle = computed(() => {
        switch (levelOne.value) {
            case 'news':
            case 'recipes':
            case 'blogs':
                return 'Author';
            case 'real-estate':
                return 'Agent';

        }
    });

    // get product form default
    const getType = computed(() => {
        switch (levelOne.value) {
            case 'real-estate':
                return 'for-sale'
            case 'notices':
                return 'legal'
            default:
                return 'used'
        }
    })

    const contactFormOptions = computed(() => {
        let options = []
        switch (levelOne.value) {
            case 'automotive':
            case 'boats':
                options = [
                    { key: 'check_availability', value: 'Check availability' },
                    { key: 'ask_question', value: 'Ask a question' },
                    { key: 'price_qoute', value: 'Get a price qoute' },
                ]
                break;
            case 'taskers':
                options = [
                    { key: 'schedule_task', value: 'Schedule task' },
                    { key: 'ask_question', value: 'Ask a question' },
                    { key: 'cancel_task', value: 'Cancel task' },
                ]
                break;
            case 'employment':
                options = [
                    { key: 'apply_for_job', value: 'Job application' },
                    { key: 'ask_question', value: 'General employment Inquiry' },
                    { key: 'employee_benefits', value: 'Employee Benefits' },
                ]
                break;
            case 'services':
                options = [
                    { key: 'ask_question', value: 'Service Inquiry' },
                    { key: 'book_service', value: 'Book a ervice' },
                    { key: 'cancel_service', value: 'Cancel service' },
                ]
                break;
            case 'marketplace':
                options = [
                    { key: 'ask_question', value: 'Product Inquiry' },
                    { key: 'order_status', value: 'Order Status' },
                    { key: 'feedback', value: 'Feedback' },
                    { key: 'payment_issue', value: 'Payment Issue' },
                    { key: 'return', value: 'Return & Refunds' },
                ]
                break;
            case 'real-estate':
                options = [
                    { key: 'ask_question', value: 'Property Inquiry' },
                    { key: 'schedule_viewing', value: 'Schedule a viewing' },
                    { key: 'property_valuation', value: 'Property valuation' },
                    { key: 'legal_documentation', value: 'Legal documentation' },
                    { key: 'neighborhood_information', value: 'Neighborhood Information' },
                ]
                break;
        }
        return options
    })

    const showPublicProfileToUsers = computed(() => {
        if (['automotive', 'boats'].includes(levelOne.value) && userStore.user.user_type === 'business_owner') {
            return false;
        }
        return true;
    });

    const TooltipInformationL2 = computed(() => {
        switch (levelOne.value) {
            case 'automotive':
                return 'Select Maker.'
            case 'boats':
                return 'Select Manufacture.'
            default:
                return 'Select Level2 Tag.'
        }
    })

    const TooltipInformationL3 = computed(() => {
        switch (levelOne.value) {
            case 'automotive':
                return 'Select Model.'
            case 'boats':
                return 'Select Model.'
            default:
                return 'Select Level2 Tag.'
        }
    })

    const TooltipInformationL4 = computed(() => {
        switch (levelOne.value) {
            case 'automotive':
                return 'Select Trim.'
            case 'boats':
                return 'Select Trim.'
            default:
                return 'Select Level2 Tag.'
        }
    })

    // get aspect ratio according to module
    const getApectRatio = computed(() => (type) => {
        switch (levelOne.value) {
            case 'automotive':
            case 'boats':
            case 'services':
            case 'events':
            case 'real-estate':
            case 'news':
            case 'recipes':
                let ratio = productblogImageRatio
                switch (type) {
                    case 'product':
                        ratio = productblogImageRatio
                        break;
                    case 'logo':
                        ratio = logoRatio
                        break;
                    case 'banner':
                        ratio = bannerRatio
                        break;
                    case 'businessImage':
                        ratio = businessCardImageRatio
                }
                return ratio
        }
    })

    watch(
        () => route.params,
        async (newParams, oldParams) => {
            levelOne.value = route.params?.levelOneslug ? route.params?.levelOneslug : tagStore.getLevelOneTagSlug
        })

    return {
        showBookmarkedProducts,
        isBusinessRewiews,
        isBusinessModule,
        bookmarkedProductsExclude,
        productHeading,
        author,
        singularOwnerTitle,
        singularCompanyTitle,
        itemContainerValidator,
        showHeadlines,
        popularSectionTitle,
        showFeaturedBusiness,
        pupularSectionTitle,
        showRatings,
        showRequestButton,
        requestBtnTitle,
        productTags,
        articleType,
        iconType,
        singularProductTitle,
        favoriteOwners,
        displayContactForm,
        productRequestType,
        reviewsType,
        showCompany,
        priceTitle,
        dateTitle,
        isCryptoCurrencyAcceptable,
        isDeliverable,
        showPrice,
        showLocation,
        productOwnerInfoTab,
        productReviewTab,
        hideShowItemsOnProductCard,
        commentsTabTitle,
        productDescriptionTitle,
        priceTypeTitle,
        modulesIcon,
        stockType,
        bodyStyleModule,
        priceAfterTitle,
        bookmarkedModuleTitle,
        bookmarkedBusinessTitle,
        companyTitle,
        sideBarOwnerName,
        requiredAttributesSlug,
        bookmarkProductsUserTitle,
        btnTitle,
        FavoriteAuthor,
        getType,
        userName,
        singularUserName,
        contactFormOptions,
        attributes,
        vehicleFeatures,
        toUpperCase,
        paddingTop,
        showPublicProfileToUsers,
        TooltipInformationL2,
        TooltipInformationL3,
        TooltipInformationL4,
        rowCol,
        getApectRatio,
        excludeModule
    }
}
