import axios from "axios";
const { VITE_APP_API_URL, VITE_APP_API_KEY } = import.meta.env;
import { useUserStore } from "@stores/user"
import { useRoute } from "vue-router";
const exceptRoutes = [
    'login',
    'signup'
]

const apiClient = axios.create({
    baseURL: VITE_APP_API_URL, // Replace with your Laravel API URL
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

apiClient.interceptors.request.use(function (config) {
    const apiKey = VITE_APP_API_KEY; // Replace with your API key
    const accessToken = getAccessToken();
    config.headers['x-api-key'] = apiKey;
    config.headers['Authorization'] = `Bearer ${accessToken}`;
    return config;
});

function getAccessToken() {
    const userStore = useUserStore();
    const token = userStore.user ? userStore.user.access_token : null;
    return token;
}


export default apiClient;
