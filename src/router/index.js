import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import GuestLayout from '@/layouts/GuestLayout.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import NewsAuthorView from '../views/NewsAuthorView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 };
  },
  routes: [
    {
      path: "/",
      component: AuthLayout,
      children: [
        {
          path: "/",
          name: "home",
          component: HomeView,
          meta: { requiresAuth: true },
        },

        {
          path: "/about",
          name: "about",
          component: AboutView,
          meta: { requiresAuth: true },
        },

        /**
         * User Profile Routes
         */
        {
          path: "/user-profile",
          name: "user-profile",
          component: NewsAuthorView,
          meta: { requiresAuth: true },
        },

        /**
         * Authenticated User Account Settings Routes
         */
        {
          path: "/account",
          component: () => import("@/views/account/Index.vue"),
          meta: { requiresAuth: true },
          children: [
            {
              path: "profile-detail",
              name: "profile.detail",
              component: () => import("@/views/account/EditProfile.vue"),
            },
            {
              path: "change-password",
              name: "change.password",
              component: () => import("@/views/account/ChangePassword.vue"),
            },
            {
              path: "newspaper-delivery",
              name: "newspaper.delivery",
              component: () =>
                import("@/views/account/newspaper-delivery/Index.vue"),
            },
            {
              path: "newspaper-delivery/create",
              name: "newspaper.delivery.create",
              component: () =>
                import("@/views/account/newspaper-delivery/Create.vue"),
            },
            {
              path: "newspaper-delivery/:address/edit",
              name: "newspaper.delivery.edit",
              component: () =>
                import("@/views/account/newspaper-delivery/Edit.vue"),
            },
          ],
        },

        {
          path: "/dashboard/:levelOneslug",
          component: () => import("@/layouts/AdminLayout.vue"),
          meta: { requiresAuth: true },
          children: [
            {
              path: "",
              name: "dashboard-bookmarked",
              component: () => import("@/views/admin/BookMarked.vue"),
            },
            {
              path: "resume",
              name: "resume",
              component: () => import("@/views/admin/Resume.vue"),
            },
            {
              path: 'favorite-reporter/:user?/articles',
              name: 'admin-favorite-reporter-articles',
              component: () => import('@/views/admin/ArticleList.vue')
            },
            {
              path: "reporters",
              name: "admin-reporters",
              component: () => import("@/views/admin/ReporterList.vue"),
            },
            {
              path: "add/favorite/categories",
              name: "admin-add-favorite-catgories",
              component: () =>
                import("@/views/admin/categories/AddCategory.vue"),
            },
            {
              path: "category/:levelTwoSlug/:levelThreeSlug?/:levelFourSlug?/articles/:from?/:to?",
              name: "admin-category",
              component: () =>
                import("@/views/admin/categories/ProductList.vue"),
            },
            {
              path: 'tickets',
              name: 'tickets',
              component: () => import('@views/admin/TicketList.vue'),
              meta: { requiresAuth: true }
            },
            {
              path: 'message',
              name: 'message',
              component: () => import('@views/admin/Chat.vue'),
              meta: { requiresAuth: true }
            },

            /**
             * Public Profile Route
             */
            {
              path: "public-profile",
              name: "public-profile",
              component: () => import("@/views/admin/PublicProfile.vue"),
            },

            /**
             * Articles Routes
             */
            {
              path: "articles",
              name: "articles",
              component: () => import("@/views/admin/articles/Index.vue"),
            },
            {
              path: "articles/:uuid?/update/create",
              component: () => import("@/views/admin/articles/EditLayout.vue"),
              children: [
                {
                  path: "",
                  name: "articles.form",
                  component: () => import("@/views/admin/articles/BasicInformation.vue"),
                },
                {
                  path: 'media',
                  name: 'articles.media',
                  component: () => import('@/views/admin/articles/Media.vue')
                },
                {
                  path: 'tags',
                  name: 'articles.tags',
                  component: () => import('@/views/admin/articles/Tags.vue')
                },
                {
                  path: 'attribute-tags',
                  name: 'articles.attribute.tags',
                  component: () => import('@/views/admin/articles/AttributeTags.vue')
                }
              ]
            },
            {
              path: "articles/:uuid/view/detail",
              name: 'articles.view',
              component: () => import("@/views/admin/articles/Detail.vue")
            },

            /**
             * Companies Routes
             */
            {
              path: "companies",
              name: "companies",
              component: () => import("@/views/admin/companies/Index.vue")
            },
            {
              path: "companies/create",
              name: "companies.create",
              component: () => import("@/views/admin/companies/Create.vue")
            },
            {
              path: "companies/:uuid/edit",
              name: "companies.edit",
              component: () => import("@/views/admin/companies/Edit.vue")
            },

            /**
             * Garage Routes
             */
            {
              path: "garage",
              name: 'garage.index',
              component: () => import('@/views/admin/garage/Index.vue')
            },
            {
              path: "garage/create",
              name: 'garage.create',
              component: () => import('@/views/admin/garage/Create.vue')
            },
            {
              path: "garage/products/:uuid?/update/create",
              component: () => import("@/views/admin/articles/EditLayout.vue"),
              children: [

                {
                  path: '',
                  name: "garage.form",
                  component: () => import("@/views/admin/articles/BasicInformation.vue"),
                },
                {
                  path: 'media',
                  name: 'garage.media',
                  component: () => import('@/views/admin/articles/Media.vue')
                },
                {
                  path: 'tags',
                  name: 'garage.tags',
                  component: () => import('@/views/admin/articles/Tags.vue')
                },
                {
                  path: 'attribute-tags',
                  name: 'garage.attribute.tags',
                  component: () => import('@/views/admin/articles/AttributeTags.vue')
                }
              ]
            },
            {
              path: 'garage/products/:uuid/view/detail',
              name: 'garage.view',
              component: () => import("@/views/admin/articles/Detail.vue")
            },

            /**
             * Users <Taskers> Routes
             */
            {
              path: ":userType",
              children: [
                {
                  path: '',
                  name: "users.index",
                  component: () => import("@/views/admin/users/Index.vue"),
                },
                {
                  path: 'create',
                  name: "users.create",
                  component: () => import("@/views/admin/users/Create.vue"),
                },
                {
                  path: ':id/edit',
                  name: "users.edit",
                  component: () => import("@/views/admin/users/Edit.vue"),
                }
              ]
            },

            // settings routes
            {
              path: ':levelOneSlug/:userId/settings',
              name: "users.settings",
              component: () => import("@/views/admin/settings/assign-tags/Index.vue"),
            },

            /**
             * admin calendar route
             */
            {
              path: 'calendar',
              name: 'admin-calendar',
              component: () => import('@views/admin/calendar/EventCalendar.vue'),
              meta: { requiresAuth: true }
            }
          ],
        },

        /**
         * Home Pages Routes
         */
        {
          path: "home/:levelOneslug",
          name: "level-one-page",
          component: () => import("@/views/homepages/LevelOne.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: 'home/:levelOneslug/:levelTwoslug',
          name: 'level-two-page',
          component: () => import('@/views/homepages/LevelTwo.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'home/:levelOneslug/:levelTwoslug/:levelThreeslug',
          name: 'level-three-page',
          component: () => import('@/views/homepages/LevelThree.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'home/:levelOneslug/:levelTwoslug/:levelThreeslug/:levelFourslug',
          name: 'level-four-page',
          component: () => import('@/views/homepages/LevelFour.vue'),
          meta: { requiresAuth: true }
        },

        {
          path: ':levelOneslug?/favorite-authors',
          name: 'favorite-authors',
          component: () => import('@/views/FavoriteAuthors.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: ':levelOneslug?/:levelTwoslug?/bookmarks/:type?',
          name: 'bookmarks',
          component: () => import('@views/homepages/BookmarkedItems.vue'),
          meta: { requiresAuth: true }
        },

        {
          path: ':levelOneslug?/popular-makes',
          name: 'popular-makes',
          component: () => import('@views/detailpages/PopularMakes.vue'),
          meta: { requiresAuth: true }
        },

        {
          path: ':levelOneslug?/body-styles',
          name: 'body-styles',
          component: () => import('@views/detailpages/BodyStyles.vue'),
          meta: { requiresAuth: true }
        },


        {
          path: ':levelOneslug?/bookmark-businesses',
          name: 'bookmark-businesses',
          component: () => import('@views/BookmarkedBusiness.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: ':levelOneslug?/my-categories',
          name: 'my.categories',
          component: () => import('@views/MyCategoriesView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: ':levelOneslug?/featured/:type?/:tag?/:l3Tag?',
          name: 'featured',
          component: () => import('@views/detailpages/Featured.vue'),
          meta: { requiresAuth: true }
        },

        {
          path: ':levelOneslug?/featured-businesses',
          name: 'featured-businesses',
          component: () => import('@/views/detailpages/FeaturedBusinesses.vue'),
          meta: { requiresAuth: true }
        },

        {
          path: ':levelOneslug?/featured-businesses',
          name: 'featured-businesses',
          component: () => import('@/views/detailpages/FeaturedBusinesses.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: ':levelOneslug?/today-articles',
          name: 'today-articles',
          component: () => import('@views/detailpages/TodayArticles.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: ':levelOneslug?/products/recently/viewed',
          name: 'recently-viewed',
          component: () => import('@views/detailpages/RecentlyViewedProducts.vue'),
          meta: { requiresAuth: true }
        },

        /**
         * Owner Pages Routes
         */
        {
          path: 'owner/:name/:levelOneslug',
          name: 'owner-level-one',
          component: () => import('@views/ownerhomepages/LevelOne.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'owner/:name/:levelOneslug/:levelTwoslug',
          name: 'owner-level-two',
          component: () => import('@views/ownerhomepages/LevelTwo.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'owner/:name/:levelOneslug/:levelTwoslug/:levelThreeslug',
          name: 'owner-level-three',
          component: () => import('@views/ownerhomepages/LevelThree.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'owner/:name/:levelOneslug/:levelTwoslug/:levelThreeslug/:levelFourslug',
          name: 'owner-level-four',
          component: () => import('@views/ownerhomepages/LevelFour.vue'),
          meta: { requiresAuth: true }
        },

        {
          path: 'artical-detail/:uuid/:levelOneslug',
          name: 'artical-detail',
          component: () => import('@/views/homepages/ArticalDetail.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'automotive/reviews',
          name: 'add-reviews',
          component: () => import('@/views/detailpages/AutomotiveReviews.vue'),
          meta: { requiresAuth: true }
        },

        {
          path: ':levelOneslug?/popular',
          name: 'popular',
          component: () => import('@views/detailpages/PopularProducts.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: ':levelOneslug/:levelTwoslug?/latest',
          name: 'latest-products',
          component: () => import('@views/detailpages/LatestProducts.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: ':levelOneslug/calendar',
          name: 'events-calendar',
          component: () => import('@views/detailpages/EventCalendar.vue'),
          meta: { requiresAuth: true }
        }
      ],


    },

    /**
     * Authentication Routes
     */
    {
      path: "/",
      component: GuestLayout,
      children: [
        {
          path: "/login",
          name: "login",
          component: Login,
        },
        {
          path: "/signup",
          name: "signup",
          component: Signup,
        },
      ],
    },

    // not found route
    {
      path: "/404",
      name: "not-found",
      component: () => import("@/views/error/NotFound.vue"),
      meta: { requiresAuth: true }
    }
  ],
});

// check if user is auth or not
router.beforeEach((to, from, next) => {
  // get user
  const user = localStorage.getItem("user");
  if (to.meta.requiresAuth && !user) {
    next({ name: "login" });
  } else if (user && !to.meta.requiresAuth) {
    next({ name: "home" });
  } else {
    next();
  }
});

export default router;