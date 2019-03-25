import base from './base'
import store from '../store'
const tip = msg => {
  wx.showToast({
    title: msg,
    icon: 'none'
  })
}

/**
 * 显示登录页
 * 清楚用户本地缓存信息，并显示登录弹框
 */
const toLogin = () => {
  wx.clearStorage()
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, err) => {
  // 状态码判断
  switch (status) {
    case 200:
      break
    // 401: 未登录状态，跳转登录页
    case 401:
    case 402:
    case 403:
      toLogin()
      break
    // 404请求不存在
    case 404:
      tip('请求的资源不存在')
      break
    case 500:
      tip('网络连接异常')
    default:
      tip(err)
    // console.log(other);
  }
}

export default {
  token: null,
  baseOptions(params, method = 'GET') {
    return new Promise((resolve, reject) => {
      let { url, data } = params
      // let token = getApp().globalData.token
      // if (!token) login()
      let contentType = 'application/x-www-form-urlencoded'
      contentType = params.contentType || contentType
      const option = {
        url: base.url + url,
        data: data,
        method: method,
        credentials: 'include',
        header: {
          'content-type': contentType
        },
        success(res) {
          if(res.data.code == 200) {
            resolve(res)
          } else {
            reject(res.data.msg)
          }
          errorHandle(res.data.code, res.data.msg)
        },
        error(e) {
          reject(e)
          wx.hideLoading()
          wx.showToast({
            title: e //提示的内容
          })
        }
      }
      wx.request(option)
    })
  },
  get(url, data = '') {
    let option = { url, data }
    return this.baseOptions(option)
  },
  post: function(url, data, contentType) {
    let params = { url, data, contentType }
    return this.baseOptions(params, 'POST')
  }
}
