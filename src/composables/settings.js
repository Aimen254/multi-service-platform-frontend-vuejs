import { ref, inject } from 'vue';
import { useToastr } from './toastr';
import { useSettingsStore } from "@stores/settings";
import { useHelper } from './helper';

export const useSettingsApi = () => {
    const { showLoading, hideLoading, inValidToken } = useHelper();

    const $http = inject('$http');
    const { toast } = useToastr()
    const settingsStore = useSettingsStore();

    const getSettings = async (module) => {
        try {
            const response = await $http.get('/api/settings');
            settingsStore.saveSettings(response.data)
        } catch (e) {
            toast(e.response.data.message, 'error');
            inValidToken(e?.response?.data?.message);
        }
    }

    return {
        getSettings
    }
}