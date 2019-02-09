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

  get(url, params, source) {
    return Vue.axios
      .get(`${url}`, { params: params, cancelToken: source ? source.token : null})
      .catch(function (error) {
        if (error.response) {
          throw new Error(error.response.data.error);
        } else {
          throw new Error(error.message);
        }
      });

  },

  post(url, data) {
    return Vue.axios
      .post(`${url}`, data)
      .catch(function (error) {
        if (error.response) {
          throw new Error(error.response.data.error);
        } else {
          throw new Error(error.message);
        }
      });
  }

}

export default ApiService



