import Vue from 'vue'

import App from './app.vue'

import ApiService from '@/services/api.service'
import LocalePlugin from '@/services/locale.plugin'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import AsyncComputed from 'vue-async-computed'
import VueRouter from 'vue-router'

Vue.use(BootstrapVue);
Vue.use(AsyncComputed);
Vue.use(VueRouter);
Vue.use(LocalePlugin);

Vue.config.productionTip = false
ApiService.init();

StartApp();

async function StartApp() {

  var config = await fetch('portus.config.json')
  config = await config.json();
  window.PC = config;

  const routes = [
    { 
      name: 'home',
      path: '/', 
      component: () => import('@/views/homeView.vue') 
    },
    { 
      name: 'predictionWidget', 
      path: '/predictionWidget', // :resourceId 
      props: true,
      component: () => import('@/views/predictionWidgetView.vue')
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


