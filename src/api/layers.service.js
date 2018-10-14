import ApiService from './api.service'

import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

const LayersService = {

  init () {
    Vue.use(VueAxios, axios)
    Vue.axios.defaults.baseURL = 'http://localhost:8080/';
  },

  get (idLayer) {
    return fetch('layers.json')
      .then(response => { 
        return response.json()
          .then(json => {
             return json.filter(l => { return l.id == idLayer })[0];
        })
      })
      .catch((error) => {
        throw new Error(`[RWV] ApiService ${error}`)
      })
  }
  
}

export default LayersService


