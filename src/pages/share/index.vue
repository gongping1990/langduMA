<template>
  <div class="ld-share">
    <div class="ld-share-header">
      <div class="-header-left">
        <div class="-header-left-name">《{{shareInfo.courseName}}》</div>
        <div class="-header-left-time">
          <span class="-start">{{currentTime}}</span>
          <div class="-progress">
            <wux-progress status="normal"
                          :percent="percentInfo"
                          strokeWidth="2"
                          activeColor="#30C0FF"
                          backgroundColor="#f3f3f3" />
          </div>
          <span class="-end">{{duration}}</span>
        </div>
      </div>
      <div class="-header-right"
           @click="audioPlay">
        <div class="-header-right-img">
          <img v-if="!isPlay"
               class="-img"
               src="https://pub.file.k12.vip/read/lesson/kczy-button-play.png" />
          <img v-if="isPlay"
               class="-img"
               src="https://pub.file.k12.vip/2019/03/29/1111513347918516225.png" />
        </div>
      </div>
    </div>
    <div class="ld-share-content">
      <div class="-content-title">
        <div class="-content-title-img">
          <img class="-img"
               :src="shareInfo.headimgurl" />
        </div>
        <div class="-content-title-name">{{shareInfo.nickName}}</div>
        <div class="-content-title-text">
          <div class="-text-one"
               v-if="!shareInfo.liked">
            我刚读了《{{shareInfo.courseName}}》
          </div>
          <div class="-text-one"
               v-if="shareInfo.liked">感谢你的点赞鼓励</div>
          <div class="-text-two"
               v-if="!shareInfo.liked">请给我点个赞吧</div>
          <div class="-text-two"
               v-if="shareInfo.liked">这是我朗读获得的成就卡片</div>
        </div>
      </div>
      <div class="-content-body">
        <div class="-body-img"
             style="background: url('https://pub.file.k12.vip/2019/03/25/1110002707316191234.png') no-repeat;background-size: cover;">
          <div class="-body-img-center"
               v-if="!shareInfo.liked">
            <img @click="likeFn"
                 class="-img"
                 src="https://pub.file.k12.vip/read/button-good.png" />
          </div>
          <div class="-body-img-mask"
               v-if="!shareInfo.liked"></div>
          <div class="-body-img-like"
               v-if="shareInfo.liked">
            <img class="-img"
                 src="https://pub.file.k12.vip/read/course/kczy-icon-good.png" />
            {{shareInfo.likedCount}}
          </div>
        </div>
      </div>
      <div class="-content-footer">
        <div class="-content-footer-text"
             @click="toReport">
          <div>我要举报</div>
          <img class="-image"
               src="https://pub.file.k12.vip/read/icon-report.png" />
        </div>
      </div>
    </div>
    <div class="ld-share-footer">
      <div class="-footer-btn"
           @click="toListen">名师朗读欣赏</div>
    </div>

    <wux-popup :visible="isOpenReport"
               @close="toReport">
      <div class="ld-share-popup">
        <div class="-popup-title">举报内容</div>
        <textarea class="-popup-content"
                  placeholder="请输入举报原因，不少于5个字~"
                  @blur="reportFn"
                  :value="reportInfo" />
        <div class="-popup-btn" @click="submitReport">确认举报</div>
      </div>
    </wux-popup>
  </div>
</template>

<script>
import api from "../../request/api";

