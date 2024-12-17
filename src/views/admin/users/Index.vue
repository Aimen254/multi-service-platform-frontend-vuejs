<script setup>
import { ref, watch, onBeforeMount } from 'vue';
import { RouterLink } from 'vue-router';
import { useHelper } from '@composables/helper';
import Table from '@components/core/Table.vue';
import Pagination from '@components/core/Pagination.vue';
import TableFilters from '@components/core/TableFilters.vue';
import { useTagStore } from '@/stores/tags.js';
import { useUser } from '@composables/user.js';
import { useUserStore } from '@stores/user.js'
import { useModuleSettings } from '@composables/modules.js'

const { singularUserName, itemContainerValidator } = useModuleSettings()

const { userList, meta, users, updateUserStatus, deleteUser, dataNotFound } = useUser()
const userStore = useUserStore()

const limit = ref(10);
const searchValue = ref('');
const currentPage = ref(1);
const { truncate, getImage } = useHelper();
const tagStore = useTagStore()

const getUsers = async (page = 1) => {
    await userList({
        user_type: 'agent',
        limit: limit.value,
        keyword: searchValue.value,
        page: page,
    });
}

const previousPage = async () => {
    currentPage.value--;
    await getUsers(currentPage.value)
}

const nextPage = async () => {
    currentPage.value++;
    await getUsers(currentPage.value)
}

const changeUserStatus = async (user) => {
    let result = await updateUserStatus({
        user_type: 'agent'
    }, user.id);
    user.status = result?.status;
}

const destroyUser = async (id) => {
    await deleteUser({
        user_type: 'agent',
        limit: limit.value,
        page: currentPage.value
    }, id);
}

watch(
    limit,
    (newValue, oldValue) => {
        getUsers()
    }
);

watch(searchValue, (newValue, oldValue) => {
    getUsers()
});

const changeValue = (data) => {
    if (data.limit) {
        limit.value = data.limit;
    } else {
        searchValue.value = data.search;
    }
}

onBeforeMount(async () => {
    await getUsers()
})

</script>
<template>
    <div class="mb-4">
        <div class="d-flex justify-content-end p-4">
            <router-link :to="{ name: 'users.create', params: { userType: 'agents' } }" class="btn btn-primary">{{ `+ Add
                ${singularUserName}`
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
                        <th>Role</th>
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
                    <tr v-for="(user) in users" :key="user">
                        <td>
                            <div class="d-flex text-inherit">
                                <div class="avatar flex-shrink-0 me-3">
                                    <img :src="user.avatar" alt="product" class="rounded" />
                                </div>
                                <span class="d-flex align-items-center text-inherit">{{ truncate(user.name)
                                }}</span>
                            </div>
                        </td>
                        <td>
                            <span class="text-capitalize">{{ user.user_type }}</span>
                        </td>
                        <td class="text-capitalize">
                            <div class="form-check form-switch mb-2">
                                <input @click.prevent="changeUserStatus(user)" class="form-check-input"
                                    type="checkbox" id="flexSwitchCheckChecked"
                                    :checked="user.status === 'active' ? true : false">
                            </div>
                        </td>
                        <td>
                            <div class="dropdown">
                                <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                    <i class="bx bx-dots-vertical-rounded"></i>
                                </button>
                                <div class="dropdown-menu">

                                    <router-link :to="{ name: 'users.edit', params: { userType: 'agents', id: user.id } }"
                                        class="dropdown-item"><i class="bx bx-edit-alt me-1"></i>
                                        Edit</router-link>
                                    <a class="dropdown-item cursor-pointer" @click="destroyUser(user.id)"><i
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
