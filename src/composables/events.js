import { ref, inject } from "vue";
import { useUserStore } from "../stores/user";
import { useHelper } from "./helper";
import { useToastr } from "./toastr";
import { useRoute } from "vue-router";

export const useEvents = () => {
    const userStore = useUserStore();
    const $http = inject("$http");
    const eventBus = inject('eventBus')
    const { toast, confirm } = useToastr();
    const { showLoading, hideLoading, inValidToken, otpNotVerified, } = useHelper();
    const route = useRoute();
    const errors = ref("");
    const events = ref([]);
    const meta = ref({})

    const getCalendarEvents = async (module, params, container = null) => {
        try {
            container ? showLoading(container) : ''
            const response = await $http.get(`api/${module}/calendar-events`, {
                params: params,
            });
            events.value = response?.data?.data
            meta.value = response?.data?.meta;
            container ? hideLoading() : ''
            return events.value
        } catch (error) {
            container ? hideLoading() : ''
            toast(error?.response?.data?.message);
            inValidToken(error?.response?.data?.message);
        }
    };

    const changeStatus = async (module, id, event) => {
        try {
            const result = await confirm('You want to change status?', 'Yes, Change Status!');
            if (result.isConfirmed) {
                showLoading()
                const data = { 'status': event?.target?.value }
                const response = await $http.post(`api/${module}/calendar-events/change-status/${id}`, data)
                eventBus.emit('calendar-event-status', {
                    event: response?.data?.data
                })
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
        events,
        getCalendarEvents,
        changeStatus
    };
};