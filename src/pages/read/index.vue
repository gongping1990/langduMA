<template>
  <div class="details">
    <div class="introduce">
      <div class="introduce-image">

      </div>
      <div class="introduce-content">
        <div class="introduce-title">朗读老师：<text class="introduce-weight">李林</text></div>
        <text class="introduce-text">自2001年从事国家级朗读大赛评委以来有着自己独特的朗读经验和方式教授更多人学会朗读热爱朗读。</text>
      </div>
    </div>
    <div class="details-content">
      <div class="details-cover">
        <div class="details-cover_popover">
          <text>快来解锁我吧</text>
          <i class="details-cover_arrow"></i>
        </div>
        <div class="details-cover_tag">未解锁</div>
      </div>
      <text class="details-title">《天地人》</text>
      <div class="details-info">
        <div class="details-info_left">
          <i class="details-info_line"></i>
          <text class="details-info_text">2368 位同学已会读</text>
        </div>
        <text class="details-info_text">1200 位同学正在听</text>
      </div>
    </div>
    <div class="action">
      <div class="zyld-btn">
        <image class="action-image" />
        <text class="action-text">自由朗读</text>
      </div>
      <div class="play-btn"></div>
      <div class="wdzp-btn">
        <image class="action-image" />
        <text class="action-text">自由朗读</text>
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

export default {
  data () {
    return {

    }
  },


  methods: {

  },

  created () {
    // let app = getApp()
  }
}
</script>

<style lang="scss" scoped>
.details {
  .zyld-btn, .wdzp-btn {
    @include flex-column-center;
  }
  &-message {
    font-size: 17px;
  }
  .link-btn {
    float: right;
    font-size: 12px;
  }
  &-footer {
    position: absolute;
    bottom: 0;
    padding: 12px 24px;
    border-top: 1px solid rgba($color: #000000, $alpha: 0.3);
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
      color: #4a4a4a;
    }
    &-image {
      width: 36px;
      height: 36px;
      margin-bottom: 4px;
    }
    .play-btn {
      width: 72px;
      height: 72px;
      background-color: #4a4a4a;
      margin: 0 50px;
    }
  }
  &-title {
    margin-top: 24px;
    font-size: 24px;
    color: #4a4a4a;
  }
  &-info {
    @include flex-center;
    margin-top: 8px;
    font-size: 12px;
    color: #4a4a4a;
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
    border-radius: 6px;
    &_popover {
      @include flex-center;
      position: absolute;
      right: -103px;
      top: 0;
      width: 90px;
      height: 24px;
      font-size: 12px;
      color: #fff;
      background: #4a4a4a;
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
      border-right-color: #4a4a4a;
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
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
    border-radius: 16px;
    &-image {
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
    &-text {
      @include line-clamp(3);
      width: 231px;
      font-size: 12px;
      line-height: 17px;
      color: #9b9b9b;
    }
  }
}
</style>
