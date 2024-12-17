import { ref, inject } from 'vue';
import { useHelper } from './helper';
import { useTagStore } from '@/stores/tags'
import {useToastr} from './toastr'
export const useArticlesApi = () => {
    const $http = inject('$http');
    const { showLoading, hideLoading } = useHelper()
    const tagStore = useTagStore()
    const {toast} = useToastr()

    const addProduct = () => {
      
    }

      return {
        getL2Tags
      }
}