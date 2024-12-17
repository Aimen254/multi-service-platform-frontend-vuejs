<script setup>
import { ref, computed } from 'vue'
import Error from '@components/core/Error.vue'
import Button from '@components/core/Button.vue'
import CancelButton from '@components/core/CancelButton.vue'
import { useAddress } from '@composables/address'

const { updateOrCreateAddress, errors } = useAddress();
const createComponent = ref({}); // property to assign object of component
const form = ref({
    name: '',
    address: '',
    note: '',
    type: 'newspaper',
    status: 'inactive',
    is_default: false
});

const submit = async () => {
    form.value.is_default ? form.value.status = 'active' : form.value.status = 'inactive';
    let result = await updateOrCreateAddress(form.value, createComponent.value);
    if (result == 200) {
        form.value.name = '';
        form.value.address = '';
        form.value.note = '';
        form.value.is_default = false;
    }

}
</script>

<template>
    <div class="my-3" ref="createComponent">
        <h5 class="card-header">Create Newspaper Delivery Address</h5>
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
                            <input type="checkbox" class="switch-input" v-model="form.is_default" />
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
                    <!-- <CancelButton /> -->
                </div>
            </form>
        </div>
    </div>
</template>