<template>
  <div class="read">
    <div class="introduce">
      <div class="introduce-image">

      </div>
      <div class="introduce-title">朗读老师：<text class="introduce-weight">李林</text></div>
    </div>

    <read ref="read" v-if="show">
      <div  slot="footer-content">
        <div class="read-wrap">
          <text class="read-wrap_text">请阅读课文，准备朗读</text>
        </div>
      </div>
    </read>
    <wux-popup position="bottom"
               :visible="showPopup">
      <div class="popup">
        <div class="popup-title van-hairline--bottom">选择课文</div>
        <div class="popup-list van-hairline--top-bottom">
          <div class="popup-item van-hairline--bottom"
               v-for="item in 10"
               :key="item">
            <div class="popup-item_icon"></div>
            <text class="popup-item_text">1.春天来了</text>
          </div>
        </div>
        <div class="popup-close_btn"
             @tap="changePopup"></div>
      </div>
    </wux-popup>
    <wux-popup :visible="showAchieve" @close="changeAchieve">
      <div class="achieve">
        <div class="achieve-image"></div>
        <text class="achieve-text">自由朗读课文就能解锁我哟~</text>
        <div class="achieve-btn"
             @tap="changeAchieve">我知道了</div>
      </div>
    </wux-popup>
    <wux-popup :visible="showRead" @close="changeRead">
      <div class="read-popup">
        <div class="read-popup_icon"></div>
        <text class="read-popup_text">听完了范读，</text>
        <text class="read-popup_content">自己来朗读一遍吧！</text>
        <div class="read-popup_btn">去朗读</div>
      </div>
    </wux-popup>
  </div>
</template>

<script>
import read from '../../components/read'

export default {
  data () {
    return {
      showAchieve: false,
      showRead: false,
      showPopup: false,
      show: true
    }
  },

  components: {
    read
  },

  methods: {
    changePopup () {
      this.showPopup = !this.showPopup
    },
    changeAchieve () {
      this.showAchieve = !this.showAchieve
    },
    changeRead() {
      this.showRead = !this.showRead
    }
  },



  created () {

    // this.initAudio()
    // let app = getApp()
  }
}
</script>

<style lang="scss" scoped>
.read {
  padding-top: 1px;
  height: 100vh;
  background-color: #fafafa;
  .read-popup {
    @include flex-column-center;
    width: 327px;
    height: 246px;
    font-size: 16px;
    line-height: 32px;
    color: #4a4a4a;
    background: rgba(255, 255, 255, 1);
    border-radius: 16px;
    &_icon {
      margin-bottom: 12px;
      width: 56px;
      height: 56px;
      border: 2px solid rgba(74, 74, 74, 1);
    }
    &_content {
      font-size: 20px;
    }
    &_btn {
      @include flex-center;
      margin-top: 32px;
      width: 263px;
      height: 40px;
      color: #fff;
      background: rgba(74, 74, 74, 1);
      border-radius: 26px;
    }
  }
  .achieve {
    @include flex-column-center;
    &-image {
      margin-bottom: 12px;
      width: 180px;
      height: 240px;
      background: rgba(208, 208, 208, 1);
      border-radius: 6px;
    }
    &-text {
      font-size: 14px;
      color: #fff;
    }
    &-btn {
      @include flex-center;
      margin-top: 24px;
      width: 263px;
      height: 40px;
      font-size: 15px;
      color: #4a4a4a;
      background: rgba(255, 255, 255, 1);
      border-radius: 26px;
    }
  }
  .popup {
    padding-bottom: 1px;
    border-radius: 16px 16px 0px 0px;
    background-color: #fff;
    &-title {
      @include flex-center;
      justify-content: flex-start;
      height: 60px;
      font-size: 20px;
      padding-left: 24px;
    }
    &-list {
      height: 344px;
      overflow-y: auto;
    }
    &-item {
      @include flex-center;
      justify-content: flex-start;
      height: 68px;
      padding-left: 24px;
      font-size: 15px;
      &_icon {
        width: 16px;
        height: 17px;
        margin-right: 12px;
        background-color: #4a4a4a;
      }
    }
    &-close_btn {
      margin: 15px auto;
      width: 36px;
      height: 36px;
      background: rgba(74, 74, 74, 1);
    }
  }

  .introduce {
    @include flex-column-center;
    box-sizing: border-box;
    margin: 16px auto;
    padding: 16px;
    width: 327px;
    height: 108px;
    background: #fff;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
    border-radius: 16px;
    &-image {
      margin-bottom: 8px;
      width: 48px;
      height: 48px;
      margin-right: 16px;
      background-color: #d8d8d8;
    }
    &-title {
      font-size: 15px;
      color: #4a4a4a;
    }
    &-weight {
      font-weight: 500;
    }
  }
}
</style>
