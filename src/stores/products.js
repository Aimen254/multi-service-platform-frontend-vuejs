import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', () => {
    // today products property
    const todayProducts = ref([])

    // favorite reportres products property
    const favoriteReporterProducts = ref([])

    // featured products property
    const featuredProducts = ref([])

    // propular products property
    const popularProducts = ref([])

    // latest products property
    const latestProducts = ref([])

    // recently viewed products property
    const recentlyViewedProducts = ref([])

    // weekly products propert 
    const weeklyProducts = ref([])

    // real estate featured products for sale
    const featuredProductsForSale = ref([])

    //real estate featured products for rent
    const featuredProductsForRent = ref([])

    // fucntion to save products
    function saveTodayProducts(data) {
        todayProducts.value = data
    }

    // function to save favorite reporters products
    function saveFavoriteReporterProducts(data) {
        favoriteReporterProducts.value = data
    }

    // save featured products
    function saveFeaturedProducts(data) {
        featuredProducts.value = data
    }

    // save popular products 
    function savePopularProducts(data) {
        popularProducts.value = data
    }

    // save latest product
    function saveLatestProducts(data) {
        latestProducts.value = data
    }

    // save recently viewed
    function saveRecentlyViewedProducts(data) {
        recentlyViewedProducts.value = data
    }

    // save weekly products
    function saveWeeklyProducts(data) {
        weeklyProducts.value = data
    }

    // save featured priducts for sale
    function saveFeaturedProductsForSale(data) {
        featuredProductsForSale.value = data
    }

    // save featured products for sale
    function saveFeaturedProductsForRent(data) {
        featuredProductsForRent.value = data
    }

    // remove products
    function removeProducts() {
        todayProducts.value = []
        latestProducts.value = []
        featuredProducts.value = []
        favoriteReporterProducts.value = []
        popularProducts.value = []
        recentlyViewedProducts.value = []
        weeklyProducts.value = []
        featuredProductsForSale.value = []
    }

    // update the wishlist status of a specific product in products states
    function updateProductWishlistStatus(product, in_wishlist) {
        // check if products exist in today products 
        const todayProductIndex = todayProducts.value.findIndex(item => item.id === product.id);
        if (todayProductIndex !== -1) {
            todayProducts.value[todayProductIndex].in_wishlist = in_wishlist
        }

        //check if product exist in favorite reporters products
        const favorReporterProductIndex = favoriteReporterProducts.value.findIndex(item => item.id === product.id)
        if (favorReporterProductIndex !== -1) {
            favoriteReporterProducts.value[favorReporterProductIndex].in_wishlist = in_wishlist
        }
        // for featured products
        const featuredProductsIndex = featuredProducts.value.findIndex(item => item.id === product.id)
        if (featuredProductsIndex !== -1) {
            featuredProducts.value[featuredProductsIndex].in_wishlist = in_wishlist
        }

        // check if product exsit in latest products
        const latestProductIndex = latestProducts.value.findIndex(item => item.id === product.id)
        if (latestProductIndex !== -1) {
            latestProducts.value[latestProductIndex].in_wishlist = in_wishlist
        }

        // check if product exist in popular products
        const popularProductIndex = popularProducts.value.findIndex(item => item.id === product.id)
        if (popularProductIndex !== -1) {
            popularProducts.value[popularProductIndex].in_wishlist = in_wishlist
        }

        // check if product exist in recentlty viewed
        const recentlyViewedProductIndex = recentlyViewedProducts.value.findIndex(item => item.id === product.id)
        if (recentlyViewedProductIndex !== -1) {
            recentlyViewedProducts.value[recentlyViewedProductIndex].in_wishlist = in_wishlist
        }

        // check if product exist in weekly products
        const weeklyProductsIndex = weeklyProducts.value.findIndex(item => item.id === product.id)
        if (weeklyProductsIndex !== -1) {
            weeklyProducts.value[weeklyProductsIndex].in_wishlist = in_wishlist
        }

        // check if product exist in featured for sale
        const featuredForSaleIndex = featuredProductsForSale.value.findIndex(item => item.id === product.id)
        if (featuredForSaleIndex !== -1) {
            featuredProductsForSale.value[featuredForSaleIndex].in_wishlist = in_wishlist
        }

        // check if product exist in featured for sale
        const featuredForRentIndex = featuredProductsForRent.value.findIndex(item => item.id === product.id)
        if (featuredForRentIndex !== -1) {
            featuredProductsForRent.value[featuredForRentIndex].in_wishlist = in_wishlist
        }
    }

    // get to day products
    const getTodayProducts = computed(() => {
        return todayProducts.value
    })

    // get favorite Reporters products
    const getFavoriteReporterProducts = computed(() => {
        return favoriteReporterProducts.value
    })

    // get featured products
    const getFeaturedProducts = computed(() => {
        return featuredProducts.value
    })

    // get popular products
    const getPopularProducts = computed(() => {
        return popularProducts.value
    })

    const getLatestProducts = computed(() => {
        return latestProducts.value
    })

    // get recently viewed products
    const getRecentlyViewedProducts = computed(() => {
        return recentlyViewedProducts.value
    })

    // get weekly products
    const getWeeklyProducts = computed(() => {
        return weeklyProducts.value
    })

    // get featured products for sale products 
    const getFeaturedProductsForSale = computed(() => {
        return featuredProductsForSale.value
    })

    // get featured products for rent products
    const getFeaturedProductsForRent = computed(() => {
        return featuredProductsForRent.value
    })

    return {
        // functions to manipulate data in states
        saveTodayProducts,
        updateProductWishlistStatus,
        saveFavoriteReporterProducts,
        saveFeaturedProducts,
        savePopularProducts,
        saveLatestProducts,
        removeProducts,
        saveRecentlyViewedProducts,
        saveWeeklyProducts,
        saveFeaturedProductsForSale,
        saveFeaturedProductsForRent,

        // getters or computed properties
        getTodayProducts,
        getFavoriteReporterProducts,
        getFeaturedProducts,
        getPopularProducts,
        getLatestProducts,
        getRecentlyViewedProducts,
        getWeeklyProducts,
        getFeaturedProductsForSale,
        getFeaturedProductsForRent,
    }
})