import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useMessage } from '@composables/message';

export const dreamCategoriesStore = defineStore('categories', () => {
    const categories = ref([])
    const meta = ref({})
    const { recordNotFound } = useMessage()
    
    function saveCategories(data, type, pagination = null) {
        if(type == 'object') {
            categories.value.push(data)
            meta.value.total++ 
            meta.value.last++
        } else {
            categories.value = data
            meta.value = pagination
        }
    }

    // get leveltow categories to display in admin side bar
    const levelTwoCategories = computed(() => {
        const uniqueLevelTwo = Object.values(categories.value.reduce((levelTows, item) => {
            levelTows[JSON.stringify(item.maker)] = item.maker;
            return levelTows;
        }, {}));
            return uniqueLevelTwo
    })

    function updateOrRemoveCategories(category, method = 'put') {
       if(method == 'delete') {
            const index = categories.value.findIndex((item) => item.id == category.id);
            // Check if the product is in the array
            if (index !== -1) {
                // Remove the product from the favoriteProducts array
                meta.value.total--
                meta.value.last--
                categories.value.splice(index, 1)
            }
       } else {
            const index = categories.value.findIndex((item) => item.id == category.id);
             if (index !== -1) {
                // update category
                categories.value.splice(index, 1, category);
            }
       }
    }

    function removeAllCategories() {
        categories.value = []
    }

    // update the wishlist status of a specific product in category
    function updateProductWishlistStatus(productId, wishlistStatus) {
        categories.value.forEach(category => {
            const productIndex = category.products.findIndex(product => product.id === productId);
            if (productIndex !== -1) {
                category.products[productIndex].in_wishlist = wishlistStatus;
            }
        })
    }

    function removeAllCategories() {
        categories.value = []
    }

    // computed properties to get all my categoreis
    const getMyCategories = computed(() => {
        return categories.value
    })

    const dataNotFound = computed(() => {
        return categories.value.length == 0 ? recordNotFound() : null;
    });

    const latestCategories = computed(() => {
        // Use the slice method to get the last 10 categories
        return categories.value.slice(-10);
    });

    // computed property to get meta
    const getMeta = computed(() => {
        return meta.value
    })

   return { saveCategories, levelTwoCategories, getMyCategories, updateOrRemoveCategories, updateProductWishlistStatus, getMeta, latestCategories, removeAllCategories, dataNotFound}
})