<script setup>
import { onMounted, computed, ref, watch, inject } from 'vue'
import Table from '@components/core/Table.vue';
import { useTagsApi } from '@composables/tagLevels'
import { useTagStore } from '@/stores/tags.js'

const eventBus = inject('eventBus');
const searchValue = ref('');
const tagStore = useTagStore()
const { levelTwoTags, dataNotFound } = useTagsApi();


const getVehicleTags = async (limit = 6) => {
    await levelTwoTags(tagStore.getLevelOneTagId, {
        limit: limit, type: 'make',
        'keyword': searchValue.value,
    });
}

const chunkedTags = computed(() => {
    const tags = tagStore.getPopularMakes
    const chunks = [];
    for (let i = 0; i < tags.length; i += 4) {
        chunks.push(tags.slice(i, i + 4));
    }
    return chunks;
});

const setLevelTwoTagInStore = (tag) => {
    eventBus.emit('levelTwo', {
        tag: tag
    })
}

onMounted(async () => {
    getVehicleTags()
})

watch(searchValue, async (newValue, oldValue) => {

    await getVehicleTags();
});
</script>
<template>
    <div class="card">
        <div class="table-responsive text-nowrap">
            <Table class="table">
                <template #filters>
                    <div class="row">
                        <div class="col-md-2">
                            <h5> Popular Makes</h5>
                            <p>Explore diverse vehicles on our platform from various manufacturers.</p>
                        </div>
                    </div>
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
                        <tr v-for="chunk in chunkedTags" :key="chunk[0].id">
                            <td v-for="tag in chunk" :key="tag.id" class="border">
                                <router-link class="text-inherit"
                                    :to="{ name: 'level-two-page', params: { levelOneslug: tagStore.getLevelOneTagSlug, levelTwoslug: tag.slug } }"
                                    @click="setLevelTwoTagInStore(tag)">
                                    {{ tag?.name ?? '' }}
                                </router-link>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </Table>
        </div>
    </div>
</template>