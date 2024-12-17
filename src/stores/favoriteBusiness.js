import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useFavoriteBusinessStore = defineStore("favoriteBusiness", () => {
    const favoriteBusiness = ref([]);
    const meta = ref({});

    // Function to save favorite business
  function saveFavoriteBusiness(data, pagination = null) {
    favoriteBusiness.value = []
    favoriteBusiness.value = data;
    meta.value = pagination;
  }

   // Computed property to get favorite business
   const getFavoriteBusiness = computed(() => {
    return favoriteBusiness.value;
  });

  // Function to update favorite Business
  function updateFavoriteBusiness(business, flag) {
    if (flag) {
      // Add the product to the favoriteBusiness array
      const newItem = {
        id: 0, // dummy id
        business: business,
      };
      // remove business from favorite if its lenght is greater then 4
      if (favoriteBusiness.value.length == 4) {
        favoriteBusiness.value.shift();
      }
      favoriteBusiness.value.push(newItem);
    } else {
      // Find the index of the business in the array
      const index = favoriteBusiness.value.findIndex(
        (item) => item.business.id == business.id
      );
      // Check if the business is in the array
      if (index !== -1) {
        // Remove the product from the favoriteBusiness array
        favoriteBusiness.value.splice(index, 1);
      }
    }
  }

    // remove all favorite business
    function removeFavoriteBusiness() {
        favoriteBusiness.value = []
      }
    
      // computed property to get meta
      const getMeta = computed(() => {
        return meta.value;
      });

      return { saveFavoriteBusiness, updateFavoriteBusiness, getMeta, getFavoriteBusiness, removeFavoriteBusiness };
});