import ApiService from './api.service'

const UsuariosService = {
//   query (type, params) {
//     return ApiService
//       .query(
//         'articles' + (type === 'feed' ? '/feed' : ''),
//         { params: params }
//       )
//   },
  get (slug) {
    return ApiService.get('todos', slug)
  },
  create (params) {
    return ApiService.post('usuarios', {article: params})
  },
  update (slug, params) {
    return ApiService.update('usuarios', slug, {article: params})
  },
  destroy (slug) {
    return ApiService.delete(`usuarios/${slug}`)
  }
}

export default UsuariosService


