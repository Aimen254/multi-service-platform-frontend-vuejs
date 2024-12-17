<script setup>
import { onMounted, computed, ref, watch, inject } from 'vue'
import Table from '@components/core/Table.vue';
import { useTagsApi } from '@composables/tagLevels'
import { useTagStore } from '@/stores/tags.js'

const eventBus = inject('eventBus');
const searchValue = ref('');
const tagStore = useTagStore()
const { levelTwoTags, dataNotFound } = useTagsApi();
const getStylesAttribute = async (limit = 6) => {
    await levelTwoTags(tagStore.getLevelOneTagId, {
        limit: limit, type: 'body_style',
        'keyword': searchValue.value,
    });
}

const chunkedStyles = computed(() => {
    const bodyStyle = tagStore.getBodyStyles
    const chunks = [];
    for (let i = 0; i < bodyStyle.length; i += 4) {
        chunks.push(bodyStyle.slice(i, i + 4));
    }
    return chunks;
});

const setLevelTwoTagInStore = (tag) => {
    eventBus.emit('levelTwo', {
        tag: tag
    })
}

onMounted(async () => {
    getStylesAttribute()
})


watch(searchValue, async (newValue, oldValue) => {
    await getStylesAttribute();
});
</script>
<template>
    <div class="card">
        <div class="table-responsive text-nowrap">
            <Table class="table table-borderless border-none">
                <template #filters>
                    <h5> Body Styles</h5>
                    <p>Discover a world of stylish rides – explore diverse vehicle body styles from various
                        manufacturers.</p>
                </template>
                <template #content>
                    <thead class="table-light">
                    </thead>
                    <tbody>
                        <tr v-if="dataNotFound" class="text-center">
                            <td colspan="4" class="pt-4">
                                <div>
                                    {{ dataNotFound }}
                                </div>
                            </td>
                        </tr>
                        <tr v-for="chunk in chunkedStyles" :key="chunk[0].id">
                            <td v-for="style in chunk" :key="style.id" class="border">
                                <router-link class="text-inherit"
                                    :to="{ name: 'level-two-page', params: { levelOneslug: tagStore.getLevelOneTagSlug, levelTwoslug: style.slug } }"
                                    @click="setLevelTwoTagInStore(style)">
                                    {{ style.name }}
                                </router-link>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </Table>
        </div>
    </div>
</template>