import { inject, ref } from "vue"
import { useHelper } from "./helper";
import { useToastr } from "./toastr";
import { useUserStore } from "@/stores/user";
import { useFavoriteProudctsStore } from "@/stores/favoriteProducts"
import { useFavoriteBusinessStore } from "@/stores/favoriteBusiness"
import { dreamCategoriesStore } from '@/stores/categories'
import { useProductsStore } from '@stores/products'
import { useBusinessStore } from '@stores/business'
import { useTagStore } from '@stores/tags.js'
import { useHeadlinesStore } from '@stores/headlines.js'
import { useMessage } from "./message";
import { useModuleSettings } from '@composables/modules.js'

export const useWishlist = () => {
    const userStore = useUserStore();
    const { showLoading, hideLoading, inValidToken, otpNotVerified, } = useHelper();
    const { toast } = useToastr();
    const favoriteProductsStore = useFavoriteProudctsStore()
    const favoriteBusinessStore = useFavoriteBusinessStore()
    const categoriesStore = dreamCategoriesStore()
    const productsStore = useProductsStore()
    const businessStore = useBusinessStore()
    const tagStore = useTagStore()
    const headlineStore = useHeadlinesStore()
    const { recordNotFound } = useMessage()

    const $http = inject('$http'); // accessing axios
    const favoriteItems = ref([]); // property to assign array of favorite items
    const token = userStore?.user?.access_token; // accessing authenticated user's token
    const meta = ref({})
    const whlistProduct = ref('');
    const dataNotFound = ref(null)

    const { itemContainerValidator } = useModuleSettings()

    // get list of favorite items
    const wishlist = async (params, type = 'user', loading = true, component = null) => {

        dataNotFound.value = null
        try {
            loading ? showLoading() : ''
            const response = await $http.get('/api/wishlist', {
                params: params,
            });
            favoriteItems.value = response?.data?.data;
            if (type == 'user') {
                userStore.saveFavoriteUser(favoriteItems.value)
            }
            meta.value = response.data.meta

            // save data in store
            if (params?.type == 'product') {
                if (itemContainerValidator.value('bookmarkProductsByType') && params.listing_type) {
                    if (params?.listing_type === 'for-sale') {
                        favoriteProductsStore.saveBookmarkedForSale(response.data.data, meta.value)
                    } else {
                        favoriteProductsStore.saveBookmarkedForRent(response.data.data, meta.value)
                    }
                } else {
                    favoriteProductsStore.saveFavoriteProducts(response.data.data, meta.value)
                }
            }

            if (params?.type == 'business') {
                favoriteBusinessStore.saveFavoriteBusiness(response.data.data, meta.value)
            }
            loading ? hideLoading() : ''
            dataNotFound.value = response.data.data.length == 0 ? recordNotFound() : null
            return response.data.data
        } catch (exception) {
            loading ? hideLoading() : ''
            otpNotVerified(exception?.response?.status);
            inValidToken(exception?.response?.data?.message);
        }
    }

    // add item to wishlist
    const addToWishlist = async (item, type = 'user', params = null) => {
        let data = {
            [`${type}_id`]: item.id,
            type: type,
            tag_type: params?.tag_type,
            module_id: tagStore?.getLevelOneTagId
        };

        try {
            showLoading();
            const response = await $http.post('/api/wishlist', data);
            hideLoading()
            const inWishlist = response?.data?.flag
            whlistProduct.value = inWishlist
            toast(response?.data?.message);
            if (type == 'user') {
                userStore.updateUserInList(item.id, inWishlist)
                userStore.saveFavoriteUser(item, inWishlist, 'object')
            } else if (type == 'product') {
                if (params) {
                    wishlist(params, type, false);
                }
                // update categories products wishlist status
                categoriesStore.updateProductWishlistStatus(item.id, inWishlist)
                // update products wishlist status
                productsStore.updateProductWishlistStatus(item, inWishlist)
                // update favorite user's products wislist stauts
                userStore.updateFavoriteUserProductWislistStatus(item, inWishlist)
                // update wishlist status in level two tags
                tagStore.updateProductFavoriteStauts(item.id, inWishlist)
                // update healine wishlist status
                headlineStore.updateHeadLinsWishListStatus(item.id, inWishlist)
            } else if (type == 'business') {
                if (params) {
                    wishlist(params, type, false);
                }

                businessStore.updateBusinessWishlistStatus(item, inWishlist)
            } else {
                if (params) {
                    wishlist(params, type, false);
                }
            }
            // return
        } catch (exception) {
            hideLoading();
            if (exception.response) {
                otpNotVerified(exception?.response?.status);
                inValidToken(exception?.response?.data?.message);
            }
        }
    }

    // returns reactive properties and methods
    return {
        meta,
        addToWishlist,
        favoriteItems,
        wishlist,
        meta,
        whlistProduct,
        dataNotFound
    }
}