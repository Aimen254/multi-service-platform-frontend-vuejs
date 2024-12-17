<script setup>
import { ref, onMounted } from 'vue'
import Error from '@components/core/Error.vue'
import Button from '@components/core/Button.vue'
import { useAddress } from '@composables/address'
import { useRoute } from 'vue-router';

const { editAddress, address, updateOrCreateAddress, errors } = useAddress();
const route = useRoute();

const editComponent = ref({}); // property to assign object of component
const form = ref({
    id: '',
    name: '',
    address: '',
    note: '',
    type: 'newspaper',
    is_default: false
});

// calling edit api to get specific address data
const editNewspaperDeliveryAddress = async () => {
    await editAddress(route?.params?.address, editComponent.value);
    form.value.id = address.value.id;
    form.value.name = address.value.name;
    form.value.address = address.value.address;
    form.value.note = address.value.note;
    form.value.type = address.value.type;
    form.value.is_default = address.value.is_default;
}

// update the newspaper delivery address
const submit = async () => {
    await updateOrCreateAddress(form.value, editComponent.value);
}

// on mount hook
onMounted(() => {
    editNewspaperDeliveryAddress();
});
</script>

<template>
    <div class="my-3" ref="editComponent">
        <h5 class="card-header">Edit Newspaper Delivery Address</h5>
        <div class="card-body">
            <form id="" method="POST" @submit.prevent="submit()">
                <div class="row">
                    <div class="mb-3 col-md-6">
                        <label for="addressName" class="form-label required">Address Name</label>
                        <input class="form-control" :class="{ 'is-invalid border border-danger': errors?.name }" type="text"
                            id="addressName" v-model="form.name" autofocus placeholder="Enter address name" />
                        <Error v-if="errors?.name" :message="errors?.name[0]"></Error>
                    </div>
                    <div class="mb-3 col-md-6">
                        <label for="newspaperDeliveryAddress" class="form-label required">Address</label>
                        <input class="form-control" :class="{ 'is-invalid border border-danger': errors?.address }"
                            type="text" id="newspaperDeliveryAddress" v-model="form.address" autofocus
                            placeholder="Enter address name" />
                        <Error v-if="errors?.address" :message="errors?.address[0]"></Error>
                    </div>
                    <div class="mb-3 col-12">
                        <label class="form-label" for="addressNote">Note</label>
                        <div class="input-group input-group-merge">
                            <textarea id="addressNote" class="form-control" style="resize: none;" placeholder="Enter a note"
                                v-model="form.note"></textarea>
                        </div>
                    </div>
                    <div class="mb-3 col-12">
                        <label class="switch">
                            <input type="checkbox" class="switch-input" v-model="form.is_default" :checked="form?.is_default"
                                :value="addressStatus" />
                            <span class="switch-toggle-slider">
                                <span class="switch-on"></span>
                                <span class="switch-off"></span>
                            </span>
                            <span class="switch-label">Set as default</span>
                        </label>
                    </div>
                </div>
                <div class="mt-2">
                    <Button type="submit" :btnClasses="'btn btn-primary me-2'">Save changes</Button>
                    <CancelButton />
                </div>
            </form>
        </div>
    </div>
</template>