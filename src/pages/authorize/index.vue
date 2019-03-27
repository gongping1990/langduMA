<template>
  <div class="counter-warp">
    <button
      open-type="getUserInfo"
      @getuserinfo="getUserInfo"
      lang="zh_CN"
      >
      授权登录
    </button>
  </div>
</template>

<script>
// Use Vuex
import store from '../../store'
import api from '../../request/api'

export default {
  computed: {
    userInfo () {
      return store.state.userInfo
    }
  },
  methods: {
    getUserInfo(res) {
      let {encryptedData, iv, rawData, signature} = res.mp.detail
      console.log(res)
      api.user.updateUserWxMa({
        encryptedData,
        iv,
        rawData,
        signature
      }).then(({data}) => {
        store.commit('updateUserInfo', data.resultData)
        wx.navigateBack()
      })
    }
  }
}
</script>

<style>
.counter-warp {
  text-align: center;
  margin-top: 100px;
}
.home {
  display: inline-block;
  margin: 100px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>
