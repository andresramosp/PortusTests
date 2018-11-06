import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

const ApiService = {
  init () {
    Vue.use(VueAxios, axios)
    Vue.axios.defaults.baseURL = process.env.VUE_APP_API_URL; 
  },

  async get (url) {
    var result = await Vue.axios
      .get(`${url}`)
      .catch((error) => {
        throw new Error(`[RWV] ApiService ${error}`)
      });
    return result;
      
  },

   getNotAsync (resource, slug = '') {
   return Vue.axios
     .get(`${resource}/${slug}`)
     .catch((error) => {
       throw new Error(`[RWV] ApiService ${error}`)
     })
     
 },

  post (resource, params) {
    return Vue.axios.post(`${resource}`, params)
  },

  update (resource, slug, params) {
    return Vue.axios.put(`${resource}/${slug}`, params)
  },

  put (resource, params) {
    return Vue.axios
      .put(`${resource}`, params)
  },

  delete (resource) {
    return Vue.axios
      .delete(resource)
      .catch((error) => {
        throw new Error(`[RWV] ApiService ${error}`)
      })
  },

  setHeader () {
    //Vue.axios.defaults.headers.common['Authorization'] = `Token ${JwtService.getToken()}`
  },

 // get (resource, slug = '') {
 //   return Vue.axios
 //     .get(`${resource}/${slug}`)
 //     .catch((error) => {
 //       throw new Error(`[RWV] ApiService ${error}`)
 //     })
     
 // },

 // async get (resource, slug = '') {
 //   var result = await Vue.axios
 //     .get(`${resource}/${slug}`)
 //     .catch((error) => {
 //       throw new Error(`[RWV] ApiService ${error}`)
 //     });
 //   return result;
     
 // },
}

export default ApiService



