import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

const ApiService = {
  
  init() {
    Vue.use(VueAxios, axios)
    Vue.axios.defaults.baseURL = process.env.VUE_APP_API_URL;
  },

  getCancelationToken() {
    const CancelToken = Vue.axios.CancelToken;
    var source = CancelToken.source();
    return source;
  },

  async get(url, params, source) {
    var result = await Vue.axios
      .get(`${url}`, { params: params, cancelToken: source ? source.token : null})
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


  setHeader() {
    //Vue.axios.defaults.headers.common['Authorization'] = `Token ${JwtService.getToken()}`
  },

}

export default ApiService



