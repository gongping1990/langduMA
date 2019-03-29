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
        <image mode="widthFix" src="https://pub.file.k12.vip/read/home/icon-index-trumpet.png" class="news-image" />
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
              circular
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
              <text class="class-text">{{item.semester == 1 ? '上册' : '下册'}}</text>
            </div>
          </swiper-item>
        </block>
      </swiper>
    </div>
    <div class="home-good_list">
      <div v-for="item in courseList" :key="item.id" class="home-good_item" @tap="goToDetails(item.id)">
        <div class="home-good_left">
          <text class="home-good_title">{{item.name}}</text>
          <text class="home-good_text">朗读老师：{{item.teacherName}}</text>
          <div class="home-good_num">{{item.alreadyread}} 位同学已会读</div>
        </div>
        <div class="home-good_right">
          <image
            class="home-good_image"
            :src="item.comAchievement"
            mode="widthFix"
            lazy-load="false" />
        </div>
      </div>
    </div>
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
    userInfo() {
      return store.state.userInfo
    }
  },

  watch: {
    userInfo(n, o) {
      if(n.id && !o.id) {
        this.getCourseList()
      }
    }
  },

  onReachBottom() {
    console.log(111)
    if(this.courseList.length < this.total) {
      this.page.size += 10
      this.getCourseList()
    }
  },


  methods: {
    // 获取banner列表
    getBannerList() {
      api.banner.listDefault().then(({data}) => {
        this.bannerList = data.resultData
      })
    },
    // 获取年级列表
    getGradeList() {
      api.grade.gradeList().then(({data}) => {
        let arr = []
        data.resultData.forEach((e, i) => {
          let copyObj = Object.assign({}, e)
          copyObj.semester = 1
          copyObj.src = '"https://pub.file.k12.vip/read/home/fm/Courses cover' + (i + 1) + '.png"'
          arr.push(copyObj)
          e.semester = 2
          e.src = '"https://pub.file.k12.vip/read/home/fm/Courses cover' + (i + 1) + '.png"'
          arr.push(e)
        })
        console.log(arr)
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
    getCourseList() {
      api.course.queryPage(this.page).then(({data}) => {
        this.courseList = data.resultData.records
        this.total = data.resultData.total
      })
    },
    // 获取荣誉播报
    getBroadcastList() {
      api.work.getBroadcastList().then(({data}) => {
        this.newsList = data.resultData
      })
    },
    goToDetails(id) {
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
    if(this.userInfo.id) {
      this.getCourseList()
    }
    // let app = getApp()
  }
}
</script>

<style lang="scss" scoped>
.home {
  &-good {
    &_image {
      width: 63px;
      height: 84px;
    }
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
      box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.1);
      border-radius: 6px;
      overflow: hidden;
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
      color: #9b9b9b;
      background: rgba(247, 247, 247, 1);
      border-radius: 5px;
    }
  }
  &-banner {
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.03);
  }
  .class-list {
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
      width: 31px;
      margin-right: 12px;
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
