import axios from '../http'

const user = {
  loginWithWxMa (params) {
    return axios.post('/user/loginWithWxMa', params)
  },
  updateUserWxMa(params) {
    return axios.post('/user/updateUserWxMa', params)
  },


}

export  default user
