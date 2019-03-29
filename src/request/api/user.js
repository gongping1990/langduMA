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
  // 自己排行 周次
  weekLikeRankForMe(params) {
    return axios.get('/user/weekLikeRankForMe', params)
  },
  // 举报
  reportContent(params) {
    return axios.post('/user/report', params)
  },
  // 点赞
  likeContent(params) {
    return axios.post('/user/like', params)
  },
  updateUserPhoneByMa(params) {
    return axios.post('/user/updateUserPhoneByMa', params)
  }

}

export  default user
