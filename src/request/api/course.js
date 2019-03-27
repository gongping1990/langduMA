import axios from '../http'

const course = {
  queryPage(params) {
    return axios.get('/course/queryqtPage', params)
  },
  getById(params) {
  return axios.get('/course/getQtById/' + params.id)
  },
  queryunlockcourselist(params) {
    return axios.post('/course/queryunlockcourselist',params)
  }
}

export default course
