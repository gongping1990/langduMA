<template>
  <div class="read"
       :class="{isIos: isIos}">
    <div class="mask"
         v-if="showMask">
      <div class="mask-content"
           v-if="percent != 100">
        <wux-circle :sAngle="270"
                    :strokeWidth="2"
                    :size="60"
                    :speed="5000"
                    :percent="percentOne"
                    backgroundColor="#27DCA3"
                    color="#fff">
          <div class="circle-text">{{percent}}<text>%</text></div>
        </wux-circle>
        <text class="mask-text">资源正在加载···</text>
      </div>
      <!-- <div class="mask-content"
           v-else>
        <div class="down-time">{{downTime}}</div>
        <text class="mask-text">请准备···</text>
      </div> -->
    </div>
    <!-- <div class="introduce">
      <image :src="userInfo.headimgurl"
             mode="widthFix"
             class="introduce-image" />
      <div class="introduce-title">朗读者：<text class="introduce-weight">{{userInfo.nickname}}</text></div>
    </div> -->
    <div class="read-line"
         v-if="isStart">
      <i class="read-line-left"></i>
      <i class="read-line-center"></i>
      <i class="read-line-right"></i>
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
          :showLine="false"
          @paused="bindPaused"
          @ended="bindEnded"
          @progress="changeProgress"
          @timeUpdate="changeTimeUpdate">
    </read>
    <div class="control"
         v-if="!isStart">
      <text class="control-text">{{downTime ? '朗读即将开始' : '请阅读课文，准备朗读'}}</text>
      <div class="down-time control-btn"
           v-if="downTime">{{downTime}}</div>
      <div class="control-btn"
           v-else-if="isAuth"
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
             @tap="clickReset">重新录制</div>
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
      <div class="success-tc ">
        <text class="success-tc_text">恭喜你录制完成 </text>
        <text class="success-tc_content">赶快分享到班级群</text>
        <text class="success-tc_content">集赞争做“人气之星”</text>
        <div class="success-tc_btn">
          <button class="success-tc_confim"
                  open-type="share">
            分享到班级群
          </button>
        </div>
        <div class="success-tc-close" @click="changeSuccessPopupTwo"></div>
      </div>
    </wux-popup>
    <wux-popup :visible="showSuccess"
               @close="changeSuccessPopup">
      <div class="success-tc js">
        <image class="success-tc_image"
               :src="courseData.comAchievement" />
        <text class="success-tc_text">{{courseData.name}}</text>
        <text class="success-tc_content">快去跟同学们秀一下吧！</text>
        <text class="success-tc_content">获得同学们的点赞，可以登上人气榜做明星哟</text>
        <div class="success-tc_btn">
          <button class="success-tc_confim"
                  open-type="share">
            分享到班级群
          </button>
        </div>
        <div class="success-tc-close" @click="changeSuccessPopup"></div>
      </div>
    </wux-popup>
  </div>
</template>

<script>
import read from '../../components/read'
import store from '../../store'
import api from '../../request/api'
import baseApi from '../../request/base.js'
import base from '../../request/base.js'
var COS = require('cos-wx-sdk-v5')

