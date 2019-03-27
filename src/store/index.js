import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userInfo: {}
  },
  mutations: {
    updateUserInfo (state, params) {
      state.userInfo = {...state.userInfo, ...params}
      console.log(state.userInfo)
    }
  }
})

export default store
