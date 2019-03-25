import axios from '../http'

const course = {
  queryPage(params) {
    return axios.get('/course/queryPage', params)
  },
  getById(params) {
    return axios.get('/course/getById/' + params.id)
  }
}

export default course
