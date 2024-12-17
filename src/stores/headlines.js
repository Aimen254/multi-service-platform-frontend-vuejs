import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
export const useHeadlinesStore = defineStore('headlines', () => { 
    const primaryHeadLine = ref(null)
    const secondaryHeadLine = ref([])

    function savePrimaryHeadline(data) {
        primaryHeadLine.value = data
    }

    function saveSecondaryHeadLine(data) {
       secondaryHeadLine.value = data
    }

    function updateHeadLinsWishListStatus(id, in_wishlist) {
        if (primaryHeadLine.value && primaryHeadLine.value.id === id) {
            primaryHeadLine.value.in_wishlist = in_wishlist
        }
        const secondaryHeadLineIndex = secondaryHeadLine.value.findIndex(item => item.id === id);
        if (secondaryHeadLineIndex !== -1) {
            secondaryHeadLine.value[secondaryHeadLineIndex].in_wishlist = in_wishlist
        }
    }

    function removeHeadLines() {
        primaryHeadLine.value = null
        secondaryHeadLine.value = []
    }

    const getPrimaryHeadline = computed(() => {
        return primaryHeadLine.value
    })

    const getSecondaryHeadline = computed(() => {
        return secondaryHeadLine.value
    })

    return {
       savePrimaryHeadline,
       getPrimaryHeadline,
       updateHeadLinsWishListStatus,
       saveSecondaryHeadLine,
       getSecondaryHeadline,
       removeHeadLines
    }
})