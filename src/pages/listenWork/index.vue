<template>
  <div class="read">
    <div class="introduce"
         v-if="!hideIntroduce"
         :class="{'show': showIntroduce}">
      <image class="introduce-image"
             mode="widthFix"
             :src="detailData.headimgurl" />
      <div class="introduce-title">朗读者：<text class="introduce-weight">{{detailData.nickname}}</text></div>
      <div class="zan-num" @tap="likeContent">
        <div class="zan-icon"></div>
        {{detailData.likes}}
      </div>
    </div>
    <read ref="read"
          :showList="false"
          :title="detailData.coursename"
          :subtitle="detailData.grade ? detailData.grade + '·' + detailData.semester : ''"
          :lyricSrc="detailData.voiceUrl"
          :lyricText="detailData.coursecontent"
          @clickRead="clickRead"
          @clickList="changePopup"
          @ended="bindEnded"></read>
    <wux-popup :visible="showRead"
               @close="changeRead">
      <div class="read-popup">
        <div class="read-popup_close"
             @tap="changeRead"></div>
        <div class="read-popup_icon"></div>
        <text class="read-popup_text">听完了范读，</text>
        <text class="read-popup_content">自己来朗读一遍吧！</text>
        <div class="read-popup_btn"
             @tap="clickRead">去朗读</div>
      </div>
    </wux-popup>
  </div>
</template>

<script>
import read from '../../components/read'
import api from '../../request/api'
import store from '../../store'

export default {
  data () {
    return {
      gradeArr: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '初中'],
      detailData: {},
      showAchieve: false,
      showRead: false,
      show: true,
      showIntroduce: false,
      workId: 0,
    }
  },

  computed: {
    // subtitle () {
    //   return `${this.gradeArr[this.detailData.grade]}·${this.detailData.semester == 1 ? '上册' : '下册'}`
    // },
    userInfo () {
      return store.state.userInfo
    }
  },

  watch: {
    userInfo (n, o) {
      if (n.id && !o.id && this.workId) {
        this.getWorkDetail()
      }
    },
    workId (n, o) {

      if (this.userInfo.id && n) {
        this.getWorkDetail()
      }

    }
  },

  components: {
    read
  },

  methods: {
    getWorkDetail () {
      api.work.getById({
        id: this.workId
      }).then(({ data }) => {
        this.detailData = data.resultData
      })
    },
    likeContent() {
      api.user.likeContent({
        id: this.detailData.id
      }).then(({data}) => {
        wx.showToast({
          title: '点赞成功！', //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
        if(data.resultData) {
          this.detailData.likes += 1
        } else {
          this.detailData.likes -= 1
        }
      })
    },
    clickRead () {
      wx.navigateTo({ url: '/pages/read/main?id=' + this.detailData.courseId});
    },
    changeAchieve () {
      this.showAchieve = !this.showAchieve
    },
    changeRead () {
      this.showRead = !this.showRead
    },
    bindEnded () {
      this.finishFangdu()
      this.changeRead()
    },
    finishFangdu () {
      api.work.finishFangdu({
        courseId: this.detailData.id
      })
    }
  },



  mounted () {
    this.workId = this.$root.$mp.query.id

    this.share = this.$root.$mp.query.share
    setTimeout(() => {
      this.showIntroduce = true
      setTimeout(() => {
        this.showIntroduce = false

      }, 6000);
    }, 500);
    // this.initAudio()
    // let app = getApp()
  },

  onHide () {
    this.globalData.audio.stop()
  },

  onUnload () {

    this.globalData.audio.stop()
  },
  onShareAppMessage () {
    return {
      title: '[获课朗读]一线名师和你一起朗读',
      path: '/pages/index/main',
      imageUrl: 'https://pub.file.k12.vip/read/ldshared.jpeg'
    };
  }
}
</script>

<style lang="scss" scoped>
.read {
  padding-top: 1px;
  height: 100vh;
  background-color: #01141d;
  .read-popup {
    position: relative;
    @include flex-column-center;
    width: 327px;
    height: 246px;
    font-size: 16px;
    line-height: 32px;
    color: rgba($color: #fff, $alpha: 0.75);
    background: #031a24;
    border-radius: 16px;
    &_icon {
      @include bg('/read/mike.png');
      width: 56px;
      height: 70px;
    }
    &_content {
      font-size: 20px;
    }
    &_close {
      @include bg('/read/button-icon-close.png');
      position: absolute;
      top: 16px;
      right: 16px;
      width: 15px;
      height: 15px;
    }
    &_btn {
      @include flex-center;
      margin-top: 32px;
      width: 263px;
      height: 40px;
      color: #30c0ff;
      border: 1px solid rgba(255, 255, 255, 0.16);
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
    background: rgba(3, 26, 36, 1);
    box-shadow: 0px 2px 10px 0px rgba(1, 21, 31, 1);
    &-title {
      @include flex-center;
      justify-content: flex-start;
      height: 60px;
      font-size: 20px;
      color: rgba($color: #fff, $alpha: 0.75);
      padding-left: 24px;
    }
    &-srcoll {
      height: 344px;
    }
    &-item {
      @include flex-center;
      justify-content: flex-start;
      height: 68px;
      padding-left: 24px;
      font-size: 15px;
      color: rgba($color: #fff, $alpha: 0.4);
      &_icon {
        display: none;
        @include bg('/read/msfd-icon-playing.png');
        width: 16px;
        height: 17px;
        margin-right: 12px;
      }
      &.active {
        color: #30c0ff;
        .popup-item_icon {
          display: block;
        }
      }
    }
    &-close_btn {
      @include bg('/read/msfd-icon-close.png');
      margin: 15px auto;
      width: 36px;
      height: 36px;
    }
  }

  .introduce {
    @include flex-column-center;
    box-sizing: border-box;
    margin: 16px auto;
    padding: 16px;
    width: 327px;
    background: rgba(3, 26, 36, 1);
    box-shadow: 0px 2px 10px 0px rgba(1, 21, 31, 1);
    border-radius: 16px;
    &-image {
      margin-bottom: 8px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: #d8d8d8;
    }
    &-title {
      font-size: 15px;
      color: #fff;
    }
    &-weight {
      font-weight: 500;
    }
    .zan-num {
      @include flex-center;
      color: #FF668E;
    }
    .zan-icon {
      @include bg('/read/icon-good.png');
      margin-right: 8px;
      width: 16px;
      height: 16px;
    }
  }
}
</style>
