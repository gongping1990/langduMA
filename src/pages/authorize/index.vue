<template>
  <div class="counter-warp">
    <text class="title">获课朗读</text>
    <image class="bg"
           src="https://pub.file.k12.vip/zlk_weapp/sq@3x.png"
           mode="widthFix" />
    <button open-type="getUserInfo"
            @getuserinfo="getUserInfo"
            class="btn"
            lang="zh_CN">
      授权登录
    </button>
    <text class="text">获课朗读需要你的授权才能给你发放资料哦</text>
    <text class="text">请点击确认授权</text>
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
    getUserInfo (res) {
      let { encryptedData, iv, rawData, signature } = res.mp.detail
      if (encryptedData && iv) {
        api.user.updateUserWxMa({
          encryptedData,
          iv,
          rawData,
          signature
        }).then(({ data }) => {
          store.commit('updateUserInfo', data.resultData)
          wx.navigateBack()
        })
      }

    }
  }
}
</script>

<style lang="scss" scoped>
.counter-warp {
  @include flex-column-center;
  padding: 56px 28px;
  .title {
    color: #ff772d;
    font-size: 22px;
  }
  .bg {
    margin: 17px 0;
    width: 320px;
    height: 405px;
  }
  .btn {
    @include flex-center;
    margin-bottom: 12px;
    width: 280px;
    height: 48px;
    font-size: 17px;
    color: #fff;
    background: linear-gradient(
      225deg,
      rgba(255, 119, 45, 1) 0%,
      rgba(251, 150, 69, 1) 100%
    );
    box-shadow: 0px 2px 10px 0px rgba(255, 119, 45, 0.5);
    border-radius: 16px;
  }
  .text {
    color: #858697;
    font-size: 12px;
    line-height: 17px;
  }
}
.home {
  display: inline-block;
  margin: 100px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>
