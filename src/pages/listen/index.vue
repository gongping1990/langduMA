<template>
  <div class="read"  :class="{share: share}">
    <!-- <div class="introduce"
         v-if="!hideIntroduce"
         :class="{'show': showIntroduce}">
      <image class="introduce-image"
             mode="widthFix"
             :src="courseData.headImage" />
      <div class="introduce-content">
        <div class="introduce-title">朗读老师：<text class="introduce-weight">{{courseData.teacherName}}</text></div>
        <text class="introduce-text">{{courseData.teacherIntroduce}}</text>
      </div>
    </div> -->

    <read ref="read"
          v-if="showReadComponent"
          autoplay
          :share="share"
          :title="courseData.name"
          :subtitle="subtitle"
          :lyricSrc="courseData.authorVrAudio"
          :lyricText="courseData.introduction"
          @clickRead="clickRead"
          @clickList="changePopup"
          @ended="bindEnded"></read>
    <wux-popup position="bottom"
               :visible="showPopup"
               @close="changePopup">
      <div class="popup">
        <div class="popup-title">选择课文</div>
        <scroll-view scroll-y
                     @scrolltolower="bindscrolltolower"
                     scroll-with-animation
                     lower-threshold="100"
                     class="popup-scroll">
          <div class="popup-list ">
            <div class="popup-item"
                 :class="{'active': item.id == id}"
                 v-for="(item,i) in courseList"
                 @tap="clickItem(item.id)"
                 :key="item">
              <div class="popup-item_icon"></div>
              <text class="popup-item_text">{{(i + 1) + '.' + item.name}}</text>
            </div>
            <span class="popup-item-more" v-if="courseList.length >= total">已经到底啦～</span>
          </div>
        </scroll-view>
        <div class="popup-close_btn"
             @tap="changePopup"></div>
      </div>
    </wux-popup>
    <wux-popup :visible="showRead"
               @close="changeRead">
      <div class="read-popup">
        <text class="read-popup_text">听完了范读，</text>
        <text class="read-popup_content">自己来朗读一遍吧！</text>
        <div class="read-popup_btn"
             @tap="clickRead">去朗读</div>
      </div>
    </wux-popup>
    <div class="more-course"
         v-if="share"
         @tap="toHome">
      <text class="more-course_text">更多课文</text>
      <div class="more-course_icon"></div>
    </div>
  </div>
</template>

<script>
import read from '../../components/read'
import api from '../../request/api'
import store from '../../store'

export default {
  data () {
    return {
      gradeArr: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '初中', '古诗'],
      courseData: {},
      detailData: {},
      showReadComponent: true,
      showAchieve: false,
      showRead: false,
      showPopup: false,
      show: true,
      showIntroduce: false,
      hideIntroduce: false,
      courseList: [],
      total: 0,
      share: 0,
      id: 0,
      page: {
        current: 1,
        size: 10
      }
    }
  },

  computed: {
    subtitle () {
      if (!this.courseData.grade) {
        return ''
      }

      if (this.courseData.grade == 100) {
        return '古诗'
      } else {
        return `${this.gradeArr[this.courseData.grade - 1]}·${this.courseData.semester == 1 ? '上册' : '下册'}`
      }

    },
    userInfo () {
      return store.state.userInfo
    }
  },

  watch: {
    userInfo (n, o) {
      if (n.id && !o.id && this.$root.$mp.query) {
        this.getCourseDetail()
      }
    }
  },

  components: {
    read
  },

  methods: {
    getCourseDetail () {
      api.course.getById({
        id: this.$root.$mp.query.id
      }).then(({ data }) => {
        this.courseData = data.resultData
        this.getCourseList()
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
      api.course.queryPage({
        size: this.page.size,
        current: this.page.current,
        grade: this.courseData.grade,
        semester: this.courseData.semester
      }).then(({ data }) => {
        this.courseList = data.resultData.records
        this.total = data.resultData.total
      })
    },
    bindscrolltolower () {
      if (this.courseList.length < this.total) {
        this.page.size += 10
        this.getCourseList()
      }
    },
    toHome () {
      wx.switchTab({ url: '/pages/index/main' });
    },
    clickItem (id) {
      this.globalData.audio.stop()
      this.showRead = false
      this.showPopup = false
      wx.redirectTo({ url: '/pages/listen/main?id=' + id });
    },
    clickRead () {
      wx.navigateTo({ url: '/pages/read/main?id=' + this.$root.$mp.query.id });
      this.showRead = false
    },
    changePopup () {
      this.showPopup = !this.showPopup
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
        courseId: this.courseData.id
      })
    }
  },



  onShow () {
    this.id = this.$root.$mp.query.id
    this.share = this.$root.$mp.query.share
    this.showReadComponent = true
    if (this.userInfo.id) {
      this.getCourseDetail()
    }
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
    this.showReadComponent = false
    this.showAchieve = false
    this.showRead = false
    this.showPopup = false
    this.show = true
    this.showIntroduce = false
    this.hideIntroduce = false
    this.total = 0
    this.share = 0
    this.id = 0
    this.page = {
      current: 1,
      size: 10
    }
    this.globalData.audio.src = ''
    this.globalData.audio.stop()
  },

  onUnload () {
    this.showReadComponent = false
    this.showAchieve = false
    this.showRead = false
    this.showPopup = false
    this.show = true
    this.showIntroduce = false
    this.hideIntroduce = false
    this.total = 0
    this.share = 0
    this.id = 0
    this.page = {
      current: 1,
      size: 10
    }

    this.globalData.audio.src = ''
    this.globalData.audio.stop()
  },
  onShareAppMessage () {
    return {
      title: `我的孩子刚朗读了《${this.courseData.name}》，非常棒，请给TA点个赞吧！`,
      path: '/pages/index/main',
      imageUrl: 'https://pub.file.k12.vip/read/zpshare.jpeg',
      success: res => {
        this.showSuccessTwo = false
        this.showSuccess = false
      }
    };
  }
}
</script>

