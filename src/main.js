import Vue from 'vue'
import App from './App'
import 'weapp-cookie'


Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
getApp().globalData = {
  audio: wx.createInnerAudioContext()
}
Vue.prototype.globalData = getApp().globalData
