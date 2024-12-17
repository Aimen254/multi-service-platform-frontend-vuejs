<script setup>
import { ref, inject } from 'vue';
import { useWishlist } from '@/composables/wishlist.js'
import { useTagStore } from '@/stores/tags.js'
import { useModuleSettings } from '@composables/modules';

const props = defineProps({
    tag: Object,
    tagType: String,
    levelTwoTag: Object
})

const { getApectRatio } = useModuleSettings();

const { addToWishlist, whlistProduct } = useWishlist();
const tagStore = useTagStore();
const tagItem = ref({});
const eventBus = inject('eventBus');
tagItem.value = props.tag;

const addTagToWishlist = async (tag) => {
    let type = 'tag';
    await addToWishlist(tag, type, {
        limit: 6,
        type: type,
        tag_type: props.tagType,
        module: tagStore.getLevelOneTagSlug
    });

    tagItem.value.in_wishlist = whlistProduct.value
}

const setLevelTwoTagInStore = (tag) => {
    eventBus.emit('levelTwo', {
        tag: tag
    })
}

const goToLevelThreeTags = (tag) => {
    eventBus.emit('regions', {
        tag: tag,
        levelTwoTag: props.levelTwoTag
    })
}


</script>

<template>
    <div class="card h-100 product product-card">
        <div class="d-flex justify-content-center author-link">
            <router-link v-if="tagType != 'region'"
                :to="{ name: 'level-two-page', params: { levelOneslug: tagStore.getLevelOneTagSlug, levelTwoslug: tagItem.slug } }"
                @click="setLevelTwoTagInStore(tagItem)">
                <img class="img-fluid rounded-top" :src="tagItem?.icon" alt="Card image cap"
                    :style="{ 'aspect-ratio': getApectRatio('logo') }" />
            </router-link>
            <div v-else>
                <router-link @click="goToLevelThreeTags(tagItem)"
                    :to="{ name: 'level-three-page', params: { levelOneslug: tagStore.getLevelOneTagSlug, levelTwoslug: levelTwoTag.slug, levelThreeslug: tagItem.slug } }">
                    <img class="img-fluid" :src="tagItem?.icon" alt="Card image cap"
                        :style="{ 'aspect-ratio': getApectRatio('logo') }" />
                </router-link>
            </div>
        </div>
        <div class="card-body tag">
            <div class="d-flex justify-content-between">
                <router-link v-if="tagType != 'region'"
                    :to="{ name: 'level-two-page', params: { levelOneslug: tagStore.getLevelOneTagSlug, levelTwoslug: tagItem.slug } }"
                    @click="setLevelTwoTagInStore(tagItem)">
                    <h5 class="card-title truncate-text-3 tag-title">{{ tagItem?.name }}</h5>
                </router-link>
                <router-link @click="goToLevelThreeTags(tagItem)" v-else
                    :to="{ name: 'level-three-page', params: { levelOneslug: tagStore.getLevelOneTagSlug, levelTwoslug: levelTwoTag.slug, levelThreeslug: tagItem.slug } }">
                    <h5 class="card-title truncate-text-3 tag-title">{{ tagItem?.name }}</h5>
                </router-link>
                <div v-if="tagType != 'region'">
                    <i class="tag-icon tf-icons bx bx-bookmark cursor-pointer"
                        :class="{ 'bookmark-color bx bxs-bookmark': tagItem.in_wishlist }"
                        @click="addTagToWishlist(tagItem)"></i>
                </div>
            </div>
        </div>
    </div>
</template>