<template>
  <div class="read">
    <div class="mask"
         v-if="showMask">
      <div class="mask-content"
           v-if="percent != 100">
        <wux-circle :sAngle="270"
                    :strokeWidth="2"
                    :size="60"
                    :speed="5000"
                    :percent="percentOne"
                    backgroundColor="#01141D"
                    color="#66FFF8">
          <div class="circle-text">{{percent}}<text>%</text></div>
        </wux-circle>
        <text class="mask-text">资源正在加载···</text>
      </div>
      <div class="mask-content"
           v-else>
        <div class="down-time">{{downTime}}</div>
        <text class="mask-text">请准备···</text>
      </div>
    </div>
    <div class="introduce">
      <image :src="userInfo.headimgurl"
             mode="widthFix"
             class="introduce-image" />
      <div class="introduce-title">朗读者：<text class="introduce-weight">{{userInfo.nickname}}</text></div>
    </div>

    <read ref="read"
          v-if="showRead"
          className="readPage"
          :isReady="!isStart"
          :title="courseData.name"
          :subtitle="subtitle"
          :lyricSrc="courseData.authorBgMusic"
          :lyricText="courseData.introduction"
          :showControl="false"
          :disabled="disabled"
          @paused="bindPaused"
          @ended="bindEnded"
          @progress="changeProgress"
          @timeUpdate="changeTimeUpdate">
    </read>
    <div class="control"
         v-if="!isStart">
      <text class="control-text">请阅读课文，准备朗读</text>
      <div class="control-btn"
           v-if="isAuth"
           @tap="clickStart">
      </div>
      <button open-type="openSetting"
              v-else
              class="control-btn"></button>
    </div>
    <div class="recorder-control control"
         :class="{'bg': !isEnd}"
         v-else>
      <div class="control-wrap">
        <div class="progress">
          <div class="progress-bar"
               :style="{'width': progress + '%'}"></div>
        </div>
        <div class="reset-btn"
             v-if="isPlay == false || isEnd"
             @tap="clickReset">重录</div>
        <div class="play-btn ly"
             v-if="!isEnd"
             @tap="clickRecorderStart">
          <text class="play-btn_text">{{currentTime}}</text>
        </div>
        <div class="play-btn bf"
             :class="{'paused': audioPause}"
             v-else
             @tap="clickRecorderPlay"></div>
        <div class="save-btn"
             v-if="isEnd"
             @tap="clickSave">保存</div>
      </div>
    </div>

    <wux-popup :visible="showReset"
               @close="changeReset">
      <div class="reset-popup">
        <text class="reset-popup_text">确认重录 </text>
        <text class="reset-popup_content">确认后，当前录制的内容将不会保存</text>
        <div class="reset-popup_btn">
          <div class="reset-popup_cancel"
               @tap="changeReset">取消</div>
          <div class="reset-popup_confim"
               @tap="clickResetConfim">确认</div>
        </div>
      </div>
    </wux-popup>
    <wux-popup :visible="showSuccessTwo"
               @close="changeSuccessPopupTwo">
      <div class="reset-popup">
        <div class="reset-popup_close" @tap="changeSuccessPopupTwo"></div>
        <div class="reset-popup_icon"></div>
        <text class="reset-popup_text">恭喜您录制完成 </text>
        <text class="reset-popup_content">赶快分享到班级群</text>
        <text class="reset-popup_content">集赞争做“人气之星”</text>
        <div class="reset-popup_btn">
          <button class="reset-popup_confim reset-popup_share"
                  open-type="share">
            分享到班级群
          </button>
        </div>
      </div>
    </wux-popup>
    <wux-popup :visible="showSuccess"
               closable
               @close="changeSuccessPopup">
      <div class="success-popup">
        <text class="success-popup_text">解锁新成就</text>
        <text class="success-popup_title">《{{courseData.name}}》</text>
        <image class="success-popup_image"
               :src="courseData.comAchievement" />
        <text class="success-popup_text">快去跟同学们秀一下吧！</text>
        <text class="success-popup_text"> 获得同学们的点赞，可以登上人气榜做明星哟~</text>
        <button class="success-popup_btn"
                open-type="share">
          分享到班级群
        </button>
      </div>
    </wux-popup>
  </div>
</template>

<script>
import read from '../../components/read'
import store from '../../store'
import api from '../../request/api'

