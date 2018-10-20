import { API_URL } from '@/common/config'

const LayersService = {

  get (idGroup, zoom) {
    return fetch(API_URL + '/markers?idGroup=' + idGroup + '&zoom=' + zoom)
      .then(response => { 
        return response.json();
      })
      .catch((error) => {
        throw new Error(`[RWV] ApiService ${error}`)
      })
  }
  
}

export default LayersService


