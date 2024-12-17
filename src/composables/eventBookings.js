import { ref, inject } from "vue";
import { useUserStore } from "../stores/user";
import { useHelper } from "./helper";
import { useToastr } from "./toastr";
import { useRoute } from "vue-router";

export const useBookings = () => {
    const userStore = useUserStore();
    const $http = inject("$http");
    const eventBus = inject('eventBus')
    const { toast, confirm } = useToastr();
    const { showLoading, hideLoading, inValidToken, otpNotVerified, } = useHelper();
    const route = useRoute();
    const errors = ref("");
    const bookings = ref([]);
    const meta = ref({})

    const getBookings = async (module, params, container = null) => {
        try {
            container ? showLoading(container) : ''

            const response = await $http.get(`api/${module}/bookings`, {
                params: params,
            });
            bookings.value = response?.data?.data
            meta.value = response?.data?.meta;
            container ? hideLoading() : ''
            return bookings.value
        } catch (error) {
            container ? hideLoading() : ''
            toast(error?.response?.data?.message);
            inValidToken(error?.response?.data?.message);
        }
    };

    const bookEvent = async (module, data) => {
        try {
            showLoading()
            const response = await $http.post(`api/${module}/bookings`, data)
            eventBus.emit('booking-status', {
                booking: response?.data?.data
            })
            hideLoading()
            toast(response?.data?.message);
            return response
        } catch (error) {
            hideLoading();
            toast(error?.response?.data?.message, 'error');
            inValidToken(error?.response?.data?.message);
        }

    }

    const changeStatus = async (module, id, event) => {
        try {
            const result = await confirm('You want to change status?', 'Yes, Change Status!');
            if (result.isConfirmed) {
                showLoading()
                const data = { 'status': event?.target?.value }
                const response = await $http.put(`api/${module}/bookings/${id}`, data)
                eventBus.emit('booking-status', {
                    booking: response?.data?.data
                })
                if (route.name === 'tickets') {
                    await getBookings(module);
                }
                hideLoading()
                toast(response?.data?.message,);
                return response
            }
        } catch (error) {
            hideLoading();
            toast(error?.response?.data?.message, 'error');
            inValidToken(error?.response?.data?.message);
        }
    }

    return {
        meta,
        bookings,
        getBookings,
        bookEvent,
        changeStatus
    };
};