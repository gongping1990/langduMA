import axios from '../http'

const banner = {
  listDefault() {
    return axios.get('/banner/listDefault')
  }
}

export default banner
