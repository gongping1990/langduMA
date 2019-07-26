import Vue from 'vue'
import App from './App'
import 'weapp-cookie'
import api from '../src/request/api'


Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
getApp().globalData = {
  audio: wx.createInnerAudioContext(),
  shareFn: function (data) {
    api.work.shared({
      id: data
    }).then();
  }
}
Vue.prototype.globalData = getApp().globalData