export default {
  data () {
    return {
      showSuccessTwo: false,
      showSuccess: false,
      showAchieve: false,
      showRead: false,
      showPopup: false,
      show: false,
      disabled: false,
      showMask: false,
      percent: 0,
      downTime: 3,
      timer: null,
      isStart: false,
      paused: false,
      progress: 0,
      recorder: null,
      isPlay: null,
      isEnd: false,
      currentTime: '00:00',
      courseData: {},
      showReset: false,
      audioPause: true,
      isReset: false,
      percentOne: 0,
      isAuth: true,
      destroy: false
    }
  },

  computed: {
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
    initRecorder () {

      this.recorder.onStart(() => {
        this.isPlay = true
        this.$refs.read.play()
        console.log('start')
      })
      this.recorder.onResume(() => {
        this.isPlay = true
        this.$refs.read.play()
        console.log('resume')
      })
      this.recorder.onPause(() => {
        this.isPlay = false
        this.$refs.read.pause()
        console.log('pause')
      })
      this.recorder.onStop((e) => {
        console.log(!this.destroy)
        if (!this.destroy) {
          this.isPlay = false
          this.isEnd = true
          this.recorderSrc = e.tempFilePath
          this.$refs.read.setSrc(e.tempFilePath)
        }
        if (!this.isReset && !this.destroy) {
          this.clickRecorderPlay()
        }
      })
    },
    myWork () {
      wx.navigateTo({
        url: `/pages/myWorks/main?id=${this.courseData.id}&name=${this.courseData.name}`
      });
    },
    bindPaused (paused) {
      if (!this.isEnd) return
      this.audioPause = paused
    },
    clickResetConfim () {
      this.isReset = true
      this.recorder.stop()
      this.$refs.read.stop()
      this.$refs.read.setSrc(this.courseData.authorBgMusic)
      setTimeout(() => {

        this.currentTime = '00:00'
        this.isPlay = null
        this.isEnd = false
        this.changeReset()
      }, 500);
    },
    clickStop () {
      this.recorder.stop()
    },
    clickReset () {
      this.showReset = true
      this.recorder.pause()
    },
    clickSave () {
      wx.showLoading({
        title: '保存中...', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => { }
      });
      this.$refs.read.pause()
      wx.uploadFile({
        url: 'https://huoke.test.k12.vip/declaim/common/uploadPublicFile', //开发者服务器 url
        filePath: this.recorderSrc, //要上传文件资源的路径
        name: 'file', //文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
        header: {
          'content-type': 'multipart/form-data'
        },
        success: res => {
          let data = JSON.parse(res.data)
          this.saveFile(data.resultData.url)
        },
      });
    },
    saveFile (voiceUrl) {

      api.work.save({
        courseId: this.courseData.id,
        voiceUrl
      }).then(({ data }) => {
        wx.hideLoading();
        if (data.resultData.curworksNum == 1) {
          this.showSuccess = true
        } else {
          this.showSuccessTwo = true
        }
        this.workId = data.resultData.workId
      })
    },
    changeReset () {
      console.log('cancel')
      this.showReset = !this.showReset
      this.clickRecorderStart()
    },
    bindEnded () {
      this.$refs.read.stop()
      this.audioPause = true
      if (!this.recorder.paused) {
        this.recorder.stop()
      }
    },
    changeTimeUpdate (params) {
      this.currentTime = params.formatCurrentTime
    },
    clickRecorderPlay () {
      if (this.$refs.read.paused) {
        this.$refs.read.play()
      } else {
        this.$refs.read.pause()
      }
    },
    clickRecorderStart () {
      let { recorder } = this
      if (this.isPlay != null) {
        if (this.isPlay) {
          this.recorder.pause()
        } else {
          this.recorder.resume()
        }
      } else {
        this.isReset = false
        this.$refs.read.play()
        this.disabled = true
        console.log(this.recorder)
        this.recorder.start({
          format: 'mp3',
          sampleRate: 16000,
          encodeBitRate: 96000,
          duration: 6000000
        })
        wx.setKeepScreenOn({
          keepScreenOn: true
        })
      }


    },
    changeProgress (progress) {
      console.log(progress)
      this.progress = progress
    },
    changePopup () {
      this.showPopup = !this.showPopup
    },
    changeSuccessPopup () {
      this.showSuccess = !this.showSuccess
      this.myWork()
    },
    changeSuccessPopupTwo () {
      this.showSuccessTwo = !this.showSuccessTwo
      this.myWork()
    },
    changeAchieve () {
      this.showAchieve = !this.showAchieve
    },
    changeRead () {
      this.showRead = !this.showRead
    },
    clickStart () {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.record'] == false) {
            this.isAuth = false
            return
          }
          if (!res.authSetting['scope.record']) {
            console.log(res)
            wx.authorize({
              scope: 'scope.record',
              success () {
                console.log('授权成功')
              }
            })
          } else {
            this.showMask = true
            this.percentOne = 100
            this.isStart = true
            this.timer = setInterval(() => {
              let random = Math.floor(10 * Math.random())
              if (this.percent != 100) {
                console.log(this.percent, Math.floor(10 * Math.random()))
                this.percent = this.percent + random <= 100 ? this.percent + random : 100
              } else {
                clearInterval(this.timer)
                this.donwTimeStart()
              }

            }, 200);
          }
        }
      })

    },
    donwTimeStart () {
      this.timer = setInterval(() => {
        this.downTime -= 1
        if (!this.downTime) {
          clearInterval(this.timer)
          this.$refs.read.setIndex()
          this.downTime = 3
          this.percent = 0
          this.showMask = false
          setTimeout(() => {
            this.clickRecorderStart()
          }, 2000);
        }
      }, 1000);
    },
    getCourseDetail () {
      api.course.getById({
        id: this.$root.$mp.query.id
      }).then(({ data }) => {
        this.courseData = data.resultData
        this.show = true
        this.getCourseList()
      })
    },
  },



  mounted () {
    setTimeout(() => {
      this.showRead = true
    }, 500);
    this.destroy = false
    this.recorder = wx.getRecorderManager()
    // this.audio = wx.createInnerAudioContext()
    // this.audio.onPlay(() => {
    //   this.audioPause = false
    // })
    // this.audio.onPause(() => {
    //   this.audioPause = true
    // })

    // this.audio.onStop(() => {
    //   this.audioPause = true
    // })

    // this.audio.onEnded(() => {
    //   this.audioPause = true
    // })
    this.initRecorder()
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success () {
              console.log('授权成功')
            },
            fail: () => {
              this.isAuth = false
              console.log('fail')
            }
          })
        }
        if (res.authSetting['scope.record'] == false) {
          this.isAuth = false
        } else {
          this.isAuth = true
        }
      },

    })
    if (this.userInfo.id) {
      this.getCourseDetail()
    }
    // this.initAudio()
    // let app = getApp()
  },

  onShow () {
    this.showRead = true
    this.destroy = false
    wx.getSetting({      success: res => {
        if (res.authSetting['scope.record'] == false) {
          this.isAuth = false
        } else {
          this.isAuth = true
        }
      }    });
  },

  onUnload () {
    this.showRead = false
    this.destroy = true
    if (this.timer) {
      clearInterval(this.timer)
    }
    if (!this.recorder.paused) {
      this.recorder.stop()
    }
    this.showSuccessTwo = false
    this.showSuccess = false
    this.showAchieve = false
    this.showRead = false
    this.showPopup = false
    this.show = false
    this.disabled = false
    this.showMask = false
    this.percent = 0
    this.downTime = 3
    this.timer = null
    this.isStart = false
    this.paused = false
    this.progress = 0
    this.recorder = null
    this.isPlay = null
    this.isEnd = false
    this.currentTime = '00:00'
    this.courseData = {}
    this.showReset = false
    this.audioPause = true
    this.isReset = false
    this.percentOne = 0
    this.isAuth = true
    this.globalData.audio.stop()
    this.globalData.audio.src = ''
  },

  onShareAppMessage () {
    return {
      title: `我的孩子刚朗读了《${this.courseData.name}》，非常棒，请给TA点个赞吧！`,
      path: '/pages/share/main?id=' + this.workId,
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
  padding-top: 1px;
  height: 100vh;
  background-color: #01141d;
  line-height: 20px;
  .success-popup {
    @include flex-column-center;
    &_text {
      font-size: 14px;
      color: rgba($color: #fff, $alpha: 0.75);
    }
    &_title {
      font-size: 20px;
      color: #fff;
    }
    &_image {
      margin: 16px 0;
      width: 180px;
      height: 240px;
      box-shadow: 0px 0px 16px -2px rgba(174, 194, 203, 0.4);
      border-radius: 6px;
    }
    &_btn {
      @include flex-center;
      margin-top: 24px;
      width: 263px;
      height: 40px;
      font-size: 15px;
      font-weight: 500;
      color: #fff;
      background: linear-gradient(
        90deg,
        rgba(102, 255, 248, 1) 0%,
        rgba(48, 192, 255, 1) 100%
      );
      border-radius: 26px;
    }
  }
  .reset-popup {
    position: relative;
    @include flex-column-center;
    padding: 24px 0;
    width: 327px;
    line-height: 26px;
    background: rgba(3, 26, 36, 1);
    box-shadow: 0px 2px 10px 0px rgba(1, 21, 31, 1);
    border-radius: 16px;
    &_close {
      @include bg('/read/button-icon-close.png');
      position: absolute;
      top: 16px;
      right: 16px;
      width: 15px;
      height: 15px;

    }
    &_text {
      font-size: 20px;
      color: rgba($color: #fff, $alpha: 1);
    }
    &_content {
      font-size: 16px;
      color: rgba($color: #fff, $alpha: 0.75);
    }
    &_btn {
      @include flex-center;
      margin-top: 32px;
      width: 236px;
    }
    &_cancel,
    &_confim {
      @include flex-center;
      box-sizing: border-box;
      width: 100px;
      height: 40px;
      font-size: 15px;
      font-weight: 500;
      border-radius: 26px;
      border: 1px solid rgba(255, 255, 255, 0.16);
    }
    &_confim {
      margin-left: 31px;
      color: #30c0ff;
    }
    &_share {
      margin-left: 0;
      width: 263px;
      background-color: #031a24;
    }
    &_icon {
      @include bg('/read/zyld-icon-done.png');
      margin-bottom: 12px;
      width: 56px;
      height: 56px;
    }
  }
  .progress {
    position: absolute;
    left: 24px;
    right: 24px;
    top: 0;
    width: 327px;
    height: 1px;
    background-color: #979797;
    &-bar {
      position: absolute;
      left: 0;
      top: 50%;
      height: 3px;
      border-radius: 2px;
      background-color: #38e292;
      transform: translateY(-50%);
    }
  }
  .mask {
    @include flex-column-center;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    background-color: #01141d;
    &-content {
      @include flex-column-center;
    }
    &-text {
      margin-top: 8px;
      font-size: 12px;
      color: #fff;
    }
    .down-time {
      @include flex-center;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      font-weight: 600;
      font-size: 22px;
      color: rgba(255, 255, 255, 1);
      line-height: 30px;
      background: linear-gradient(
        360deg,
        rgba(102, 255, 248, 1) 0%,
        rgba(48, 192, 255, 1) 100%
      );
    }
    .circle-text {
      font-size: 22px;
      font-weight: 600;
      color: rgba(255, 255, 255, 1);
      line-height: 30px;
      background: linear-gradient(
        90deg,
        rgba(102, 255, 248, 1) 0%,
        rgba(48, 192, 255, 1) 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text {
        font-size: 12px;
      }
    }
  }
  .control {
    @include flex-column-center;
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: 14px;
    color: #9b9b9b;
    &-wrap {
      @include flex-center;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 10;
    }
    &-bg {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: url('/static/images/a.gif') no-repeat;
      background-size: 100%;
      &_image {
        width: 100%;
      }
    }
    &.recorder-control {
      box-sizing: border-box;
      flex-direction: row;
      padding: 24px;
      height: 136px;
    }
    .play-btn {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      margin: 0 36px;
      width: 72px;
      height: 72px;
      background-color: #01151f;
      &.ly {
        position: absolute;
        margin: 0;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        @include bg('/read/zyld-button-start.png');
      }
      &.bf {
        @include bg('/read/zyld-button-play.png');
      }
      &.paused {
        @include bg('/read/zyld-button-pause.png');
      }
      &_text {
        font-size: 13px;
        margin-bottom: 15px;
      }
    }
    .reset-btn,
    .save-btn {
      position: absolute;
      top: 50%;
      @include flex-center;
      width: 92px;
      height: 52px;
      color: rgba($color: #fff, $alpha: 0.75);
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 26px;
      transform: translateY(-50%);
    }
    .save-btn {
      right: 24px;
    }
    .reset-btn {
      left: 24px;
    }
    &-btn {
      @include bg('/read/zyld-button-go.png');
      margin-top: 12px;
      margin-bottom: 40px;
      width: 260px;
      height: 52px;
    }
  }
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
  }
}
</style>
