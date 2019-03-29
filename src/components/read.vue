<template>
  <div class="read-component"
       :class="className">
    <div class="lyric">
      <text class="lyric-title">《{{title}}》</text>
      <text class="lyric-subtitle">{{subtitle}}</text>
      <div class="lyric-scroll"
           @touchend="touchend"
           @touchstart="touchstart">
        <div class="lyric-index"
             v-if="showLine">
          <text class="lyric-index_text">第{{indexArr[lyricIndex]}}句</text>
          <div class="lyric-index_line"></div>
        </div>
        <div class="mask-top"></div>
        <div class="mask-bottom"></div>
        <swiper class="lyric-swiper"
                previous-margin="178rpx"
                next-margin="178rpx"
                :style="{'height': swiperHeight + 'px'}"
                :current="lyricIndex"
                vertical
                @change="changeLyric">
          <block v-for="(item, index) in lyricArr"
                 :key="index">
            <swiper-item class="lyric-swiper_item"
                         catchtouchmove="catchtouchmove"
                         v-if="disabled">
              <text class="lyric-text"
                    :class="{'active': lyricIndex == index, 'isReady': isReady}">{{item[1]}}</text>
            </swiper-item>
            <swiper-item class="lyric-swiper_item"
                         v-else>
              <text class="lyric-text"
                    :class="{'active': lyricIndex == index, 'isReady': isReady}">{{item[1]}}</text>
            </swiper-item>
          </block>
        </swiper>
      </div>
    </div>
    <div class="control"
         v-if="showControl">
      <div class="control-header">
        <div class="control-progress">
          <text class="start-time">{{startTime}}</text>
          <div class="progress">
            <div class="progress-bar"
                 :style="{'width': progress + '%'}"></div>
          </div>
          <text class="end-time">{{endTime}}</text>
        </div>
        <div class="control-list"
             v-if="showList && !share"
             @tap="clickList"></div>
      </div>
      <div class="control-content">
        <div class="control-btn"
             v-if="!paused"
             @tap="clickPrev">上一句</div>
        <div class="play-btn"
             :class="{'pause': paused}"
             @tap="clickPlay"></div>
        <div class="control-btn"
             v-if="!paused"
             @tap="clickNext">下一句</div>
      </div>
      <div v-if="share"
           @tap="clickReadBtn"
           class="share-btn">
        我要朗读
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    lyricText: {
      type: String,
      default: ''
    },
    lyricSrc: {
      type: String,
      default: ''
    },
    share: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    showControl: {
      type: Boolean,
      default: true
    },
    showList: {
      type: Boolean,
      default: true
    },
    showLine: {
      type: Boolean,
      default: false
    },
    swiperHeight: {
      type: Number,
      default: 210
    },
    disabled: {
      type: Boolean,
      default: false
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    isReady: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      indexArr: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '二十一', '二十二', '二十三', '二十四', '二十五', '二十六', '二十七', '二十八', '二十九', '三十', '三十一', '三十二', '三十三', '三十四', '三十五', '三十六', '三十七', '三十八', '三十九', '四十', '四十一', '四十二', '四十三', '四十四', '四十五', '四十六', '四十七', '四十八', '四十九', '五十'],
      lyricIndex: 0,
      lyricArr: [],
      startTime: '00:00',
      endTime: '00:00',
      progress: 0,
      proIndex: 0,
      tapSwiper: false,
      timer: null,
      paused: true
    }
  },

  watch: {
    lyricSrc (n, o) {
      if (n) {
        this.audio.src = n
      }
    },
    lyricText (n, o) {
      if(n) {
        this.lyricArr = this.sliceNull(this.parseLyric(n))
      }

    }
  },

  // computed: {
  //   line() {
  //     let a = this.lyricText.split(/\\n/)
  //     console.log(a)
  //     return 11
  //   }
  // },

  methods: {
    play () {
      console.log('clickPlay')
      this.audio.play()
    },
    pause () {
      console.log('clickPause')
      this.audio.pause()
    },
    stop () {
      this.audio.stop()
    },
    setIndex (n) {
      this.lyricIndex = n ? n : 0
    },
    setSrc (url) {
      this.audio.src = url
    },
    clickReadBtn () {
      this.$emit('clickRead')
    },
    catchtouchmove () {
      return true
    },
    clickPlay () {
      console.log(this.audio.paused)
      if (this.audio.paused) {
        this.audio.play()
      } else {
        this.audio.pause()
      }
    },
    clickNext () {
      if (this.lyricIndex == this.lyricArr.length - 2) {
        return
      }
      this.audio.seek(this.lyricArr[this.lyricIndex + 1][0])
      this.$emit('next')
    },
    clickPrev () {
      console.log(this.lyricArr[this.lyricIndex][0])
      this.audio.seek(this.lyricArr[this.lyricIndex - 1][0])
      this.$emit('prev')
    },
    touchend () {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        console.log('end')
        this.tapSwiper = false
      }, 4000);
    },
    touchstart () {
      console.log('start')
      this.tapSwiper = true
    },
    changeLyric (e) {
      this.$emit('changeLyric', e)
    },
    clickList () {
      this.$emit('clickList')
    },
    parseLyric (text) {
      console.log(text, 111)
      let result = [];
      let lines = text.split(/\n/), //切割每一行
        pattern = /\[\d{2}:\d{2}.\d{2}\]/g; //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
      console.log(lines)
      //去掉不含时间的行

      //上面用'\n'生成数组时，结果中最后一个为空元素，这里将去掉
      lines[lines.length - 1].length === 0 && lines.pop();
      lines.forEach(function (v /*数组元素值*/, i /*元素索引*/, a /*数组本身*/) {
        //提取出时间[xx:xx.xx]
        let time = v.match(pattern),
          //提取歌词
          value = v.replace(pattern, '');
        // 因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
        time.forEach(function (v1, i1, a1) {
          //去掉时间里的中括号得到xx:xx.xx
          var t = v1.slice(1, -1).split(':');
          //将结果压入最终数组
          result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
        });
      });
      //最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
      result.sort(function (a, b) {
        return a[0] - b[0];
      });
      return result;
    },
    sliceNull (lrc) {
      var result = []
      for (var i = 0; i < lrc.length; i++) {
        if (lrc[i][1] == "") {
        } else {
          result.push(lrc[i]);
        }
      }
      return result
    },
    initAudio () {
      console.log(111)
      this.audio.src = this.lyricSrc
      this.audio.autoplay = this.autoplay
      console.log(this.audio.src)
      if (this.autoplay) {
        setTimeout(() => {
          this.audio.play()
        }, 1000);
      }

      this.audio.onPlay(() => {
        this.paused = false
        console.log('play')
        this.$emit('paused', this.audio.paused)
        this.$emit('play')
      })

      this.audio.onPause(() => {
        this.paused = true
        this.$emit('paused', this.audio.paused)
        this.$emit('pause')
      })

      this.audio.onStop(() => {
        console.log('stop')
        this.paused = true
        this.progress = 0
        this.startTime = '00:00'
        this.lyricIndex = 0
      })

      this.audio.onEnded(() => {
        console.log('end')
        this.progress = 0
        this.lyricIndex = 0
        this.paused = true
        this.startTime = '00:00'
        this.$emit('progress', 100)
        this.$emit('ended')
      })

      this.audio.onTimeUpdate(() => {
        this.startTime = this.timeToFormat(this.audio.currentTime)
        this.progress = Math.floor((this.audio.currentTime / this.audio.duration) * 100)

        if (this.endTime == '00:00') {
          this.endTime = this.timeToFormat(this.audio.duration)
          this.$emit('duration', {
            duration: this.audio.duration
          })
        }

        if ((this.lyricIndex != this.lyricArr.length - 1) && !this.tapSwiper) {

          this.lyricArr.forEach((e, i) => {
            let { lyricIndex } = this
            let currentTime = this.audio.currentTime
            if (lyricIndex == this.lyricArr.length - 2 && currentTime > (this.lyricArr[this.lyricArr.length - 1][0] - 0.9)) {
              this.lyricIndex = this.lyricArr.length - 1
              return;
            } else if (lyricIndex != this.lyricArr.length - 2) {
              if (currentTime >= e[0] && currentTime < this.lyricArr[i + 1][0]) {
                this.lyricIndex = i
                return;
              }
            }

          })
        }
        this.$emit('timeUpdate', {
          currentTime: this.audio.currentTime,
          formatCurrentTime: this.timeToFormat(this.audio.currentTime)
        })
        this.$emit('progress', this.progress)
      })

    },
    timeToFormat (times) {
      var result = '00:00';
      var hour, minute, second
      if (times > 0) {

        minute = Math.floor(times / 60);
        if (minute < 10) {
          minute = "0" + minute;
        }

        second = Math.floor((times - 60 * minute) % 60);
        if (second < 10) {
          second = "0" + second;
        }
        result = minute + ':' + second;
      }
      return result;
    }
  },
  mounted () {
    console.log(111)
    console.log('show read')
    if (this.lyricText) {
      this.lyricArr = this.sliceNull(this.parseLyric(this.lyricText))
    }
    this.audio = this.globalData.audio
    this.initAudio()
  },
  onHide () {
    this.audio.stop()
    setTimeout(() => {
      this.lyricIndex = 0
      this.startTime = '00:00'
      this.endTime = '00:00'
      this.progress = 0
      this.tapSwiper = false
      this.timer = null
      this.paused = true
    }, 1000);
    console.log('hide')
  },
  onUnload () {
    this.audio.stop()
    setTimeout(() => {
      this.lyricIndex = 0
      this.startTime = '00:00'
      this.endTime = '00:00'
      this.progress = 0
      this.tapSwiper = false
      this.timer = null
      this.paused = true
    }, 1000);

    console.log('Unload ')
  }
}
</script>

