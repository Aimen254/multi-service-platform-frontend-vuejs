<script setup>
import { ref, watch, onBeforeMount } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useHelper } from '@composables/helper';
import Table from '@components/core/Table.vue';
import Pagination from '@components/core/Pagination.vue';
import TableFilters from '@components/core/TableFilters.vue';
import { useTagStore } from '@/stores/tags.js';
import { useBusinessApi } from '@composables/business.js';
import { useUserStore } from '@stores/user.js'
import StarRating from 'vue-star-rating';
import { useModuleSettings } from '@composables/modules.js'

const { singularOwnerTitle, itemContainerValidator } = useModuleSettings()

const { getBusinesses, businesses, dataNotFound, meta, deleteBusiness, changeStatus } = useBusinessApi()
const userStore = useUserStore()

const limit = ref(10);
const searchValue = ref('');
const currentPage = ref(1);
const { truncate, getImage } = useHelper();
const tagStore = useTagStore()
const route = useRoute()

const getUserBusinessess = async (page = 1) => {
    await getBusinesses(route.params?.levelOneslug, {
        user_id: userStore.user.id,
        limit: limit.value,
        keyword: searchValue.value,
        page: page,
        disableStatusFilter: true
    })
}

const previousPage = async () => {
    currentPage.value--;
    await getUserBusinessess(currentPage.value)
}

const nextPage = async () => {
    currentPage.value++;
    await getUserBusinessess(currentPage.value)
}

const deleteItem = async (uuid) => {
    await deleteBusiness(route.params?.levelOneslug, uuid, { user_id: userStore.user.id, page: currentPage.value, keyword: searchValue.value, limit: limit.value });
}

watch(
    limit,
    (newValue, oldValue) => {
        getUserBusinessess()
    }
);

watch(searchValue, (newValue, oldValue) => {
    getUserBusinessess()
});

const changeValue = (data) => {
    if (data.limit) {
        limit.value = data.limit;
    } else {
        searchValue.value = data.search;
    }
}

const changeBusinessStatus = async (business) => {
    const result = await changeStatus(route.params?.levelOneslug, business.id)
    business.status = result?.status
}

onBeforeMount(async () => {
    await getUserBusinessess()
})

</script>
<template>
    <div class="mb-4">
        <div class="d-flex justify-content-end p-4">
            <router-link :to="{ name: 'companies.create' }" class="btn btn-primary">{{ `+ Add ${singularOwnerTitle}`
            }}</router-link>
        </div>
        <Table>
            <template #filters>
                <TableFilters @filters="changeValue" />
            </template>
            <template #content>
                <thead class="table-light">
                    <tr>
                        <th>Name</th>
                        <th v-if="itemContainerValidator('businessRating')">Rating</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody class="table-border-bottom-0">
                    <tr v-if="dataNotFound" class="text-center">
                        <td colspan="5" class="pt-4">
                            {{ dataNotFound }}
                        </td>
                    </tr>
                    <tr v-for="(business) in businesses" :key="business">
                        <td>
                            <div class="d-flex text-inherit">
                                <div class="avatar flex-shrink-0 me-3">
                                    <img :src="business.logo" alt="product" class="rounded" />
                                </div>
                                <span class="d-flex align-items-center text-inherit">{{ truncate(business.name)
                                }}</span>
                            </div>
                        </td>
                        <td v-if="itemContainerValidator('businessRating')">
                            <StarRating star-size="20" v-model:rating="business.reviews_avg" :show-rating="false"
                                :read-only="true" active-color="#ff6846"></StarRating>
                        </td>
                        <td class="text-capitalize">
                            <div class="form-check form-switch mb-2">
                                <input @click.prevent="changeBusinessStatus(business)" class="form-check-input"
                                    type="checkbox" id="flexSwitchCheckChecked"
                                    :checked="business.status === 'active' ? true : false">
                            </div>
                        </td>
                        <td>
                            <div class="dropdown">
                                <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                    <i class="bx bx-dots-vertical-rounded"></i>
                                </button>
                                <div class="dropdown-menu">
                                    <router-link :to="{ name: 'companies.edit', params: { uuid: business.uuid } }"
                                        class="dropdown-item"><i class="bx bx-edit-alt me-1"></i>
                                        Edit</router-link>
                                    <a class="dropdown-item cursor-pointer" @click="deleteItem(business.uuid)"><i
                                            class="bx bx-trash me-1"></i>
                                        Delete</a>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </template>
            <template #pagination>
                <Pagination class="px-4" :meta="meta" @previousPage="previousPage" @nextPage="nextPage" />
            </template>
        </Table>
    </div>
</template>

<style></style>
