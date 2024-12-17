<script setup>
import { onMounted, ref } from 'vue';
import Table from '@components/core/Table.vue'
import Pagination from '@components/core/Pagination.vue'
import { useAddress } from '@composables/address'
import DeleteIcon from '@components/icons/DeleteIcon.vue'

const { addresses, meta, getAddresses, updateAddressStatus, deleteAddress, dataNotFound } = useAddress();
const currentPage = ref(1); // property default selected page
const limitPerPage = ref(4); // property default limit of items
const indexComponent = ref({}); // property to assign object of component

// get newspaper delivery addresses
const newspaperDeliveryAddresses = async (page = 1) => {
    await getAddresses({
        limit: limitPerPage.value,
        page: page
    }, indexComponent.value);
}

// update the status of newspaper delivery addresses
const updateNewspaperDeliveryAddressStatus = async (id) => {
    await updateAddressStatus(id, {
        limit: limitPerPage.value,
        page: meta?.value?.current_page
    }, indexComponent.value);
}

// delete newspaper delivery address
const deleteNewspaperDeliveryAddress = async (id) => {
    await deleteAddress(id, {
        limit: limitPerPage.value,
        page: meta?.value?.current_page
    }, indexComponent.value);
}

/**
 * calling api with current page param
 * for previous page
 */
const previousPage = async () => {
    currentPage.value--;
    await newspaperDeliveryAddresses(currentPage.value);
}

/**
 * calling api with current page param
 * for next page
 */
const nextPage = async () => {
    currentPage.value++;
    await newspaperDeliveryAddresses(currentPage.value);
}

// on mount hook
onMounted(() => {
    newspaperDeliveryAddresses()
})
</script>

<template>
    <div ref="indexComponent">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h5>Newspaper Delivery</h5>
            <div>
                <router-link :to="{ name: 'newspaper.delivery.create' }" class="btn btn-primary">
                    <span class="tf-icons bx bx-plus me-1"></span>Add New
                </router-link>
            </div>
        </div>
        <Table>
            <template #content>
                <thead>
                    <tr>
                        <th>Address</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody class="table-border-bottom-0">
                    <tr v-if="dataNotFound" class="text-center">
                        <td colspan="5" class="pt-4">
                            {{ dataNotFound }}
                        </td>
                    </tr>
                    <tr v-for="(address, index) in addresses" :key="index">
                        <td>
                            {{ address?.street_address + ' ' + address?.address }}
                            <sup class="badge bg-label-primary text-capitalize" style="line-height: 0.45;"
                                v-if="address?.is_default">Default</sup>
                        </td>
                        <td>
                            <label class="switch">
                                <input type="checkbox" class="switch-input"
                                    @change="updateNewspaperDeliveryAddressStatus(address?.id)"
                                    :checked="address?.status == 'active'" />
                                <span class="switch-toggle-slider">
                                    <span class="switch-on"></span>
                                    <span class="switch-off"></span>
                                </span>
                            </label>
                        </td>
                        <td>
                            <div class="d-inline-block text-nowrap">
                                <router-link :to="{ name: 'newspaper.delivery.edit', params: { address: address?.id } }"
                                    title="Edit" class="text-inherit p-1"><i class="bx bx-edit"></i></router-link>
                                <DeleteIcon class="text-inherit p-1" @click="deleteNewspaperDeliveryAddress(address?.id)" />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </template>
            <template #pagination>
                <Pagination :meta="meta" @previousPage="previousPage" @nextPage="nextPage" />
            </template>
        </Table>
    </div>
</template>