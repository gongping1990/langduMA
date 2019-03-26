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
  }

}

export  default work
