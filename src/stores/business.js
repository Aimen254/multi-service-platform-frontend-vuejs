import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useBusinessStore = defineStore("business", () => {
    const featuredBusiness = ref([]);

    const business = ref(null)

    function saveFeaturedBusiness(data) {
        featuredBusiness.value = data
    }

    function saveBusinessDetail(data) {
        business.value = data
    }

    function removeBusinessDetail() {
        business.value = null
    }

    function removeBusiness() {
        featuredBusiness.value = []
    }

    function updateBusinessWishlistStatus(business, in_wishlist) {
        // check if business exist in today products 
        const featuredBusinessIndex = featuredBusiness.value.findIndex(item => item.id === business.id);
        if (featuredBusinessIndex !== -1) {
            featuredBusiness.value[featuredBusinessIndex].in_wishlist = in_wishlist
        }
    }

    const getFeaturedBusiness = computed(() => {
        return featuredBusiness.value
    })

    const getBusinessDetail = computed(() => {
        return business.value
    })

    return {
        featuredBusiness,
        saveFeaturedBusiness,
        removeBusiness,
        updateBusinessWishlistStatus,
        saveBusinessDetail,
        removeBusinessDetail,
        getFeaturedBusiness,
        getBusinessDetail,
    }
});