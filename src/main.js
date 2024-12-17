import '@/assets/scss/main.scss';
import 'boxicons/css/boxicons.css'
import 'bootstrap/dist/js/bootstrap.js'
import '@popperjs/core'
import 'boxicons'


import Select2 from 'vue3-select2-component';


import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { LoadingPlugin } from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'

import '@vuepic/vue-datepicker/dist/main.css'


import App from './App.vue'
import router from './router'
import apiClient from './axios';
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'myCustomTheme',
    themes: {
      myCustomTheme: {
        dark: false,
        colors: {
          primary: '#ff6846',
          secondary: '#203343'
        },
      },
    },
  },
})

import mitt from 'mitt';
const eventBus = mitt();

const app = createApp(App)

app.component('Select2', Select2)
app.use(createPinia())
app.use(vuetify)
app.use(router)
app.use(LoadingPlugin)
app.use(VueSweetalert2)
app.use(PerfectScrollbar)
app.provide('$http', apiClient)
app.provide('eventBus', eventBus)
app.mount('#app')
