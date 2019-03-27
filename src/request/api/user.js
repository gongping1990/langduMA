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
    return axios.get('/user/userLikeRankByPage', params)
  },
  // 风采顶部排行三位
  getTopThreeRank(params) {
    return axios.get('/user/topthree', params)
  },
  // 推荐作品
  getRecommendRank(params) {
    return axios.get('/user/listRecommendWorkPage', params)
  },
  // 自己排行
  userLikeRankForMe(params) {
    return axios.get('/user/userLikeRankForMe', params)
  },


}

export  default user
