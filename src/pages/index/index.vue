<template>
  <div class="home">
    <div class="home-banner">
      <swiper class="swiper-block"
              previous-margin="48rpx"
              next-margin="48rpx"
              current="0"
              :circular="true"
              @change="swiperChange">
        <block v-for="(item,index) in bannerList"
               :key="item">
          <swiper-item class="swiper-item">
            <image mode="widthFix"
                   :src="item"
                   class="slide-image"
                   :class="swiperIndex == index ? 'active' : ''" />
          </swiper-item>
        </block>
      </swiper>
      <div class="news">
        <div class="news-image"></div>
        <swiper class="news-swiper"
                current="0"
                circular
                vertical
                autoplay>
          <block v-for="item in newsList"
                 :key="item">
            <swiper-item class="news-swiper-item">
              <text class="news-text">{{item}}</text>
            </swiper-item>
          </block>
        </swiper>
      </div>
    </div>
    <div class="class-list">
      <swiper class="class-list_swiper"
              previous-margin="280rpx"
              next-margin="280rpx"
              :current="classIndex"
              @change="changeClassIndex">
        <block v-for="(item, index) in 10"
               :key="item">
          <swiper-item class="class-list_swiper__item">
            <div @tap="tapClassItem(index)"
                 class="class-list_item"
                 :class="classIndex == index ? 'active' : ''">
              <text class="class-name">四年级</text>
              <text class="class-text">下册</text>
            </div>
          </swiper-item>
        </block>
      </swiper>
    </div>
    <div class="home-good_list">
      <div class="home-good_item">
        <div class="home-good_left">
          <text class="home-good_title">《天地人》</text>
          <text class="home-good_text">朗读老师：李林</text>
          <div class="home-good_num">2368 位同学已会读</div>
        </div>
        <div class="home-good_right">

        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      swiperIndex: 0,
      classIndex: 0,
      newsList: ['跟着老师一起朗读了《天地人》，获得新成就', '跟着老师一起朗读了《天', '了《天地人》，获得新成就'],
      bannerList: ['https://pub.file.k12.vip/2019/03/04/1102390948861579266.png', 'https://pub.file.k12.vip/2018/11/17/d1615b9fa20ee58a38b87a6ed02b96b.png', "https://pub.file.k12.vip/2019/03/04/1102391104851939329.png"]
    }
  },


  methods: {
    swiperChange (e) {
      this.swiperIndex = e.mp.detail.current
    },
    changeClassIndex (e) {
      this.classIndex = e.mp.detail.current
    },
    tapClassItem (index) {
      this.classIndex = index
    }
  },

  created () {
    // let app = getApp()
  }
}
</script>

<style lang="scss" scoped>
.home {
  &-good {
    &_list {
      box-shadow: 0px -4px 4px 0px rgba(0, 0, 0, 0.03);
    }
    &_item {
      @include flex-center;
      justify-content: space-between;
      padding: 20px 25px;
    }
    &_left {
      @include flex-column-center;
      align-items: flex-start;
      border-bottom: 1px solid rgba($color: #000000, $alpha: 0.08);
    }
    &_right {
      width: 63px;
      height: 84px;
      background: rgba(208, 208, 208, 1);
      box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.1);
      border-radius: 6px;
    }
    &_title {
      font-size: 17px;
      color: #4a4a4a;
      font-weight: 500;
      line-height: 24px;
    }
    &_text {
      margin-top: 4px;
      font-size: 12px;
      font-size: #4a4a4a;
    }
    &_num {
      box-sizing: border-box;
      margin-top: 17px;
      margin-bottom: 16px;
      padding-left: 8px;
      width: 224px;
      height: 22px;
      font-size: 12px;
      line-height: 22px;
      color: #9B9B9B;
      background: rgba(247, 247, 247, 1);
      border-radius: 5px;
    }
  }
  &-banner {
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.03);
  }
  .class-list {
    background-color: #fafafa;
    padding-top: 24px;
    &_swiper {
      height: 96px;
    }
    &_swiper__item {
      @include flex-center;
      align-items: flex-end;
    }
    &_item {
      box-sizing: border-box;
      position: relative;
      padding: 10px 12px;
      width: 63px;
      height: 84px;
      background: rgba(237, 237, 237, 1);
      box-shadow: 0px -3px 8px 0px rgba(0, 0, 0, 0.05);
      border-radius: 6px 6px 0px 0px;
      color: #9b9b9b;
      transition: all 0.3s;
      .class-name,
      .class-text {
        writing-mode: vertical-lr;
      }
      .class-name {
        font-size: 14px;
      }
      .class-text {
        position: absolute;
        right: 12px;
        bottom: 10px;
        font-size: 10px;
      }
      &.active {
        width: 72px;
        height: 96px;
        background-color: #fff;
        box-shadow: 0px -7px 16px 0px rgba(0, 0, 0, 0.1);
        color: #4a4a4a;
        .class-name {
          font-size: 18px;
        }
        .class-text {
          font-size: 13px;
        }
      }
    }
  }
  .news {
    @include flex-center;
    padding: 24px;
    &-image {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      margin-right: 12px;
      background-color: #d8d8d8;
    }
    &-swiper {
      width: 100%;
      height: 28px;
    }
    &-text {
      font-size: 13px;
      line-height: 28px;
    }
  }
  .swiper-block {
    width: 100%;
  }
  .swiper-item {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 0 12px;
    overflow: unset;
  }
  .slide-image {
    width: 100%;
    border-radius: 9rpx;
    box-shadow: 0px 0px 30rpx rgba(0, 0, 0, 0.2);
    z-index: 1;
    &.active {
      transform: scale(1.07);
      transition: all 0.2s ease-in 0s;
      z-index: 20;
    }
  }
}
</style>
