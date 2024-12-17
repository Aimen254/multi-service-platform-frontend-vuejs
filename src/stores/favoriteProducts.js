import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useFavoriteProudctsStore = defineStore("favoriteProducts", () => {
  const favoriteProducts = ref([]);
  const meta = ref({});

  // book marked products by type 
  const boomrkedForSale = ref([])
  const boomarkedForRent = ref([])

  // Function to save favorite products
  function saveFavoriteProducts(data, pagination = null) {
    favoriteProducts.value = []
    favoriteProducts.value = data;
    meta.value = pagination;
  }

  // Computed property to get favorite products
  const getFavoriteProducts = computed(() => {
    return favoriteProducts.value;
  });

  // Function to update favorite products
  function updateFavoriteProducts(product, flag) {
    if (flag) {
      // Add the product to the favoriteProducts array
      const newItem = {
        id: 0, // dummy id
        product: product,
      };
      // remov product from favorite if its lenght is greater then 4
      if (favoriteProducts.value.length == 4) {
        favoriteProducts.value.shift();
      }
      favoriteProducts.value.push(newItem);
    } else {
      // Find the index of the product in the array
      const index = favoriteProducts.value.findIndex(
        (item) => item.product.id == product.id
      );
      // Check if the product is in the array
      if (index !== -1) {
        // Remove the product from the favoriteProducts array
        favoriteProducts.value.splice(index, 1);
      }
    }
  }

  // save bookmarked for sale
  function saveBookmarkedForSale(data, pagination = null) {
    boomrkedForSale.value = []
    boomrkedForSale.value = data
    meta.value = pagination
  }

  // get bookmarked for sale products
  const getBookmarkedForSale = computed(() => {
    return boomrkedForSale.value
  })

  // save bookmarked for rent
  function saveBookmarkedForRent(data, pagination = null) {
    boomarkedForRent.value = []
    boomarkedForRent.value = data
    meta.value = pagination
  }

  // get bookmarked for Rent products
  const getBookmarkedForRent = computed(() => {
    return boomarkedForRent.value
  })

  // remove all favorite products
  function removeFavoriteProducts() {
    favoriteProducts.value = []
    boomrkedForSale.value = []
    boomarkedForRent.value = []
  }

  // computed property to get meta
  const getMeta = computed(() => {
    return meta.value;
  });

  return {
    // functions 
    saveFavoriteProducts,
    updateFavoriteProducts,
    removeFavoriteProducts,
    saveBookmarkedForSale,
    saveBookmarkedForRent,

    // getters
    getMeta,
    getFavoriteProducts,
    getBookmarkedForSale,
    getBookmarkedForRent
  };
});
