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
                   :src="item.url"
                   class="slide-image"
                   :class="swiperIndex == index ? 'active' : ''" />
          </swiper-item>
        </block>
      </swiper>
      <div class="news">
        <image mode="widthFix"
               src="https://pub.file.k12.vip/read/shouye/icon-index-trumpet.png"
               class="news-image" />
        <swiper class="news-swiper"
                current="0"
                circular
                vertical
                autoplay>
          <block v-for="item in newsList"
                 :key="item">
            <swiper-item class="news-swiper-item">
              <text class="news-text">{{item.content}}</text>
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
        <block v-for="(item, index) in classList"
               :key="item">
          <swiper-item class="class-list_swiper__item">
            <div @tap="tapClassItem(index,item)"
                 class="class-list_item"
                 :style="'background-image:url(' + item.src + ')'"
                 :class="classIndex == index ? 'active' : ''">
              <text class="class-name">{{item.name}}</text>
              <text class="class-text"
                    v-if="item.id < 100">{{item.semester == 1 ? '上册' : '下册'}}</text>
            </div>
          </swiper-item>
        </block>
      </swiper>
    </div>
    <div class="home-good_list">
      <div v-for="item in courseList"
           :key="item.id"
           class="home-good_item"
           @tap="goToDetails(item.id)">
        <div class="home-good_left">
          <image class="home-good_image"
                 :src="item.comAchievement"
                 mode="widthFix"
                 lazy-load="false" />
        </div>
        <div class="home-good_right">
          <text class="home-good_title">{{item.name}}</text>
          <text class="home-good_text">{{item.remark}}</text>
          <div class="home-good_footer">
            <span class="home-good_span"><i class="home-good_span_icon teacher"></i>朗读老师：{{item.teacherName}}</span>
            <div class="home-good_num">
              <span class="home-good_span"><i class="home-good_span_icon watch"></i>{{item.nowlistening}}</span>
              <span class="home-good_span"><i class="home-good_span_icon read"></i>{{item.works}}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="card-mask"
         @click="clickCard"></div>
  </div>
</template>

<script>
import api from '../../request/api'
import store from '../../store'

export default {
  data () {
    return {
      swiperIndex: 0,
      classIndex: 0,
      newsList: [],
      bannerList: [],
      classList: [],
      courseList: [],
      page: {
        current: 1,
        grade: 1,
        semester: 1,
        size: 10
      },
      total: 0
    }
  },

  computed: {
    userInfo () {
      return store.state.userInfo
    }
  },

  watch: {
    userInfo (n, o) {
      if (n.id && !o.id) {
        this.getCourseList()
      }
    }
  },

  onReachBottom () {
    if (this.courseList.length < this.total) {
      this.page.size += 10
      this.getCourseList()
    }
  },


  methods: {
    clickCard () {
      wx.navigateTo({ url: '/pages/myCard/main' });
    },
    // 获取banner列表
    getBannerList () {
      api.banner.listDefault().then(({ data }) => {
        this.bannerList = data.resultData
      })
    },
    // 获取年级列表
    getGradeList () {
      api.grade.gradeList().then(({ data }) => {
        let arr = []
        data.resultData.forEach((e, i) => {
          if (e.id < 100) {
            let copyObj = Object.assign({}, e)
            copyObj.semester = 1
            copyObj.src = '"https://pub.file.k12.vip/read/home/fm/Courses cover' + (i + (i + 1)) + '.png"'
            arr.push(copyObj)
            e.semester = 2
            e.src = '"https://pub.file.k12.vip/read/home/fm/Courses cover' + (i + (i + 2)) + '.png"'

            arr.push(e)
          } else {
            e.src = '"https://pub.file.k12.vip/read/home/fm/Courses cover' + 100 + '.png"'
            e.semester = 1
            arr.push(e)
          }
        })

        this.classList = arr
      })
    },
    /**
     * 获取课程列表
     * @param [params] (Object)
     * {
     *  current: 页码，
     *  grade: 年级,
     *  semester: 学期，
     *  size: 条数
     * }
     */
    getCourseList () {
      api.course.queryPage(this.page).then(({ data }) => {
        this.courseList = data.resultData.records
        this.total = data.resultData.total
      })
    },
    // 获取荣誉播报
    getBroadcastList () {
      api.work.getBroadcastList().then(({ data }) => {
        this.newsList = data.resultData
      })
    },
    goToDetails (id) {
      wx.navigateTo({ url: '/pages/details/main?id=' + id });
    },
    swiperChange (e) {
      this.swiperIndex = e.mp.detail.current
    },
    changeClassIndex (e) {
      let index = e.mp.detail.current
      this.classIndex = index
      this.page = {
        ...this.page,
        grade: this.classList[index].id,
        semester: this.classList[index].semester,
        size: 10
      }
      this.getCourseList()
    },
    /**
     * 点击年级事件
     * @param [index]（index） 对应的index
     * @param [item] ()
     */
    tapClassItem (index, item) {
      this.classIndex = index
      this.page = {
        ...this.page,
        grade: item.id,
        semester: item.semester,
        size: 10
      }
      this.getCourseList()
    }
  },

  mounted () {
    this.getBannerList()
    this.getGradeList()
    this.getBroadcastList()
    if (this.userInfo.id) {
      this.getCourseList()
    }
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
.home {
  &-good {
    &_span {
      @include flex-center;
      margin-right: 12px;
      font-size: 10px;
      color: #707374;
      &_icon {
        margin-right: 3px;
        &.teacher {
          @include bg('/read/shouye/1.png');
          width: 10px;
          height: 12px;
        }
        &.watch {
          @include bg('/2019/04/30/1123037383097708545.png');
          width: 9px;
          height: 9px;
        }
        &.read {
          @include bg("/read/shouye/icon-index-read.png");
          width: 9px;
          height: 10px;
        }
      }
    }
    &_image {
      width: 63px;
      height: 84px;
    }
    &_list {
      box-shadow: 0px -4px 4px 0px rgba(0, 0, 0, 0.03);
    }
    &_item {
      @include flex-center;
      position: relative;
      justify-content: space-between;
      padding: 20px 25px;
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 24px;
        width: 248px;
        height: 1px;
        background-color: rgba(0, 0, 0, 0.08);
      }
    }
    &_right {
      @include flex-column-center;
      align-items: flex-start;
      flex: 1;
    }
    &_left{
      margin-right: 20px;
      width: 63px;
      height: 84px;
      box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.1);
      border-radius: 6px;
      overflow: hidden;
    }
    &_title {
      font-size: 20px;
      color: #1D1B1B;
      font-weight: 500;
      line-height: 28px;
    }
    &_text {
      font-size: 10px;
      font-size: #707374;
      line-height: 14px;
    }
    &_footer {
      @include flex-center;
      justify-content: space-between;
      margin-top: 20px;
      width: 100%;
    }
    &_num {
      @include flex-center;
    }
  }
  &-banner {
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.03);
  }
  .class-list {
    padding-top: 24px;
    background-color: #d5ecf7;
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
      background-size: 100%;
      background-repeat: no-repeat;
      box-shadow: 0px -3px 8px 0px rgba(0, 0, 0, 0.05);
      border-radius: 6px 6px 0px 0px;
      color: #fff;
      font-weight: bold;
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
        box-shadow: 0px -7px 16px 0px rgba(0, 0, 0, 0.1);
        color: #fff;
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
      width: 18px;
      margin-right: 16px;
    }
    &-swiper {
      width: 100%;
      height: 28px;
    }
    &-text {
      color: #324062;
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
