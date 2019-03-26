import axios from '../http'

const user = {
  loginWithWxMa (params) {
    return axios.post('/user/loginWithWxMa', params)
  },
  updateUserWxMa(params) {
    return axios.post('/user/updateUserWxMa', params)
  },
  // 本周、上周排行榜
  getUserLikeRank(params) {
    return axios.get('/user/userLikeRank', params)
  },


}

export  default user
