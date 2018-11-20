import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

const ApiService = {
  
  init() {
    Vue.use(VueAxios, axios)
    Vue.axios.defaults.baseURL = process.env.VUE_APP_API_URL;
  },

  async get(url, params) {
    var result = await Vue.axios
      .get(`${url}`, { params: params })
      .catch((error) => {
        throw new Error(`[RWV] ApiService ${error}`)
      });
    return result;

  },

  async post(url, data) {
    var result = await Vue.axios
      .post(`${url}`, data)
      .catch((error) => {
        throw new Error(`[RWV] ApiService ${error}`)
      });
    return result;

  },

  getNotAsync(resource, params) {
    return Vue.axios
      .get(`${resource}`, { params: params })
      .catch((error) => {
        throw new Error(`[RWV] ApiService ${error}`)
      })

  },

 
  setHeader() {
    //Vue.axios.defaults.headers.common['Authorization'] = `Token ${JwtService.getToken()}`
  },

}

export default ApiService



