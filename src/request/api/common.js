import axios from '../http'

const common = {
  // 发送验证码
  sendCode(params) {
    return axios.get('/common/sendCode', params)
  },
  // 上传图片
  uploadPublicFile() {
    return axios.post('/common/uploadPublicFile')
  },
  showprice() {
    return axios.get('/common/showprice')
  },
  getAudioCosSign() {
    return axios.post('/common/getAudioCosSign')
  }
}

export default common