<style lang="scss" scoped>
.read {
  box-sizing: border-box;
  padding-top: 60px;
  height: 100vh;
  background-color: #edfff8;
  overflow: hidden;
  background: url('https://pub.file.k12.vip/read/mingshifandu/backgroud.png')
    no-repeat 0 70%;
  background-size: 100%;
  &.share {
    background-position-y: bottom;
  }
  .more-course {
    @include flex-center;
    position: absolute;
    right: 0;
    top: 45%;
    width: 84px;
    height: 29px;
    z-index: 100;
    font-size: 12px;
    color: #fff;
    background: #FF9F24;
    border-radius: 15px 0px 0px 15px;
    &_icon {
      @include bg('/read/kczy-button-more.png');
      margin-left: 4px;
      margin-top: 2px;
      width: 6px;
      height: 11px;
    }
  }
  .read-popup {
    position: relative;
    @include flex-column-center;
    @include bg('/read/tc/2.png');
    box-sizing: border-box;
    padding-top: 177px;
    margin: 0 auto;
    width: 311px;
    height: 378px;
    font-size: 20px;
    line-height: 28px;
    color: #324062;
    &_content {
      font-size: 24px;
      font-weight: bold;
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
      margin-top: 24px;
      width: 179px;
      height: 40px;
      color: #fff;
      background: rgba(54, 219, 164, 1);
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
    background: #fff;
    box-shadow: 0px 2px 10px 0px rgba(91, 107, 115, 1);
    &-title {
      @include flex-center;
      justify-content: flex-start;
      height: 60px;
      font-size: 20px;
      color: #324062;
      padding-left: 24px;
    }
    &-scroll {
      height: 344px;
    }
    &-item {
      @include flex-center;
      justify-content: flex-start;
      height: 68px;
      margin: 0 24px;
      font-size: 15px;
      border-bottom: 1px #e4e4e4 solid;
      color: rgba($color: #99a3b6, $alpha: 0.8);
      &_icon {
        display: none;
        @include bg('/read/fandukewenxuanzhe/msfd-icon-playing.png');
        width: 14px;
        height: 16px;
        margin-right: 12px;
      }
      &-more {
        display: block;
        margin-top: 8px;
        text-align: center;
        font-size: 14px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(153, 163, 182, 0.8);
        line-height: 20px;
      }
      &.active {
        color: #38dca4;
        .popup-item_icon {
          display: block;
        }
      }
    }
    &-close_btn {
      @include bg('/read/fandukewenxuanzhe/msfd-icon-close.png');
      margin: 15px auto;
      width: 36px;
      height: 36px;
    }
  }

  .introduce {
    box-sizing: border-box;
    margin: 16px auto;
    padding: 16px;
    display: flex;
    width: 327px;
    height: 108px;
    background: #031a24;
    box-shadow: 0px 2px 10px 0px rgba(1, 21, 31, 1);
    border-radius: 16px;
    transform: translateX(120%);
    transition: all 0.5s;
    &.show {
      transform: translateX(0);
    }
    &-image {
      width: 48px;
      height: 48px;
      margin-right: 16px;
      background-color: #d8d8d8;
    }
    &-title {
      font-size: 15px;
      color: rgba($color: #fff, $alpha: 0.75);
    }
    &-weight {
      font-weight: 500;
    }
    &-text {
      @include line-clamp(3);
      width: 231px;
      font-size: 12px;
      line-height: 17px;
      color: rgba($color: #fff, $alpha: 0.4);
    }
  }
}
</style>
