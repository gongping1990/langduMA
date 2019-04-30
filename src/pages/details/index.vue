<template>
  <div class="details">
    <div class="introduce">
      <div class="details-cover"
           @tap="changePopup">
        <div class="details-cover_mask"
             v-if="!detailData.unlocktype">
          <div class="details-cover_bg"></div>
          <image src="https://pub.file.k12.vip/read/kechengzhuyi/kczy-icon-lock.png"
                 mode="widthFix" />
        </div>
        <image class="details-cover-image"
               :src="detailData.impAchievement"
               mode="scaleToFill"
               lazy-load="false" />
        <div class="details-cover_tag"
             v-if="detailData.unlocktype">
          <image src="https://pub.file.k12.vip/read/lesson/kczy-icon-good.png"
                 mode="widthFix" />
          <text>{{detailData.courselikes}}</text>
        </div>
      </div>
      <div class="introduce-content">
        <div class="introduce-content-header">
          <div class="introduce-content-left">
            <p>{{detailData.name}}</p>
            <span>朗读老师：{{detailData.teacherName}}</span>
          </div>
          <div class="introduce-content-right">
            <wux-badge :showZero="true"
                       :count="detailData.uploadworks">
              <div class="wdzp-btn" @click="myWork">
                <image class="action-image"
                       mode="widthFix"
                       src="https://pub.file.k12.vip/read/kechengzhuyi/kczy-icon-Reading.png"
                        />
                <text class="action-text">我的朗读</text>
              </div>
            </wux-badge>
          </div>
        </div>
        <text class="introduce-text">{{detailData.teacherIntroduce}}</text>
      </div>
    </div>
    <div class="details-content">

      <!-- <text class="details-title">{{detailData.name}}</text>
      <div class="details-info">
        <div class="details-info_left">
          <i class="details-info_line"></i>
          <text class="details-info_text">{{detailData.alreadyread}} 位同学已会读</text>
        </div>
        <text class="details-info_text">{{detailData.nowlistening}} 位同学正在听</text>
      </div> -->

      <div class="play-btn"
           @tap="navigateTo('listen')">
        <image class="action-image"
               mode="widthFix"
               src="https://pub.file.k12.vip/read/kechengzhuyi/kczy-card-msfd.png" />
        <text>{{detailData.nowlistening}} 位同学正在听</text>
      </div>
      <div class="zyld-btn"
           @tap="navigateTo('read')">
        <image class="action-image"
               mode="widthFix"
               src="https://pub.file.k12.vip/read/kechengzhuyi/kczy-card-zyld.png" />
        <text>{{detailData.alreadyread}} 位同学已会读</text>
      </div>
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

    <wux-popup :visible="showPopup"
               @close="changePopup">
      <div class="popup">
        <image class="popup-image"
               :src="detailData.comAchievement"
               mode="widthFix" />
        <text class="popup-text">朗读课文就能解锁我哟~</text>
        <div class="popup-btn"
             @tap="changePopup">我知道了</div>
      </div>
    </wux-popup>
    <wux-popup :visible="isShowNoData"
               @close="openModal">
      <div class="ld-my-work-popup-no">
        <div class="popup-wrap">
          <div class="popup-text-one">你还没有朗读作品</div>
          <div class="popup-text-two">快去朗读吧！</div>
          <div class="popup-btn"
               @tap="openModal">我知道了</div>
        </div>
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
      isShowNoData: false,
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
      if(!this.detailData.uploadworks) {
        this.openModal()
        return
      }
      wx.reLaunch({
        url: `/pages/myWorks/main?id=${this.detailData.id}&name=${this.detailData.name}`
      });
    },
    toJump () {
      wx.navigateTo({
        url: `/pages/popularityRank/main?type=2&id=${this.detailData.id}&name=${this.detailData.name}`
      });
    },
    openModal () {
      this.isShowNoData = !this.isShowNoData;
    },
    getPhoneNumber (res) {
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
.ld-my-work-popup-no {
  position: relative;
  width: 315px;
  height: 379px;
  @include bg('/read/tc/1.png');

  .popup-wrap {
    padding-top: 208px;
    text-align: center;
  }

  .popup-text-one {
    height: 28px;
    font-size: 20px;
    font-weight: 400;
    color: rgba(50, 64, 98, 1);
    line-height: 28px;
  }

  .popup-text-two {
    margin-top: 4px;
    height: 33px;
    font-size: 24px;
    font-weight: 500;
    color: rgba(50, 64, 98, 1);
    line-height: 33px;
  }

  .popup-btn {
    margin: 24px auto 0;
    width: 179px;
    height: 40px;
    background: rgba(54, 219, 164, 1);
    border-radius: 26px;
    font-size: 15px;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 40px;
  }
}
.details {
  background-color: #f6f6f6;
  .wdzp-btn {
    @include flex-column-center;
  }
  .play-btn,
  .zyld-btn {
    position: relative;
    margin-bottom: 32px;
    width: 327px;
    height: 149px;
    border-radius: 8px;
    text {
      position: absolute;
      top: 66px;
      left: 190px;
      font-size: 10px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 14px;
    }
    image {
      width: 327px;
      height: 149px;
      border-radius: 8px;
    }
  }

  .popup {
    @include flex-column-center;
    @include bg('/read/tc/1.png');
    box-sizing: border-box;
    margin: 0 auto;
    padding-top: 154px;
    width: 315px;
    height: 379px;
    &-image {
      margin-bottom: 12px;
      width: 80px;
      height: 106px !important;
      border-radius: 6px;
      box-shadow: 0px 0px 16px -2px rgba(174, 194, 203, 0.4);
    }
    &-text {
      font-size: 18px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.75);
      line-height: 25px;
    }
    &-btn {
      @include flex-center;
      margin-top: 12px;
      width: 179px;
      height: 40px;
      font-size: 15px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      background: rgba(54, 219, 164, 1);
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
    margin-top: 6px;
    padding-top: 24px;
    background-color: #fff;
  }

  &-cover {
    position: relative;
    margin-right: 23px;
    width: 70px;
    height: 92px;

    &_bg {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 3px;
    }
    &_mask {
      @include flex-center;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 10;

      image {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 24px;
        height: 30px;
        transform: translate(-50%, -50%);
      }
    }
    &-image {
      width: 70px;
      height: 92px;
      border-radius: 3px;
      box-shadow: 0px 5px 9px -2px rgba(187, 217, 206, 1);
    }
    &_popover {
      @include flex-center;
      position: absolute;
      right: -80px;
      top: 5px;
      width: 90px;
      height: 24px;
      font-size: 12px;
      color: #fff;
      background: #ff9f24;
      border-radius: 3px;
      z-index: 100;
    }
    &_tag {
      @include flex-center;
      position: absolute;
      bottom: 0;
      right: 0;
      width: 39px;
      height: 14px;
      font-size: 7px;
      color: #fff;
      background: rgba(0, 0, 0, 0.16);
      border-radius: 58px 0px 3px 0px;
      image {
        width: 6px;
        height: 6px;
        margin-right: 3px;
      }
    }
    &_arrow {
      position: absolute;
      top: 50%;
      left: -10px;
      margin-top: -6px;
      border: 6px transparent solid;
      border-right-color: #ff9f24;
    }
  }
  .introduce {
    box-sizing: border-box;
    padding: 24px;
    padding-bottom: 33px;
    display: flex;
    background: rgba(255, 255, 255, 1);
    &-content {
      &-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      &-left {
        font-size: 12px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(50, 64, 98, 0.8);
        line-height: 17px;
        p {
          margin-bottom: 3px;
          font-size: 22px;
          font-family: PingFangSC-Semibold;
          font-weight: 600;
          color: rgba(50, 64, 98, 1);
          line-height: 30px;
        }
      }
      &-right {
        .action-image {
          margin-bottom: 6px;
          width: 18px;
          height: 28px;
        }
        .action-text {
          font-size: 8px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(50, 64, 98, 1);
          line-height: 11px;
        }
      }
    }
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
      @include line-clamp(2);
      margin-top: 8px;
      width: 231px;
      font-size: 12px;
      line-height: 17px;
      color: #324062;
    }
  }
}
</style>
