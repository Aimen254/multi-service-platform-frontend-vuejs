import { ref, onMounted, computed, onBeforeMount } from 'vue'
import { defineStore } from 'pinia'

export const useTagStore = defineStore('tags', () => {
    //save array of tags 
    const levelOneTags = ref([])
    const levelOneTag = ref(null)
    const levelOneSlug = ref('')

    // level tag ids and slugs
    const levelTwoTag = ref(null)
    const levelTwoSlug = ref('')

    const levelThreeTag = ref(null)
    const levelThreeSlug = ref('')

    const levelFourTag = ref(null)
    const levelFourSlug = ref('')

    // level Two tags
    const levelTwoTags = ref([])

    // level three tags
    const levelThreeTags = ref([])

    const popularMakes = ref([])
    const bodyStyles = ref([])

    const latestLevelTwoTagsProducts = ref([])

    onBeforeMount(() => {
        const retrievedData = JSON.parse(localStorage.getItem('levelOneTags'));

        // ids
        const levelOneTagId = localStorage.getItem('levelOneId');
        const levelTwoTagId = localStorage.getItem('levelTwoId');
        const levelThreeTagId = localStorage.getItem('levelThreeId');
        const levelFourTagId = localStorage.getItem('levelFourId');

        // slugs
        const levelOneTagSlug = localStorage.getItem('levelOneSlug');
        const levelTwoTagSlug = localStorage.getItem('levelTwoSlug');
        const levelThreeTagSlug = localStorage.getItem('levelThreeSlug');
        const levelFourTagSlug = localStorage.getItem('levelFourSlug');

        if (retrievedData) {
            saveLevelOneTags(retrievedData)
        }

        if (levelOneTagId && levelOneTagSlug) {
            saveLevelOneTag({ levelOneTagId, levelOneTagSlug })
        }
        if (levelTwoTagId && levelTwoTagSlug) {
            saveLevelTwoTag({ levelTwoTagId, levelTwoTagSlug })
        }
        if (levelThreeTagId && levelThreeTagSlug) {
            saveLevelThreeTag({ levelThreeTagId, levelThreeTagSlug });
        }
        if (levelFourTagId && levelFourTagSlug) {
            saveLevelFourTag({ levelFourTagId, levelFourTagSlug });
        }
    })

    // store level one tags
    function saveLevelOneTags(data) {
        const transformedData = data.map(item => {
            return {
                ...item,
                text: item.name,
            }
        })
        levelOneTags.value = transformedData
    }

    // get list of tags
    const getLevelOneTags = computed(() => {
        return levelOneTags.value
    })

    // set level one tag id
    function saveLevelOneTag(tag) {
        levelOneTag.value = tag.levelOneTagId
        levelOneSlug.value = tag.levelOneTagSlug
        localStorage.setItem('levelOneId', tag.levelOneTagId)
        localStorage.setItem('levelOneSlug', tag.levelOneTagSlug)
    }

    // set level two tag id
    function saveLevelTwoTag(tag) {
        levelTwoTag.value = tag.levelTwoTagId
        levelTwoSlug.value = tag.levelTwoTagSlug
        localStorage.setItem('levelTwoId', tag.levelTwoTagId)
        localStorage.setItem('levelTwoSlug', tag.levelTwoTagSlug)
    }

    // set level three tag id
    function saveLevelThreeTag(tag) {
        levelThreeTag.value = tag.levelThreeTagId
        levelThreeSlug.value = tag.levelThreeTagSlug
        localStorage.setItem('levelThreeId', tag.levelThreeTagId)
        localStorage.setItem('levelThreeSlug', tag.levelThreeTagSlug)
    }

    function saveLevelFourTag(tag) {
        levelFourTag.value = tag.levelFourTagId
        levelFourSlug.value = tag.levelFourTagSlug
        localStorage.setItem('levelFourId', tag.levelFourTagId)
        localStorage.setItem('levelFourSlug', tag.levelFourTagSlug)
    }

    function setPopularMakes(tags) {
        popularMakes.value = tags;
    }

    function setBodyStyles(tags) {
        bodyStyles.value = tags;
    }

    // get level one tag id
    const getLevelOneTagId = computed(() => {
        return levelOneTag.value
    })

    // get level one tag slug
    const getLevelOneTagSlug = computed(() => {
        return levelOneSlug.value;
    })

    // get level two tag id
    const getLevelTwoTagId = computed(() => {
        return levelTwoTag.value;
    });

    // get level two tag slug
    const getLevelTwoTagSlug = computed(() => {
        return levelTwoSlug.value;
    })

    const getLevelThreeTagId = computed(() => {
        return levelThreeTag.value;
    });

    const getLevelThreeTagSlug = computed(() => {
        return levelThreeSlug.value;
    });

    const getLevelFourTagId = computed(() => {
        return levelFourTag.value;
    });

    const getLevelFourTagSlug = computed(() => {
        return levelFourSlug.value;
    });

    // get level two tags
    const getLevelTwoTags = computed(() => {
        return levelTwoTags.value
    })

    const getLevelThreeTags = computed(() => {
        return levelThreeTags.value
    })

    const getPopularMakes = computed(() => {
        return popularMakes.value
    })

    const getBodyStyles = computed(() => {
        return bodyStyles.value;
    })

    // get level two latest products
    const getLatestLevelTwoTagsProducts = computed(() => {
        return latestLevelTwoTagsProducts.value
    })

    // remove level one id 
    function removeLevelOneTag() {
        levelOneTag.value = null
        levelOneSlug.value = null
        localStorage.removeItem('levelOneId')
        localStorage.removeItem('levelOneSlug')
    }

    // remove level two id 
    function removeLevelTwoTag() {
        levelTwoTag.value = null
        levelTwoSlug.value = null
        localStorage.removeItem('levelTwoId')
        localStorage.removeItem('levelTwoSlug')
    }

    // remove level three id 
    function removeLevelThreeTag() {
        levelThreeTag.value = null
        levelThreeSlug.value = null
        localStorage.removeItem('levelThreeId')
        localStorage.removeItem('levelThreeSlug')
    }

    // remove level four id 
    function removeLevelFourTag() {
        levelFourTag.value = null
        levelFourSlug.value = null
        localStorage.removeItem('levelFourId')
        localStorage.removeItem('levelFourSlug')
    }

    function saveLevelTwoTags(data) {
        levelTwoTags.value = data
    }

    function saveLevelThreeTags(data) {
        levelThreeTags.value = data
    }

    function removeLevelThreeTags() {
        levelThreeTags.value = []
    }
    // save latest products of level two tag
    function saveLatestLevelTwoProducts(data) {
        latestLevelTwoTagsProducts.value = data
    }
    // remove latest products of level two tag
    function removeLatestLevelTwoProducts() {
        latestLevelTwoTagsProducts.value = []
    }

    // update the wishlist status of a specific product in category
    function updateProductFavoriteStauts(productId, wishlistStatus) {
        levelTwoTags.value.forEach(tag => {
            const productIndex = tag.products.findIndex(product => product.id == productId);
            if (productIndex !== -1) {
                tag.products[productIndex].in_wishlist = wishlistStatus;
            }
        })

        levelThreeTags.value.forEach(tag => {
            const productIndex = tag.products.findIndex(product => product.id == productId);
            if (productIndex !== -1) {
                tag.products[productIndex].in_wishlist = wishlistStatus;
            }
        })

        latestLevelTwoTagsProducts.value.forEach(tag => {
            const productIndex = tag.products.findIndex(product => product.id == productId);
            if (productIndex !== -1) {
                tag.products[productIndex].in_wishlist = wishlistStatus;
            }
        })

    }

    function removeTags() {
        levelTwoTags.value = []
        levelThreeTags.value = []
    }

    return {
        saveLevelOneTags,
        getLevelOneTags,
        saveLevelOneTag,
        getLevelOneTagId,
        getLevelOneTagSlug,
        levelOneTags,
        getLevelTwoTagId,
        getLevelTwoTagSlug,
        getLevelThreeTagId,
        getLevelThreeTagSlug,
        getLevelFourTagId,
        getLevelFourTagSlug,
        removeLevelOneTag,
        removeLevelTwoTag,
        removeLevelThreeTag,
        saveLevelTwoTag,
        saveLevelThreeTag,
        saveLevelFourTag,
        removeLevelFourTag,
        saveLevelTwoTags,
        getLevelTwoTags,
        updateProductFavoriteStauts,
        saveLevelThreeTags,
        getLevelThreeTags,
        removeLevelThreeTags,
        removeTags,
        setPopularMakes,
        getPopularMakes,
        setBodyStyles,
        getBodyStyles,
        saveLatestLevelTwoProducts,
        getLatestLevelTwoTagsProducts,
        removeLatestLevelTwoProducts
    }
})