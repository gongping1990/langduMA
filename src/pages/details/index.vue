<template>
  <div class="details">
    <div class="introduce">
      <image class="introduce-image"
             :src="detailData.headImage"
             mode="widthFix"
             lazy-load="false" />
      <div class="introduce-content">
        <div class="introduce-title">朗读老师：<text class="introduce-weight">{{detailData.teacherName}}</text></div>
        <text class="introduce-text">{{detailData.teacherIntroduce}}</text>
      </div>
    </div>
    <div class="details-content">
      <div class="details-cover"
           @tap="changePopup">
        <div class="details-cover_mask"
             v-if="!detailData.unlocktype">
          <div class="details-cover_bg"></div>
          <image src="https://pub.file.k12.vip/read/lesson/kczy-button-lock.png"
                 mode="widthFix" />
        </div>
        <image class="details-cover-image"
               :src="detailData.impAchievement"
               mode="scaleToFill"
               lazy-load="false" />
        <div class="details-cover_popover"
             v-if="!detailData.unlocktype">
          <text>快来解锁我吧</text>
          <i class="details-cover_arrow"></i>
        </div>
        <div class="details-cover_tag"
             v-if="detailData.unlocktype">
          <image src="https://pub.file.k12.vip/read/lesson/kczy-icon-good.png"
                 mode="widthFix" />
          <text>{{detailData.courselikes}}</text>
        </div>
      </div>
      <text class="details-title">{{detailData.name}}</text>
      <div class="details-info">
        <div class="details-info_left">
          <i class="details-info_line"></i>
          <text class="details-info_text">{{detailData.alreadyread}} 位同学已会读</text>
        </div>
        <text class="details-info_text">{{detailData.nowlistening}} 位同学正在听</text>
      </div>
    </div>
    <div class="action">
      <div class="zyld-btn"
           @tap="navigateTo('read')">
        <image class="action-image"
               mode="widthFix"
               src="https://pub.file.k12.vip/read/lesson/kczy-button-read.png" />
        <text class="action-text">朗读课文</text>
      </div>
      <!-- <button v-if="!userInfo.phone"
              class="play-btn"
              open-type="getPhoneNumber"
              @getphonenumber="getPhoneNumber">
      </button> -->
      <div class="play-btn"
           @tap="navigateTo('listen')"></div>
      <wux-badge :count="detailData.uploadworks">
        <div class="wdzp-btn">
          <image class="action-image"
                 mode="widthFix"
                 src="https://pub.file.k12.vip/read/lesson/kczy-button-works.png"
                 @click="myWork" />
          <text class="action-text"
                @click="myWork">我的作品</text>
        </div>
      </wux-badge>
    </div>
    <div class="details-footer">
      <div class="details-footer_content"
           v-if="list.length">
        <div class="details-avatar">
          <image class="details-avatar_image"
                 :src="item.headimage"
                 v-for="item in list"
                 :key="item.userId" />
          <span class="details-more">···</span>
        </div>
        <div class="details-message">
          {{list[0].nikename}}… 等已解锁
        </div>
      </div>
      <text class="link-btn"
            @click="toJump">查看人气排行 ></text>
    </div>

    <wux-popup :visible="showPopup">
      <div class="popup">
        <image class="popup-image"
               :src="detailData.comAchievement"
               mode="widthFix" />
        <text class="popup-text">朗读课文就能解锁我哟~</text>
        <div class="popup-btn"
             @tap="changePopup">我知道了</div>
      </div>
    </wux-popup>
  </div>
</template>

<script>
import api from '../../request/api'
import store from '../../store'