<style lang="scss" scoped>
.lyric-index {
  @include flex-center;
  justify-content: flex-start;
  position: absolute;
  top: 50%;
  left: 16px;
  right: 16px;
  font-size: 10px;
  color: rgba($color: #fff, $alpha: 0.75);
  transform: translateY(-50%);
  &-text {
    width: 60px;
  }
  &_line {
    margin-left: 13px;
    width: 280px;
    border-top: 1px rgba($color: #fff, $alpha: 0.4) dashed;
  }
}
.share-btn {
  @include flex-center;
  margin-top: 15px;
  width: 327px;
  height: 42px;
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  background: linear-gradient(
    90deg,
    rgba(151, 240, 94, 1) 0%,
    rgba(56, 226, 146, 1) 100%
  );
  box-shadow: 0px 3px 8px -3px rgba(183, 242, 175, 0.4);
  border-radius: 26px;
}
.mask-top {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 21px;
  background: linear-gradient(
    360deg,
    rgba(1, 20, 29, 0) 0%,
    rgba(1, 20, 29, 1) 100%
  );
  z-index: 9;
}
.mask-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 21px;
  background: linear-gradient(
    180deg,
    rgba(1, 20, 29, 0) 0%,
    rgba(1, 20, 29, 1) 100%
  );
  z-index: 9;
}
.play-btn {
  @include bg('/read/msfd-button-pause.png');
  margin: 0 40px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  &.pause {
    @include bg('/read/msfd-button-play.png');
  }
}
.control {
  position: absolute;
  padding: 24px;
  bottom: 0;
  left: 0;
  right: 0;
  &-btn {
    @include flex-center;
    width: 72px;
    height: 36px;
    font-size: 12px;
    color: rgba($color: #fff, $alpha: 0.75);
    border-radius: 18px;
    border: 1px solid rgba(255, 255, 255, 0.16);
  }
  &-content {
    @include flex-center;
  }
  &-list {
    @include bg('/read/msfd-button-list.png');
    margin-left: 24px;
    width: 24px;
    height: 18px;
  }
  &-header {
    @include flex-center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  &-progress {
    flex: 1;
    @include flex-center;
    .start-time,
    .end-time {
      font-size: 12px;
      color: rgba($color: #fff, $alpha: 0.4);
    }
    .end-time {
      color: rgba($color: #fff, $alpha: 0.75);
    }
    .progress {
      flex: 1;
      position: relative;
      margin: 0 8px;
      height: 2px;
      background-color: #979797;
      border-radius: 20px;
      &-bar {
        position: absolute;
        left: 0;
        top: 50%;
        height: 4px;
        background-color: #30c0ff;
        border-radius: 20px;
        transform: translateY(-50%);
      }
    }
  }
}
.lyric {
  @include flex-column-center;
  &-title {
    font-size: 24px;
    color: rgba($color: #fff, $alpha: 0.75);
    margin-bottom: 8px;
  }
  &-subtitle {
    margin-bottom: 12px;
    font-size: 12px;
    color: rgba($color: #fff, $alpha: 0.4);
  }
  &-scroll,
  &-swiper {
    position: relative;
    width: 100%;
    height: 210px;
  }
  &-swiper_item {
    @include flex-center;
  }
  &-text {
    padding: 0 10px;
    font-size: 15px;
    color: rgba($color: #fff, $alpha: 0.4);
    background-color: #01141d;

    &.active {
      font-size: 18px;
      font-weight: 500;
      color: #30c0ff;
    }
    &.isReady {
      font-size: 17px !important;
      color: #fff;
    }
  }
}

.readPage {
  .lyric-text.active {
    color: #38e292 !important;
  }
}
</style>
