import { ref, onBeforeMount, inject } from "vue"
import moment from "moment"
import { useUserStore } from "@stores/user"
import { useLoading } from 'vue-loading-overlay'
import placeholder from '@assets/images/placeholders/placeholder.png'
import avatar from '@assets/images/placeholders/no_avatar.jpg'
import cover from '@assets/images/placeholders/cover.jpg'
import { useRouter } from "vue-router";
import { useToastr } from './toastr'
import { useTagStore } from '@stores/tags'
import wNumb from 'wnumb';
const { VITE_APP_BASE_URL } = import.meta.env;

export const useHelper = () => {

    const $loading = useLoading();
    const userStore = useUserStore();
    const router = useRouter();
    const { toast } = useToastr();
    const tagStore = useTagStore();
    const $http = inject("$http");


    /**
     * ====================================================================>
     * Data Properties
     * ====================================================================>
     */
    const isMenuCollapsed = ref(false); // property to assign bool value of menu
    const hasLayoutExpanded = ref(false); // property to assign bool value of layout

    /**
     * ====================================================================>
     * Methods
     * ====================================================================>
     */
    // check user verification
    const otpNotVerified = (status) => {
        if (status == 403) {
            console.log(status);
        }
    }

    // check user authentication
    const inValidToken = (message) => {
        if (message == 'Unauthenticated.') {
            userStore.unSet();
            router.push('/login');
            tagStore.removeLevelOneTag();
            tagStore.removeLevelTwoTag();
            tagStore.removeLevelThreeTag();
            tagStore.removeLevelFourTag();
        }
    }

    // sidebar toggling
    const toggleMenu = () => {
        checkLayoutHasExpandedClass();

        if (getDocumentWidth() <= 1199) {
            hasLayoutExpanded.value
                ? document.documentElement.classList.remove('layout-menu-expanded')
                : document.documentElement.classList.add('layout-menu-expanded');
        } else {
            isMenuCollapsed.value = !isMenuCollapsed.value;
            if (isMenuCollapsed.value) {
                document.documentElement.classList.add('layout-menu-collapsed');
            } else {
                document.documentElement.classList.remove('layout-menu-collapsed');
            }
            localStorage.setItem('menu-collapsed', isMenuCollapsed.value.toString());
        }
    }


    /**
     * check 'layout-menu-expanded' class
     * exist or not
     */
    const checkLayoutHasExpandedClass = () => {
        hasLayoutExpanded.value = document
            .querySelector('html')
            .classList
            .contains('layout-menu-expanded');
    }

    // get width of client browser
    const getDocumentWidth = () => {
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }

    /**
     * if you want to display loader on specific component you need to send
     * that component reference and if you want to display custom loader
     * you have to send component
     */
    var loader = null
    const showLoading = (container = null) => {
        loader = $loading.show({
            container: container,
            color: '#ff6846',
        });
        document.documentElement.style.overflow = 'hidden';
    }

    // hide loader
    const hideLoading = async () => {
        await loader.hide();
        document.documentElement.style.removeProperty('overflow');
    }

    // get image with complete url
    const getImage = (image, type = null) => {
        if (!image) {
            switch (type) {
                case 'avatar':
                    return avatar;
                case 'cover':
                    return cover;
                default:
                    return placeholder;
            }
        }

        if (image.includes('http')) {
            return image;
        }

        return `${VITE_APP_BASE_URL}${image}`;
    }

    // truncate the length of string
    const truncate = (string, limit = 30, end = '...') => {
        return (string?.length > limit
            ? string.slice(0, limit) + end
            : string)
    }

    // set the format of date or time
    const formatDateTime = (date, format = 'DD MMM, YYYY') => {
        return moment(date).format(format);
    }

    // resetting the string formats
    const resetStringFormat = (string) => {
        string = capitalizeWords(string);
        return string.replace(/[-_]/g, ' ');
    }

    // capital first letter
    function ucfirst(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    function capitalizeWords(word) {
        const wordsToCapitalize = ["sku", "vin", "mpg"];
        const words = word.split(" ");

        const capitalizedWords = words.map(word => {
            return wordsToCapitalize.includes(word.toLowerCase()) ? word.toUpperCase() : word;
        });

        return capitalizedWords.join(" ");
    }
    // format number to  Currency
    function formatCurrency(value) {
        return value ? wNumb({ decimals: 0, thousand: ',' }).to(value) : '';
    }

    // check if admin is active or not in sidebar
    const isAdminActive = (route) => {
        const adminRoutes = [
            'admin-reporters',
            'admin-add-favorite-catgories',
            'admin-category',
            'dashboard-bookmarked',
            'admin-favorite-reporter-articles',
            'articles.create',
            'articles',
            'articles.form',
            'articles.media',
            'articles.tags',
            'articles.view',
            'articles.attribute.tags',
            'garage.form',
            'garage.media',
            'garage.tags',
            'garage.attribute.tags',
            'garage.view',
            'public-profile',
            'resume',
            'companies.create',
            'companies',
            'companies.edit',
            'users.index',
            'users.create',
            'users.edit',
            'users.settings',
            'tickets',
            'admin-calendar',
            'message',
        ];
        return adminRoutes.includes(route);
    }

    // check if routes are not of home pages
    const isHomePages = (route) => {
        const routes = [
            'admin-reporters',
            'account',
            'admin-add-favorite-catgories',
            'admin-category',
            'dashboard-bookmarked',
            'admin-favorite-reporter-articles',
            'profile.detail',
            'newspaper.delivery',
            'articles',
            'articles.form',
            'articles.edit',
            'articles.tags',
            'garage.edit',
            'garage.media',
            'garage.tags',
            'garage.view',
            'garage.attribute.tags',
            'public-profile',
            'articles.edit.media',
            'articles.attribute.tags',
            'articles.media',
            'newspaper.delivery.create',
            'newspaper.delivery.edit',
            'change.password',
            'artical-detail',
            'articles.view',
            'resume',
            'companies.create',
            'companies',
            'companies.edit',
            'garage.index',
            'garage.form',
            'garage.view',
            'users.index',
            'users.create',
            'users.edit',
            'users.settings',
            'tickets',
            'admin-calendar',
            'message'
        ];
        return routes.includes(route);
    }

    // check if route are of pages in which ads will not diplay
    const isAdPages = (route) => {
        const routes = [
            'artical-detail'
        ]
        return routes.includes(route)
    }

    //chheck if route are of pages level one, two, three on which horizantal ads display
    const isLevelPages = (route) => {
        const routes = [
            'level-one-page',
            'level-two-page',
            'level-three-page',
            'home'
        ]
        return routes.includes(route)
    }
    const isNoAdPages = (route) => {
        const routes = [
            'owner-level-four',
            'level-four-page',
        ]
        return routes.includes(route)
    }

    // remove html form text
    const removeHtml = (htmlText) => {
        let cleanedString = htmlText.replace(/<[^>]*>/g, '');
        cleanedString = cleanedString.replace(/ +/g, ' ');
        // Remove leading and trailing spaces
        cleanedString = cleanedString.trim();
        return cleanedString;
    }

    // formate error message
    const formatErrorMessage = (text) => {
        return text.replace(/[-]/g, ' ');
    }
    /**
     * ====================================================================>
     * Lifecycle Hooks
     * ====================================================================>
     */
    // before mounting hook
    onBeforeMount(() => {
        const storedValue = localStorage.getItem('menu-collapsed');
        if (storedValue !== null) {
            isMenuCollapsed.value = storedValue === 'true';
            isMenuCollapsed.value
                ? document.documentElement.classList.add('layout-menu-collapsed')
                : document.documentElement.classList.remove('layout-menu-collapsed');
        }
    });

    // returns reactive properties and methods
    return {
        otpNotVerified,
        inValidToken,
        toggleMenu,
        showLoading,
        hideLoading,
        getImage,
        truncate,
        formatDateTime,
        resetStringFormat,
        ucfirst,
        isAdminActive,
        isHomePages,
        isAdPages,
        isLevelPages,
        removeHtml,
        formatErrorMessage,
        formatCurrency,
        capitalizeWords,

    }
}