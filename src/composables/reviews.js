import { inject, ref } from "vue"
import { useUserStore } from '@/stores/user'
import { useHelper } from '@composables/helper'
import { useToastr } from '@composables/toastr'
import { useMessage } from "./message";
import { forEach } from "lodash";

export const reviews = () => {
    const { recordNotFound } = useMessage()
    const userStore = useUserStore();
    const { toast, } = useToastr();
    const { otpNotVerified, inValidToken, showLoading, hideLoading, } = useHelper();
    const $http = inject('$http');
    const eventBus = inject('eventBus')
    const token = userStore?.user?.access_token;
    const errors = ref({});
    const data = ref();
    const meta = ref();
    const rating = ref();
    const automotiveData = ref();
    const dataNotFound = ref(null)
    const automotiveLevel2 = ref(null);
    const ratings = ref(null);
    const product_year = ref('');

    const message = ref();
    const updateOrCreateReviews = async (data, module, component) => {
        try {
            showLoading(component)
            const response = await $http.post(`/api/${module}/reviews`, data);
            errors.value = {};
            hideLoading()
            toast(response?.data?.message);
            return response?.status;
        } catch (exception) {
            hideLoading();
            errors.value = exception?.response?.data?.message;
            otpNotVerified(exception?.response?.status);
            inValidToken(exception?.response?.data?.message);
        }
    }

    const getreviews = async (module, params, component) => {
        try {
            showLoading(component)
            const response = await $http.get(`/api/${module}/reviews`, {
                params: params
            });

            ratings.value = response.data.data.ratings;
            data.value = response.data.data.reviews
            if (params?.type == 'business' && data.value.length > 0) {
                let ratingSum = 0
                data.value.forEach(element => {
                    ratingSum = ratingSum + parseFloat(element.rating)
                });
                const avg_rating = ratingSum / data.value.length
                eventBus.emit('avg_rating', {
                    rating: avg_rating
                })
            }
            dataNotFound.value = data.value.length == 0 ? recordNotFound() : null
            meta.value = response.data.meta
            hideLoading()
        } catch (exception) {
            errors.value = exception?.response?.data?.message;
            hideLoading()
            otpNotVerified(exception?.response?.status);
            inValidToken(exception?.response?.data?.message);
        }
    }

    const automotiveReviews = async (module, component = null) => {
        try {

            showLoading(component)
            const response = await $http.get(`/api/level/two/${module}`, {
            });

            automotiveData.value = transform(response.data.data)
            hideLoading()

        } catch (exception) {
            hideLoading()
            otpNotVerified(exception?.response?.status);
            inValidToken(exception?.response?.data?.message);
        }
    };

    const Makers = async (module, component = null) => {
        try {
            showLoading(component)
            const response = await $http.get(`/api/level/three/automotive/${module}`, {
                review_flag: true
            });
            product_year.value = transformYear(response.data.data)
            automotiveLevel2.value = transform(response.data.data)
            hideLoading()
        } catch (exception) {
            hideLoading()
            otpNotVerified(exception?.response?.status);
            inValidToken(exception?.response?.data?.message);
        }
    };

    const transform = (reviews) => {
        let transformedData = [];
        reviews.map((item) => {
            transformedData.push(
                {
                    id: item.id,
                    text: item.name
                }
            );
        })
        return transformedData;
    }


    const transformYear = (reviews) => {
        let transformedYears = [];
        reviews.forEach((item) => {
            let years = item.products.map((product) => {
                return product.vehicle.year;
            });
            transformedYears.push(...years);
        });
        return transformedYears;

    };

  

    return {
        updateOrCreateReviews,
        getreviews,
        data,
        meta,
        message,
        errors,
        dataNotFound,
        automotiveReviews,
        Makers,
        automotiveData,
        automotiveLevel2,
        rating,
        ratings,
        product_year

    }

}