export default {
  data () {
    return {
      detailData: {},
      list: [],
      showPopup: false,
      isAuth: false
    }
  },

  computed: {
    userInfo () {
      return store.state.userInfo
    }
  },


  methods: {
    myWork () {
      wx.navigateTo({
        url: `/pages/myWorks/main?id=${this.detailData.id}&name=${this.detailData.name}`
      });
    },
    toJump () {
      wx.navigateTo({
        url: `/pages/popularityRank/main?type=2&id=${this.detailData.id}&name=${this.detailData.name}`
      });
    },
    getPhoneNumber (res) {
      console.log(res)
      let { encryptedData, iv } = res.mp.detail
      if (encryptedData && iv) {
        api.user.updateUserPhoneByMa({
          encryptedData,
          iv
        }).then(({ data }) => {
          store.commit('updateUserInfo', data.resultData)
          this.navigateTo('listen')
        })
      } else {
        this.navigateTo('listen')
      }
    },
    changePopup () {
      this.showPopup = !this.showPopup
    },
    navigateTo (path) {
      wx.navigateTo({ url: `/pages/${path}/main?id=${this.detailData.id}` });
    },
    getCourseDetail () {
      api.course.getById({
        id: this.$root.$mp.query.id
      }).then(({ data }) => {
        this.detailData = data.resultData
        this.queryunlockcourselist()
      })
    },
    queryunlockcourselist () {
      api.course.queryunlockcourselist({
        courseId: this.detailData.id
      }).then(({ data }) => {
        this.list = data.resultData
      })
    }
  },

  onShow () {
    this.getCourseDetail()

    // let app = getApp()
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
.details {
  .zyld-btn,
  .wdzp-btn {
    @include flex-column-center;
  }

  .popup {
    @include flex-column-center;
    &-image {
      margin-bottom: 12px;
      width: 180px;
      height: 240px;
      border-radius: 6px;
    }
    &-text {
      font-size: 14px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.75);
      line-height: 20px;
    }
    &-btn {
      @include flex-center;
      margin-top: 24px;
      width: 263px;
      height: 40px;
      font-size: 15px;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      background: linear-gradient(
        90deg,
        rgba(102, 255, 248, 1) 0%,
        rgba(48, 192, 255, 1) 100%
      );
      border-radius: 26px;
    }
  }
  &-message {
    color: #1d1b1b;
    font-size: 17px;
  }
  .link-btn {
    float: right;
    color: #30c0ff;
    font-size: 12px;
  }
  &-footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 12px 24px;

    border-top: 1px solid rgba($color: #000000, $alpha: 0.1);
    &_content {
      @include flex-center;
      justify-content: space-between;
    }
  }
  &-avatar {
    @include flex-center;
    &_image {
      box-sizing: border-box;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(216, 216, 216, 1);
      border: 2px solid rgba(255, 255, 255, 1);
      &:nth-child(2) {
        transform: translateX(-8px);
      }
      &:nth-child(3) {
        transform: translateX(-16px);
      }
    }
  }

  &-more {
    font-size: 12px;
    color: #707374;
  }

  .action {
    @include flex-center;
    &-text {
      font-size: 10px;
      color: #707374;
    }
    &-image {
      width: 40px;
    }
    .play-btn {
      @include bg('/read/lesson/kczy-button-play.png');
      width: 80px;
      height: 90px;
      margin: 0 50px;
      border: none;
      background-color: transparent;
    }
  }
  &-title {
    margin-top: 24px;
    font-size: 24px;
    color: #1d1b1b;
  }
  &-info {
    @include flex-center;
    margin-top: 8px;
    font-size: 12px;
    color: #1d1b1b;
    &_left {
      position: relative;
      margin-right: 24px;
    }
    &_line {
      position: absolute;
      right: -13px;
      top: 50%;
      margin-top: -4px;
      width: 1px;
      height: 8px;
      background-color: rgba($color: #000000, $alpha: 0.3);
    }
  }
  &-content {
    @include flex-column-center;
    margin-top: 40px;
    margin-bottom: 30px;
  }

  &-cover {
    position: relative;
    margin-bottom: 24p;
    width: 120px;
    height: 160px;

    &_bg {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(48, 192, 255, 0.5);
      border-radius: 6px;
      filter: blur(2px);
    }
    &_mask {
      @include flex-center;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;

      image {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 60px;
        height: 60px;
        transform: translate(-50%, -50%);
      }
    }
    &-image {
      width: 120px;
      height: 160px;
      border-radius: 6px;
      box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.1);
    }
    &_popover {
      @include flex-center;
      position: absolute;
      right: -103px;
      top: 0;
      width: 90px;
      height: 24px;
      font-size: 12px;
      color: #fff;
      background: #ff668e;
      border-radius: 3px;
      z-index: 100;
    }
    &_tag {
      @include flex-center;
      position: absolute;
      bottom: 0;
      right: 0;
      width: 68px;
      height: 24px;
      font-size: 12px;
      color: #fff;
      background: rgba(0, 0, 0, 0.16);
      border-radius: 100px 0px 6px 0px;
      image {
        width: 11px;
        height: 11px;
        margin-right: 3px;
      }
    }
    &_arrow {
      position: absolute;
      top: 50%;
      left: -10px;
      margin-top: -6px;
      border: 6px transparent solid;
      border-right-color: #ff668e;
    }
  }
  .introduce {
    box-sizing: border-box;
    margin: 16px auto;
    padding: 16px;
    display: flex;
    width: 327px;
    height: 108px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 10px 0px rgba(222, 232, 237, 1);
    border-radius: 16px;
    &-image {
      width: 48px;
      height: 48px;
      margin-right: 16px;
      background-color: #d8d8d8;
    }
    &-title {
      font-size: 15px;
      color: #1d1b1b;
    }
    &-weight {
      font-weight: 500;
    }
    &-text {
      @include line-clamp(3);
      width: 231px;
      font-size: 12px;
      line-height: 17px;
      color: #707374;
    }
  }
}
</style>
