import Vue from 'vue'
import App from './app.vue'
import ApiService from '@/services/api.service'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import AsyncComputed from 'vue-async-computed'

Vue.use(BootstrapVue);
Vue.use(AsyncComputed);
Vue.config.productionTip = false

ApiService.init()

StartApp();

async function StartApp() {
  var config = await fetch('portus.config.json')
  config = await config.json();
  window.PC = config;

  new Vue({
    render: h => h(App)
  }).$mount('#app')
}