var cos = new COS({
  // ForcePathStyle: true, // 如果使用了很多存储桶，可以通过打开后缀式，减少配置白名单域名数量，请求时会用地域域名
  getAuthorization: function (options, callback) {
    // 异步获取签名
    wx.request({
      url: baseApi.url + '/common/getAudioCosSign',
      method: 'POST',
      data: {
        //  Method: options.Method,
        path: options.Pathname
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      dataType: 'text',
      success: function (result) {
        var data = JSON.parse(result.data);
        callback({
          Authorization: data.resultData
          // XCosSecurityToken: data.XCosSecurityToken, // 如果是临时密钥计算出来的签名，需要提供 XCosSecurityToken
        });
      }
    });
  }
});
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
      downTime: 0,
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
      destroy: false,
      isIos: false,
    }
  },

  computed: {
    userInfo () {
      console.log(store.state.userInfo, 'userInfo')
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
        console.log(e)
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

      setTimeout(() => {
        this.$refs.read.setSrc(this.courseData.authorBgMusic)
        this.currentTime = '00:00'
        this.isPlay = null
        this.isEnd = false
        this.changeReset()
      }, 1000);
    },
    clickStop () {
      this.recorder.stop()
    },
    clickReset () {
      this.showReset = true
      this.recorder.pause()
    },
    clickSave () {
      let nowd = new Date();
      let filename = this.userInfo.id + (nowd.getTime() + this.recorderSrc.substr(this.recorderSrc.lastIndexOf('.')));
      let path = "declaim_audio/" + nowd.getFullYear() + "/" + nowd.getMonth() + "/" + nowd.getDate() + "/" + filename
      console.log(filename, path)
      console.log('this.recorderSrc', this.recorderSrc)
      wx.showLoading({
        title: '保存中...', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => { }
      });
      this.$refs.read.pause()
      cos.postObject({
        Bucket: 'huoke-public-1254282420',
        Region: 'ap-chengdu',
        Key: path,
        FilePath: this.recorderSrc,
        onProgress: function (info) {
          console.log("上传进度==>", JSON.stringify(info));
        }
      }, (err, data) => {
        wx.hideLoading();
        if (err) {
          console.log("postObject err", err);

          wx.showToast({
            title: '保存失败', //提示的内容,
            icon: 'error', //图标,
            duration: 2000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: res => { }
          });
        } else if (data && data.statusCode == 200) {
          console.log("postObject data", data);
          this.saveFile("https://pub.file.k12.vip" + data.Location.substr(data.Location.indexOf('/')))
        }
      });
      // wx.uploadFile({
      //   url: base.url + '/common/uploadPublicFile', //开发者服务器 url
      //   filePath: this.recorderSrc, //要上传文件资源的路径
      //   name: 'file', //文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
      //   header: {
      //     'content-type': 'multipart/form-data'
      //   },
      //   success: res => {
      //     let data = JSON.parse(res.data)
      //     this.saveFile(data.resultData.url)
      //   },
      // });
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
            this.timer = setInterval(() => {
              let random = Math.floor(10 * Math.random())
              if (this.percent != 100) {
                console.log(this.percent, Math.floor(10 * Math.random()))
                this.percent = this.percent + random <= 100 ? this.percent + random : 100
              } else {
                this.showMask = false
                this.downTime = 3
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
          this.downTime = 0
          this.percent = 0
          this.isStart = true
          setTimeout(() => {
            this.clickRecorderStart()
          }, 200);
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

    wx.getSystemInfo({
      success: (res) => {
        this.isIos = res.model.indexOf('iPhone') != -1
      }
    })
    this.destroy = false
    this.recorder = wx.getRecorderManager()
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
    this.downTime = 0
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
    this.globalData.shareFn(this.workId)
    return {
      title: `我的孩子刚朗读了《${this.courseData.name}》，非常棒，请给TA点个赞吧！`,
      path: '/pages/share/main?id=' + this.workId,
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
  @include bg('/read/luzhi/background copy 2.png');
  box-sizing: border-box;
  background-position-y: bottom;
  padding-top: 60px;
  height: 100vh;
  background-color: #edfff8;
  line-height: 20px;

  &.isIos {
    .read-line {
      top: 204px;
    }
  }
  .read-line {
    position: absolute;
    left: 50%;
    top: 208px;
    width: 300px;
    border-top: 1px #36dba4 dashed;
    transform: translateX(-50%);
    &-left,
    &-right {
      @include bg('/read/luzhi/zyld-icon-microphone-2.png');
      position: absolute;
      top: 50%;
      width: 22px;
      height: 23px;
      transform: translateY(-50%);
    }
    &-right {
      right: -10px;
    }
    &-left {
      @include bg('/read/luzhi/zyld-icon-microphone-l.png');
      left: -10px;
    }
  }
  .success-tc {
    @include flex-column-center;
    @include bg('/read/tc/4.png');
    padding-top: 148px;
    padding-bottom: 40px;
    margin: 0 auto;
    width: 310px;
    height: 229px;
    &.js {
      @include bg('/read/tc/3.png');
      height: 280px;
      .success-tc_content {
        font-size: 12px;
      }
      .success-tc_text {
        font-size: 18px;
        margin-top: 12px;
      }
      .success-tc_btn {
        margin-top: 12px;
      }
    }
    &-close {
      @include bg('/read/fandukewenxuanzhe/msfd-icon-close.png');
      position: absolute;
      bottom: 0;
      left: 50%;
      margin-left: -12px;
      width: 24px;
      height: 24px;
    }
    &_image {
      width: 80px;
      height: 106px;
    }
    &_btn {
      @include flex-center;
      margin-top: 24px;
      width: 180px;
      height: 40px;
      background: rgba(54, 219, 164, 1);
      border-radius: 26px;
      font-size: 15px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
    }
    &_confim {
      color: #fff;
    }
    &_text {
      font-size: 20px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(50, 64, 98, 1);
      line-height: 28px;
    }
    &_content {
      font-size: 16px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(94, 103, 123, 1);
      line-height: 22px;
    }
  }
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
    padding-top: 29px;
    width: 327px;
    line-height: 26px;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    &_close {
      @include bg('/read/button-icon-close.png');
      position: absolute;
      top: 16px;
      right: 16px;
      width: 15px;
      height: 15px;
    }
    &_text {
      font-size: 18px;
      color: rgba($color: #000, $alpha: 0.75);
    }
    &_content {
      font-size: 14px;
      color: rgba($color: #000, $alpha: 0.75);
    }
    &_btn {
      @include flex-center;
      margin-top: 40px;
      width: 100%;
      border-top: 1px solid #f4f4f4;
    }
    &_cancel,
    &_confim {
      @include flex-center;
      flex: 1;
      box-sizing: border-box;
      height: 53px;
      font-size: 18px;
      font-weight: 500;
      color: rgba($color: #000, $alpha: 0.4);
      background-color: #fff;
    }
    &_confim {
      color: #fff;
      background-color: #27dca3;
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
    background-color: #36dba4;
    &-bar {
      position: absolute;
      left: 0;
      top: 50%;
      height: 3px;
      border-radius: 2px;
      background-color: #36dba4;
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
    background-color: #27dca3;
    &-content {
      @include flex-column-center;
    }
    &-text {
      margin-top: 8px;
      font-size: 12px;
      color: #fff;
    }

    .circle-text {
      font-size: 22px;
      font-weight: 600;
      color: #fff;
      line-height: 30px;
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
      padding-bottom: 120px;
      height: 215px;
    }
    .play-btn {
      position: absolute;
      margin: 0;
      left: 50%;
      top: 30px;
      transform: translate(-50%, 0);
      width: 64px;
      height: 64px;
      &.ly {
        @include bg('/read/luzhi/zyld-button-start.png');
      }
      &.bf {
        @include bg('/read/langdushiting/zyld-button-stop.png');
      }
      &.paused {
        @include bg('/read/langdushiting/zyld-button-pause.png');
      }
      &_text {
        position: absolute;
        left: 50%;
        top: -22px;
        font-size: 16px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(50, 64, 98, 1);
        transform: translateX(-50%);
      }
    }
    .reset-btn,
    .save-btn {
      position: absolute;
      top: 42px;
      @include flex-center;
      width: 72px;
      height: 36px;
      color: #27dca3;
      border: 1px solid #27dca3;
      border-radius: 26px;
      z-index: 10;
    }
    .save-btn {
      right: 36px;
    }
    .reset-btn {
      left: 36px;
    }
    &-btn {
      @include bg('/read/luzhi/zyld-button-start.png');
      margin-top: 4px;
      margin-bottom: 120px;
      width: 64px;
      height: 64px;
      &.down-time {
        @include flex-center;
        width: 64px;
        height: 64px;
        border-radius: 50%;
        font-weight: 600;
        font-size: 22px;
        color: #fff;
        line-height: 30px;
        background: #36DBA4;
      }
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
