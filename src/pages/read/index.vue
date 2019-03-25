<template>
  <div class="read">
    <div class="mask"
         v-if="showMask">
      <div class="mask-content"
           v-if="percent != 100">
        <wux-circle :sAngle="270"
                    :strokeWidth="2"
                    :size="60"
                    :animate="false"
                    :percent="percent"
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
          :isReady="true"
          :title="courseData.name"
          :subtitle="subtitle"
          :lyricSrc="courseData.authorVrAudio"
          :lyricText="courseData.introduction"
          :showControl="false"
          :disabled="disabled"
          @ended="bindEnded"
          @progress="changeProgress"
          @duration="changeDuration"
          v-if="show">
    </read>
    <div class="control"
         v-if="!isStart">
      <text class="control-text">请阅读课文，准备朗读</text>
      <div class="control-btn"
           @tap="clickStart">
      </div>
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
             v-if="isEnd">重录</div>
        <div class="play-btn ly"
             v-if="!isEnd"
             @tap="clickRecorderStart">
          <text class="play-btn_text">{{duration}}</text>
        </div>
        <div class="play-btn"
             v-else
             @tap="clickRecorderPlay"></div>
        <div class="save-btn"
             v-if="isEnd">保存</div>
      </div>
    </div>

  </div>
</template>

<script>
import read from '../../components/read'
import store from '../../store'
import api from '../../request/api'

export default {
  data () {
    return {
      showAchieve: false,
      showRead: false,
      showPopup: false,
      show: true,
      disabled: false,
      showMask: false,
      percent: 0,
      downTime: 3,
      timer: null,
      isStart: true,
      paused: false,
      progress: 0,
      recorder: null,
      isPlay: null,
      isEnd: false,
      duration: '00:00',
      courseData: {}
    }
  },

  computed: {
    userInfo () {
      return store.state.userInfo
    }
  },

  watch: {
    userInfo(n, o) {
      if(n.id && !o.id) {
        console.log(this.$root.$mp.query)
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
        this.isPlay = false
        this.isEnd = true
        this.recorderSrc = e.tempFilePath
        this.audio.src = e.tempFilePath
        this.audio.play()
      })
    },
    bindEnded () {
      this.recorder.stop()
    },
    changeDuration (params) {
      this.duration = params.formatDuration
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
    },
    clickRecorderPlay () {
      if (this.audio.paused) {
        this.audio.play()
      } else {
        this.audio.pause()
      }
    },
    clickRecorderStart () {
      let { recorder } = this
      console.log()
      if (this.isPlay != null) {
        if (this.isPlay) {
          this.recorder.pause()
        } else {
          this.recorder.resume()
        }
      } else {
        this.$refs.read.play()
      }


    },
    changeProgress (progress) {
      console.log(progress)
      this.progress = progress
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
    clickStart () {
      this.showMask = true
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
    },
    donwTimeStart () {
      this.timer = setInterval(() => {
        console.log(2)
        this.downTime -= 1
        if (!this.downTime) {
          clearInterval(this.timer)
          this.downTime = 3
          this.percent = 0
          this.isStart = true
          this.showMask = false
        }
      }, 1000);
    },
    getCourseDetail () {
      api.course.getById({
        id: this.$root.$mp.query.id
      }).then(({ data }) => {
        this.courseData = data.resultData
        this.getCourseList()
      })
    },
  },



  mounted () {
    this.recorder = wx.getRecorderManager()
    this.audio = wx.createInnerAudioContext()
    this.initRecorder()
    if(this.userInfo.id) {
      this.getCourseDetail()
    }
    // this.initAudio()
    // let app = getApp()
  }
}
</script>

<style lang="scss" scoped>
.read {
  padding-top: 1px;
  height: 100vh;
  background-color: #01141d;
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
      background-color: #4a4a4a;
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
      font-size:22px;
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
      background-color: #01151F;
      &.ly {
        @include bg('/read/zyld-button-start.png');
      }
      &_text {
        font-size: 13px;
        margin-bottom: 15px;
      }
    }
    .reset-btn,
    .save-btn {
      @include flex-center;
      width: 92px;
      height: 52px;
      background: linear-gradient(
        90deg,
        rgba(151, 240, 94, 1) 0%,
        rgba(56, 226, 146, 1) 100%
      );
      box-shadow: 0px 3px 8px -3px rgba(183, 242, 175, 0.4);
      border-radius: 26px;
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
      color: #4a4a4a;
    }
    &-weight {
      font-weight: 500;
    }
  }
}
</style>
