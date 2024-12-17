<script setup>
import { ref, onBeforeMount, onMounted, inject, onUnmounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import { useWishlist } from '@composables/wishlist'
import { useCategoriesApi } from '@composables/categories'
import { useToastr } from '@composables/toastr'
import { dreamCategoriesStore } from '@/stores/categories'
import { useUserStore } from "@/stores/user"
import { useModuleSettings } from '@composables/modules.js'
import { useTagStore } from '@/stores/tags'
import { useAuthApi } from '@composables/authentication';
import { useBusinessApi } from '@composables/business.js';

const {
    productHeading,
    author,
    articleType,
    iconType,
    FavoriteAuthor,
    favoriteOwners,
    itemContainerValidator,
    companyTitle,
    sideBarOwnerName,
    isBusinessModule,
    userName,
    showPublicProfileToUsers
} = useModuleSettings();
const eventBus = inject('eventBus');
const { getMyCategories } = useCategoriesApi();
const { wishlist } = useWishlist();
const { toast, confirm } = useToastr();
const route = useRoute();
const router = useRouter();
const categoriesStore = dreamCategoriesStore();
const userStore = useUserStore();
const tagStore = useTagStore();


const { logout } = useAuthApi();
const { getBusinesses, businesses } = useBusinessApi()

const limitPerPage = ref(10);
const currentPage = ref(1);
const open = ref('');
const rotate = ref('');
const levelOne = route.params?.levelOneslug;

const user = computed(() => {
    return userStore.user
})

// get favorite reporters
const favoriteReporters = async (type = 'user', loading = false) => {
    await wishlist({
        type: type,
        limit: limitPerPage.value,
        page: currentPage.value,
        module: levelOne
    }, type, loading);
}


// open menu to show sub menu
const openSubMenu = (menu) => {
    if (open.value === menu) {
        open.value = '';
        rotate.value = ''
    } else {
        localStorage.setItem('adminSideBarSubMenu', menu)
        open.value = menu;
        rotate.value = menu
    }
}

// get categories
const getCategories = async (page = 1, loading = false) => {
    try {
        const result = await getMyCategories(levelOne, page, loading)
    } catch (error) {
        toast(error, 'error')
    }
}

const redirectToBuiness = async () => {
    if (itemContainerValidator.value('locked')) {
        router.push({ name: 'companies' })
    } else {
        await confirm('You do not have permission to access this. Please contact Administrator to request access. <br><b>Email:</b> admin@hoopla.com <br><b>Phone:</b> +1 234 567 689', 'Subscribe', 'info', 'Access Denied', false)
    }
}

const redirectToPublicProfile = async () => {
    if (itemContainerValidator.value('lockedPublicProfile')) {
        router.push({ name: 'public-profile' });
    } else {
        await confirm('You do not have permission to access this. Please contact Administrator to request access. <br><b>Email:</b> admin@hoopla.com <br><b>Phone:</b> +1 234 567 689', 'Subscribe', 'info', 'Access Denied', false)
    }
}

const redirectToArticles = async () => {
    if ((itemContainerValidator.value('locked', 'product') && businesses.value.length > 0) || (itemContainerValidator.value('locked') && !isBusinessModule())) {
        router.push({ name: 'articles' })
    } else {
        if (itemContainerValidator.value('locked')) {
            router.push({ name: 'companies' })
        } else {
            await confirm('You do not have permission to access this. Please contact Administrator to request access. <br><b>Email:</b> admin@hoopla.com <br><b>Phone:</b> +1 234 567 689', 'Subscribe', 'info', 'Access Denied', false)
        }
    }
}

const redirectToUsers = async () => {
    if (itemContainerValidator.value('locked')) {
        router.push({ name: 'users.index', params: { userType: 'agents' } });
    } else {
        await confirm('You do not have permission to access this. Please contact Administrator to request access. <br><b>Email:</b> admin@hoopla.com <br><b>Phone:</b> +1 234 567 689', 'Subscribe', 'info', 'Access Denied', false)
    }
}

const redirectToUserSettings = async () => {

    favoriteReporters();
    if (itemContainerValidator.value('locked')) {
        router.push({ name: 'users.settings', params: { levelOneSlug: tagStore.getLevelOneTagSlug, userId: userStore.user.id } });
    } else {
        await confirm('This section is reserved for premium users! Upgrade to a premium account.', 'Subscribe', 'info', 'Access Denied')
    }
}

onBeforeMount(async () => {
    if (isBusinessModule()) {
        getBusinesses(levelOne, {
            user_id: userStore.user.id,
            limit: 1,
            role: userStore.user.user_type
        }, false)
    }

    await getCategories()
    if (route.name == 'admin-add-favorite-catgories') {
        localStorage.setItem('adminSideBarSubMenu', 'my-categories')
    }
    const openMenu = localStorage.getItem('adminSideBarSubMenu')
    open.value = openMenu ? openMenu : ''
    rotate.value = openMenu ? openMenu : ''
})


onMounted(() => {
    eventBus.on('add-reporter-to-Favorite', async () => {
        await favoriteReporters()
    })

    // call the business api when add new business
    eventBus.on('check-businesses', () => {
        getBusinesses(levelOne, {
            user_id: userStore.user.id,
            limit: 1,
        })
    })
})
onUnmounted(() => {
    // Remove the event listener when the component is unmounted
    eventBus.off('add-reporter-to-Favorite')
    eventBus.off('check-businesses')
})
</script>

<template>
    <div id="admin-sidebar" ref="siderbarRef">
      <div v-if="itemContainerValidator('message')">
        <router-link :to="{ name: 'message' }" class="d-flex align-items-center cursor-pointer"
                     :class="route.name == 'message' ? 'active-link' : 'menu-link'">
          <i class='menu-icon tf-icons bx bx-chat'></i>
          <div class="mx-2" data-i18n="message">
            Messages
          </div>
        </router-link>
        <hr>
      </div>

        <router-link :to="{ name: 'dashboard-bookmarked' }" class="d-flex align-items-center cursor-pointer"
            @click="openSubMenu('bookmarked')"
            :class="route.name == 'dashboard-bookmarked' ? 'active-link' : 'menu-link'">
            <i class='menu-icon tf-icons bx bxs-bookmark'></i>
            <div class="mx-2 text-capitalize" data-i18n="Bookmarked News">
                Bookmarked {{ productHeading }}
            </div>
        </router-link>
        <hr>

        <div v-if="itemContainerValidator('myGarage')">
            <router-link :to="{ name: 'garage.index' }" class="d-flex align-items-center cursor-pointer"
                :class="['garage.index', 'garage.form', 'garage.edit', 'garage.tags', 'garage.media', 'garage.view', 'garage.attribute.tags'].includes(route.name) ? 'active-link' : 'menu-link'">
                <i class="menu-icon tf-icons bx bxs-home-alt-2"></i>
                <div class="mx-2 text-capitalize">
                    My Garage
                </div>
            </router-link>
        </div>
        <hr v-if="itemContainerValidator('myGarage')">

        <div v-if="itemContainerValidator('resume')">
            <router-link :to="{ name: 'resume' }" class="d-flex align-items-center cursor-pointer"
                :class="route.name == 'resume' ? 'active-link' : 'menu-link'">
                <i class='menu-icon tf-icons bx bxs-file-blank'></i>
                <div class="mx-2" data-i18n="Resume">
                    My Resume
                </div>
            </router-link>
            <hr>
        </div>

        <div class="cursor-pointer" v-if="favoriteOwners">
            <div class="menu-item " data-i18n="Favorite Reporters">
                <div class="d-flex align-items-center">
                    <i class='menu-icon tf-icons bx bxs-heart'></i>
                    <div class="d-flex justify-content-between align-items-center  w-100"
                        @click="openSubMenu('favorite-reporters')">
                        <div class="menu-link mx-2">{{ FavoriteAuthor }} {{ author }}</div>
                        <div class="d-flex align-items-center">
                            <i class='menu-icon tf-icons bx bx-chevron-right'
                                :class="{ 'rotate active-chevron': rotate === 'favorite-reporters' }"></i>
                        </div>
                    </div>
                </div>
                <div class="sub-menu" :class="{ 'open': open === 'favorite-reporters' }">
                    <div v-for="(favoriteReporter, index) in userStore.getFavoriteUsers" :key="index" class="mb-2">
                        <router-link
                            :to="{ name: 'admin-favorite-reporter-articles', params: { user: favoriteReporter?.user?.id } }"
                            exact active-class="active" class="menu-link d-block ms-3 px-3">
                            <span>{{ favoriteReporter?.user?.name }}</span>
                        </router-link>
                    </div>
                    <router-link :to="{ name: 'admin-reporters' }" class="add-reporter ms-4"
                        :class="route.name != 'admin-reporters' ? 'menu-link' : ''">
                        <i class='menu-icon tf-icons bx bx-plus'></i>
                        Add {{ author }}
                    </router-link>
                </div>
            </div>
        </div>
        <hr class="" v-if="favoriteOwners">

        <div class="cursor-pointer" v-if="itemContainerValidator('myCategories')">
            <div class="menu-item">
                <div class="d-flex align-items-center">
                    <i class='menu-icon tf-icons bx bx-list-ul'></i>
                    <div class="d-flex justify-content-between align-items-center w-100"
                        @click="openSubMenu('my-categories')">
                        <div class="menu-link mx-2">My Categories</div>
                        <i class='menu-icon tf-icons bx bx-chevron-right'
                            :class="{ 'rotate active-chevronslug': rotate === 'my-categories' }"></i>
                    </div>
                </div>
                <div class="sub-menu" :class="{ 'open': open === 'my-categories' }">
                    <div v-for="category in  categoriesStore.latestCategories " :key="category" class="mb-2">
                        <router-link
                            :to="{ name: 'admin-category', params: { levelTwoSlug: category.maker.slug, levelThreeSlug: category.model.slug, levelFourSlug: category.level_four_tag.slug, from: (itemContainerValidator('productYear') || itemContainerValidator('minMaxPrice')) ? category.from ? category.from : category.min_price : null, to: (itemContainerValidator('productYear') || itemContainerValidator('minMaxPrice')) ? category.to ? category.to : category.max_price : null } }"
                            class="menu-link d-block text-capitalize ms-3 px-3" exact active-class="active">
                            <span>{{ (category.model.name + ' ' + (category.level_four_tag &&
            category.level_four_tag.name ?
            category.level_four_tag.name : '')) }}
                                <span v-if="itemContainerValidator('productYear')">{{ '(' + category.from + '-' +
            category.to +
            ')' }}</span>

                                <p v-if="itemContainerValidator('minMaxPrice')">{{ '($' + category.min_price + ' - $' +
            category.max_price +
            ')' }}</p>
                            </span>
                        </router-link>
                    </div>
                    <router-link :to="{ name: 'admin-add-favorite-catgories' }"
                        class="add d-flex align-items-center ms-4"
                        :class="route.name != 'admin-add-favorite-catgories' ? 'menu-link' : ''">
                        <i class='menu-icon tf-icons bx bx-plus'></i>
                        Add Category
                    </router-link>
                </div>
            </div>
        </div>
        <hr class="" v-if="itemContainerValidator('myCategories')">

        <div v-if="itemContainerValidator('yourEvents')">
            <router-link :to="{ name: 'admin-calendar' }" class="d-flex align-items-center cursor-pointer"
                :class="route.name == 'admin-calendar' ? 'active-link' : 'menu-link'">
                <i class='menu-icon tf-icons bx bx-calendar-event'></i>
                <div class="mx-2" data-i18n="calendar">
                    Calendar
                </div>
            </router-link>
            <hr>
        </div>

        <div>
            <p class="text-primary text-center">---- {{ sideBarOwnerName }} Only ----</p>
            <div
                v-if="itemContainerValidator('displayPublicProfile') && !itemContainerValidator('publicProfile') && showPublicProfileToUsers">
                <span @click="openSubMenu('public-profile'); redirectToPublicProfile()"
                    class="d-flex justify-content-between align-items-center cursor-pointer menu-link"
                    :class="['public-profile'].includes(route.name) ? 'active-link' : ''">
                    <div class="d-flex">
                        <i class='menu-icon tf-icons bx bxs-user'></i>
                        <div class="mx-2" data-i18n="Public Profile">
                            Public Profile
                        </div>
                    </div>
                    <i class='menu-icon tf-icons bx '
                        :class="[itemContainerValidator('lockedPublicProfile') ? 'bxs-lock-open' : 'bxs-lock']"></i>
                </span>
                <hr class="">
            </div>
            <div v-if="itemContainerValidator('companies') || itemContainerValidator('organization')">
                <span @click="openSubMenu('companies'); redirectToBuiness()"
                    class="d-flex justify-content-between align-items-center cursor-pointer menu-link"
                    :class="['companies', 'companies.create', 'companies.edit'].includes(route.name) ? 'active-link' : ''">
                    <div class="d-flex">
                        <i class='menu-icon tf-icons bx bxs-business'></i>
                        <div class="mx-2" data-i18n="Companies">
                            {{ companyTitle }}
                        </div>
                    </div>
                    <i class='menu-icon tf-icons bx'
                        :class="[itemContainerValidator('locked') ? 'bxs-lock-open' : 'bxs-lock']"></i>
                </span>
                <hr class="">
            </div>

            <div v-if="itemContainerValidator('users')">
                <span @click="openSubMenu('users'); redirectToUsers()"
                    class="d-flex justify-content-between align-items-center cursor-pointer menu-link"
                    :class="['users.index', 'users.create', 'users.edit'].includes(route.name) ? 'active-link' : ''">
                    <div class="d-flex">
                        <i class='menu-icon tf-icons bx bxs-user'></i>
                        <div class="mx-2" data-i18n="Users">
                            {{ userName }}
                        </div>
                    </div>
                    <i class='menu-icon tf-icons bx'
                        :class="[itemContainerValidator('locked') ? 'bxs-lock-open' : 'bxs-lock']"></i>
                </span>
                <hr class="">
            </div>

            <span @click="openSubMenu('articles'); redirectToArticles()"
                class="d-flex justify-content-between align-items-center cursor-pointer menu-link"
                :class="['articles', 'articles.form', 'articles.tags', 'articles.media', 'articles.view', 'articles.attribute.tags'].includes(route.name) ? 'active-link' : ''">
                <div class="d-flex">
                    <i :class=iconType></i>
                    <div class="mx-2" data-i18n="Articles">
                        {{ articleType }}
                    </div>
                </div>
                <i class='menu-icon tf-icons bx'
                    :class="[(itemContainerValidator('locked', 'product')) && businesses.length > 0 || (itemContainerValidator('locked') && !isBusinessModule()) ? 'bxs-lock-open' : 'bxs-lock']"></i>
            </span>
        </div>
    </div>
</template>