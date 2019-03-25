<template>
  <div class="details">
    <div class="introduce">
      <image class="introduce-image"
             :src="detailData.headImage"
             mode="widthFix"
             lazy-load="false">
      </image>
      <div class="introduce-content">
        <div class="introduce-title">朗读老师：<text class="introduce-weight">{{detailData.teacherName}}</text></div>
        <text class="introduce-text">{{detailData.teacherIntroduce}}</text>
      </div>
    </div>
    <div class="details-content">
      <div class="details-cover">
        <image class="details-cover-image"
               :src="detailData.comAchievement"
               mode="scaleToFill"
               lazy-load="false" />
        <div class="details-cover_popover">
          <text>快来解锁我吧</text>
          <i class="details-cover_arrow"></i>
        </div>
        <div class="details-cover_tag">未解锁</div>
      </div>
      <text class="details-title">{{detailData.name}}</text>
      <div class="details-info">
        <div class="details-info_left">
          <i class="details-info_line"></i>
          <text class="details-info_text">{{detailData.aloudReading}} 位同学已会读</text>
        </div>
        <text class="details-info_text">1200 位同学正在听</text>
      </div>
    </div>
    <div class="action">
      <div class="zyld-btn"
           @tap="navigateTo('read')">
        <image class="action-image"
               mode="widthFix"
               src="https://pub.file.k12.vip/read/lesson/kczy-button-read.png" />
        <text class="action-text">自由朗读</text>
      </div>
      <div class="play-btn"
           @tap="navigateTo('listen')"></div>
      <div class="wdzp-btn">
        <image class="action-image"
               mode="widthFix"
               src="https://pub.file.k12.vip/read/lesson/kczy-button-works.png" />
        <text class="action-text">我的作品</text>
      </div>
    </div>
    <div class="details-footer">
      <div class="details-footer_content">
        <div class="details-avatar">
          <image class="details-avatar_image" />
          <image class="details-avatar_image" />
          <image class="details-avatar_image" />
        </div>
        <div class="details-message">
          ··· heaven小林哥… 等已解锁
        </div>
      </div>
      <text class="link-btn">查看人气排行 ></text>
    </div>
  </div>
</template>

<script>
import api from '../../request/api'

export default {
  data () {
    return {
      detailData: {}
    }
  },


  methods: {
    navigateTo (path) {
      wx.navigateTo({ url: `/pages/${path}/main?id=${this.detailData.id}` });
    },
    getCourseDetail () {
      api.course.getById({
        id: this.$root.$mp.query.id
      }).then(({ data }) => {
        this.detailData = data.resultData
      })
    }
  },

  mounted () {
    this.getCourseDetail()
    // let app = getApp()
  }
}
</script>

<style lang="scss" scoped>
.details {
  .zyld-btn,
  .wdzp-btn {
    @include flex-column-center;
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
    background: rgba(208, 208, 208, 1);
    box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.1);

    &-image {
      width: 120px;
      height: 160px;
      border-radius: 6px;
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
      width: 54px;
      height: 24px;
      font-size: 12px;
      color: #fff;
      background: rgba(155, 155, 155, 1);
      border-radius: 100px 0px 6px 0px;
    }
    &_arrow {
      position: absolute;
      top: 50%;
      left: -12px;
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
