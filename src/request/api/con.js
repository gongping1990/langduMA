import axios from '../http'

const config = {
  gradeList() {
    return axios.get('/config/grade/list')
  }
}

export default config
