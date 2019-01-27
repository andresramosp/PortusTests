import Vue from 'vue'

import App from './app.vue'

import ApiService from '@/services/api.service'
import UserPrefs from '@/services/userPrefs.service'
import LocalePlugin from '@/services/locale.plugin'
import BootstrapVue from 'bootstrap-vue'
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import AsyncComputed from 'vue-async-computed'
import VueRouter from 'vue-router'

require('es6-promise').polyfill();
require('isomorphic-fetch');

Vue.use(BootstrapVue);
Vue.use(AsyncComputed);
Vue.use(VueRouter);
Vue.use(LocalePlugin);
ApiService.init();

Vue.config.productionTip = false

StartApp();

async function StartApp() {

  var config = await fetch('portus.config.json')
  config = await config.json();
  config.user_preferences = UserPrefs.getUserPrefs();
  config.mobile_device = isMobile();

  window.PC = config;

  const routes = [
    { 
      name: 'home',
      path: '/', 
      component: () => import('@/views/homeView.vue') 
    },
    { 
      name: 'predictionWidget', 
      path: '/predictionWidget', 
      props: true,
      component: () => import('@/views/predictionWidgetView.vue')
    },
    { 
      name: 'locationsWidget', 
      path: '/locationsWidget', 
      props: true,
      component: () => import('@/views/locationsWidgetView.vue')
    },
    { 
      name: 'locationsRTWidget', 
      path: '/locationsRTWidget', 
      props: true,
      component: () => import('@/views/locationsRTWidgetView.vue')
    },
    { 
      name: 'locationsPredWidget', 
      path: '/locationsPredWidget', 
      props: true,
      component: () => import('@/views/locationsPredWidgetView.vue')
    },
    { 
      name: 'locationsGraphsWidget', 
      path: '/locationsGraphsWidget', 
      props: true,
      component: () => import('@/views/locationsGraphsWidgetView.vue')
    },
    { 
      name: 'dataTablesPredWidget', 
      path: '/dataTablesPredWidget', 
      props: true,
      component: () => import('@/views/dataTablesPredWidgetView.vue')
    }
  ]

  const router = new VueRouter({
    routes,
    //mode: 'history'
  })

  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
}


