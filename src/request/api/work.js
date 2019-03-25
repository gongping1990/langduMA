import axios from '../http'

const work = {
  getBroadcastList () {
    return axios.get('/work/getBroadcastList')
  },
  getById(params) {
    return axios.get('/work/getById/' + params.id)
  }

}

export  default work