export default {
  data () {
    return {
      page: {
        current: 1,
        size: 20,
        total: ""
      },
      isOpenReport: false,
      isFetching: false,
      isPlay: false,
      shareInfo: "",
      reportInfo: "",
      duration: "00:00",
      durationFatter: "",
      currentTime: "00:00",
      currentTimeFatter: "",
      innerAudioContext: ''
    };
  },

  computed: {
    percentInfo () {
      return parseInt((parseInt(this.currentTimeFatter) / parseInt(this.durationFatter)) * 100);
    }
  },

  mounted () {
    this.getShareDetail();
  },

  methods: {
    toListen () {
      wx.navigateTo({
        url: `/pages/listen/main?id=${this.shareInfo.courseId}&share=1`
      });
    },
    init () {
      console.log('初始化播放')
      this.innerAudioContext = wx.createInnerAudioContext();
      this.innerAudioContext.src = this.shareInfo.voiceUrl;
      this.innerAudioContext.onPlay(() => {
        this.isPlay = true;
      });
      this.innerAudioContext.onPause(() => {
        this.isPlay = false;
      });
      this.innerAudioContext.onEnded(() => {
        this.currentTime = '00:00'
        this.percentInfo = 0
        this.isPlay = false;
      });
      this.innerAudioContext.onStop(() => {
        this.currentTime = '00:00'
        this.percentInfo = 0
        this.isPlay = false;
      });
      this.innerAudioContext.onTimeUpdate(() => {
        if (this.duration == "00:00") {
          this.duration = this.timeToFormat(this.innerAudioContext.duration);
          this.durationFatter = this.innerAudioContext.duration;
        }
        this.currentTime = this.timeToFormat(this.innerAudioContext.currentTime);
        this.currentTimeFatter = this.innerAudioContext.currentTime;
      });
    },
    audioPlay () {
      if (this.innerAudioContext.paused) {
        this.innerAudioContext.play();
      } else {
        this.innerAudioContext.pause();
      }
    },
    timeToFormat (times) {
      var result = "00:00";
      var hour, minute, second;
      if (times > 0) {

        minute = Math.floor(times / 60);
        if (minute < 10) {
          minute = "0" + minute;
        }

        second = Math.floor((times - 60 * minute) % 60);
        if (second < 10) {
          second = "0" + second;
        }
        result = minute + ":" + second;
      }
      return result;
    },
    likeFn () {
      api.user.likeContent({
        id: this.$root.$mp.query.id
      }).then(({ data }) => {
        this.getShareDetail();
        wx.showToast({
          title: "点赞成功",
          icon: "none",
          duration: 2000
        });
      });
    },
    reportFn (e) {
      this.reportInfo = e.mp.detail.value;
    },
    toReport () {
      this.reportInfo = "";
      this.isOpenReport = !this.isOpenReport;
    },
    submitReport () {
      if (!this.reportInfo) {
        return wx.showToast({
          title: "请输入举报原因，至少5个字哦~~",
          icon: "none",
          duration: 2000
        });
      }

      api.user.reportContent({
        id: this.$root.$mp.query.id,
        reportReason: this.reportInfo
      }).then(({ data }) => {
        this.toReport();
        wx.showToast({
          title: "举报成功",
          icon: "none",
          duration: 2000
        });
      });

    },
    toJump () {
      wx.navigateTo({
        url: "/pages/popularityRank/main"
      });
    },
    getShareDetail () {
      this.isFetching = true;
      api.work.shareDetail({
        id: this.$root.$mp.query.id
      }).then(({ data }) => {
        this.shareInfo = data.resultData;
        this.isFetching = false;
        this.init();
        setTimeout(() => {
          this.audioPlay()
        }, 1000)
      }, () => {
        this.isFetching = false;
      });
    }
  },
  onHide () {
    console.log('share, hide')
    this.innerAudioContext.destroy()
  },
  onUnload () {
    console.log('share, onUnload')
    this.innerAudioContext.destroy()
  },
  onShareAppMessage () {
    return {
      title: '[获课朗读]一线名师和你一起朗读',
      path: '/pages/index/main',
      imageUrl: 'https://pub.file.k12.vip/read/ldshared.jpeg'
    };
  }
};
</script>

