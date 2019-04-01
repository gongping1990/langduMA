<template>
  <div class="counter-warp">
    <swiper autoplay
            circular
            class="banner">
      <swiper-item>
        <div class="banner-item">
          <text class="title">名师朗读</text>
          <div class="text-wrap">
            <text class="text">随时随地听，培养孩子朗读兴趣</text>
          </div>
          <image class="bg"
                 src="https://pub.file.k12.vip/read/msld.png"
                 mode="widthFix" />
        </div>
      </swiper-item>
      <swiper-item>
        <div class="banner-item">
          <text class="title"
                style="color: #FF668E">同步教材</text>
          <div class="text-wrap">
            <text class="text">每天10分钟，培养孩子朗读习惯，</text>
            <text class="text">为阅读打基础</text>
          </div>
          <image class="bg"
                 src="https://pub.file.k12.vip/read/tbjc.png"
                 mode="widthFix" />
        </div>
      </swiper-item>
    </swiper>

    <div class="footer">
      <button open-type="getUserInfo"
              @getuserinfo="getUserInfo"
              class="btn"
              lang="zh_CN">
        授权登录
      </button>
    </div>
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
          wx.navigateBack();
        })
      }

    }
  }
}
</script>

<style lang="scss" scoped>
.counter-warp {
  @include flex-column-center;
  padding: 10px 28px;
  .footer {
    @include flex-column-center;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 20px;
  }
  .banner {
    width: 100%;
    height: 465px;
    &-item {
      @include flex-column-center;
    }
  }
  .title {
    color: #30c0ff;
    font-size: 28px;
    line-height: 40px;
  }
  .text-wrap {
    @include flex-column-center;
    height: 34px;
    font-size: 20px;
    color: #1d1b1b;
  }
  .bg {
    margin-top: 20px;
    width: 263px;
    height: 350px;
    border-radius: 16px;
  }
  .btn {
    @include flex-center;
    margin-bottom: 12px;
    width: 280px;
    height: 48px;
    font-size: 17px;
    color: #fff;
    background: linear-gradient(
      90deg,
      rgba(102, 255, 248, 1) 0%,
      rgba(48, 192, 255, 1) 100%
    );
    box-shadow: 0px 8px 12px -6px rgba(68, 196, 199, 0.6);
    border-radius: 26px;
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
