import Vue from 'vue'
import App from './App.vue'
import ApiService from '@/api/api.service'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue);

Vue.config.productionTip = false

ApiService.init()

new Vue({
  render: h => h(App)
}).$mount('#app')