<style lang="scss" scoped>
.ld-share {
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    margin: 16px 24px 24px;
    height: 87px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
    border-radius: 16px;

    .-header-left {
      width: 80%;

      &-name {
        margin-bottom: 16px;
        height: 22px;
        font-size: 16px;
        font-weight: 500;
        color: rgba(74, 74, 74, 1);
        line-height: 22px;
      }

      &-time {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;

        .-start {
          color: rgba(74, 74, 74, 1);
        }
        .-progress {
          width: 68%;
        }
        .-end {
          color: rgba(155, 155, 155, 1);
        }
      }
    }

    .-header-right {
      &-img {
        height: 36px;
        line-height: 36px;

        .-img {
          width: 36px;
          height: 36px;
        }
      }
    }
  }

  &-content {
    text-align: center;

    .-content-title {
      &-img {
        margin: 0 auto;

        .-img {
          border-radius: 50%;
          width: 48px;
          height: 48px;
        }
      }

      &-name {
        margin-top: 4px;
        margin-bottom: 8px;
        font-size: 15px;
        font-weight: 400;
        color: rgba(74, 74, 74, 1);
      }

      &-text {
        font-size: 20px;
        line-height: 28px;

        .-text-one {
          font-weight: bold;
        }

        .-text-two {
          font-size: 16px;
        }

        .-text-em {
          color: #ff668e;
          font-size: 24px;
        }
      }
    }

    .-content-body {
      position: relative;
      margin-top: 32px;

      .-body-img {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        width: 150px;
        height: 200px;
        background: rgba(74, 74, 74, 1);
        box-shadow: 0px 6px 16px 0px rgba(48, 192, 255, 0.5);
        border-radius: 6px;

        &-mask {
          position: absolute;
          width: 150px;
          height: 200px;
          background: rgba(48, 192, 255, 0.5);
          border-radius: 6px;
          filter: blur(2px);
        }

        &-like {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 68px;
          height: 24px;
          background: rgba(0, 0, 0, 0.16);
          border-radius: 100px 0px 6px 0px;
          font-size: 12px;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 24px;

          .-img {
            margin-right: 4px;
            width: 11px;
            height: 11px;
          }
        }

        &-center {
          z-index: 99;
          .-img {
            width: 72px;
            height: 72px;
          }
        }
      }
    }

    .-content-footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 65px;
      padding: 0 24px;

      &-text {
        width: 70px;
        display: flex;
        align-items: center;
        font-size: 12px;
        font-weight: 400;
        color: rgba(112, 115, 116, 1);

        .-image {
          width: 18px;
          height: 16px;
          margin-left: 4px;
        }
      }
    }
  }

  &-footer {
    padding: 0 24px;
    margin: 24px 0;
    text-align: center;

    .-footer-btn {
      height: 52px;
      background: #ffffff;
      border-radius: 26px;
      border: 1px solid rgba(48, 192, 255, 0.24);
      font-size: 15px;
      font-weight: 500;
      color: #30c0ff;
      line-height: 52px;
    }
  }

  &-popup {
    text-align: center;
    height: 294px;
    background: rgba(255, 255, 255, 1);
    border-radius: 16px;

    .-popup-title {
      padding: 32px 0 24px 0;
      height: 28px;
      font-size: 20px;
      font-weight: 500;
      color: rgba(74, 74, 74, 1);
      line-height: 28px;
    }

    .-popup-content {
      margin: 0 auto;
      width: 263px;
      height: 94px;
      background: rgba(0, 0, 0, 0.04);
      border-radius: 6px;
      border: 1px solid rgba(0, 0, 0, 0.16);
      font-size: 14px;
      padding: 10px;
      text-align: left;
    }

    .-popup-btn {
      background: linear-gradient(
        90deg,
        rgba(102, 255, 248, 1) 0%,
        rgba(48, 192, 255, 1) 100%
      );
      border-radius: 26px;
      text-align: center;
      margin: 33px 32px 23px 32px;
      height: 40px;
      font-size: 15px;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 40px;
    }
  }
}
</style>
