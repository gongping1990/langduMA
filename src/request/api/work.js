import axios from '../http'

const work = {
  getBroadcastList () {
    return axios.get('/work/getBroadcastList')
  },
  getById(params) {
    return axios.get('/work/getById/' + params.id)
  },
  getSingleList(params) {
    return axios.post('/work/single/works',params)
  },
  delItemWork(params) {
    return axios.post('/work/removeById',params)
  },
  getItemRankinglist(params) {
    return axios.post('/work/single/rankinglist',params)
  },
  getMyCardList(params) {
    return axios.get('/work/listByAchievementCard',params)
  },
  finishFangdu(params) {
    return axios.post('/work/finishFangdu', params)
  },
  save(params) {
    return axios.post('/work/save',params)
  },otherMessage(params) {
    return axios.get('/work/getPersonalHomepage',params)
  },
  myMessage(params) {
    return axios.get('/work/getPersonalHomepageByMe',params)
  },
  otherWorksList(params) {
    return axios.get('/work/listByOtherWorksCollection',params)
  },
  myWorksList(params) {
    return axios.get('/work/listByWorksCollection',params)
  },
  myShareWorksList(params) {
    return axios.get('/work/listByShareWorks',params)
  },
  shareDetail(params) {
    return axios.get('/work/getShareWorkDetails',params)
  },
  userLikeRankForMe(params) {
    return axios.get('/work/getMyBestWorkByCourse',params)
  }
}

export  default work
