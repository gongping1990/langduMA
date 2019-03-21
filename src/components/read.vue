<template>
  <div class="read-component">
    <div class="lyric">
      <text class="lyric-title">《天地人》</text>
      <text class="lyric-subtitle">人教版·一年级·下册</text>
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
                    :class="lyricIndex == index ? 'active' : ''">{{item[1]}}</text>
            </swiper-item>
            <swiper-item class="lyric-swiper_item"
                         v-else>
              <text class="lyric-text"
                    :class="lyricIndex == index ? 'active' : ''">{{item[1]}}</text>
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
             v-if="showList"
             @tap="changePopup"></div>
      </div>
      <div class="control-content">
        <div class="control-btn"
             @tap="clickPrev">上一句</div>
        <div class="play-btn"
             @tap="clickPlay"></div>
        <div class="control-btn"
             @tap="clickNext">下一句</div>
      </div>
      <slot name="footer-content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    lyricText: {
      type: String,
      default: `[00:00.00]时钟不要走\n[00:04.22]让我脆弱一分钟\n[00:07.44]要多久才能习惯被放手\n[00:15.80]马克杯空了 暖暖的温热\n[00:22.66]却还在我手中停留\n[00:27.96]\n[00:29.79]勇气不要走\n[00:32.20]给我理由再冲动\n[00:35.69]去相信爱情 就算还在痛\n[00:43.96]如果我不说不会有人懂\n[00:50.72]失去你我有多寂寞\n[00:55.61]还是愿意\n[00:57.58]付出一切仅仅为了一个好梦\n[01:03.98]梦里有人真心爱我 陪我快乐也陪我沉默\n[01:11.26]没有无缘无故的痛承受越多越成熟\n[01:18.63]能让你拥抱更好的我\n[01:25.03] 谁也不要走\n[01:28.27]应该是一种奢求\n[01:31.90]可是我只想 握紧你的手\n[01:39.78]我宁愿等候 也不愿错过\n[01:46.63]你对我微笑的时候\n[01:56.78]\n[02:18.91]还是愿意\n[02:21.32]用尽全力仅仅为了一个以后\n[02:27.87]哪怕生命并不温柔哪怕被幸福一再反驳\n[02:34.87]也要相信伤痕累累 其实只是在琢磨\n[02:42.07]能让你为之一亮 的我`
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
      default: true
    },
    swiperHeight: {
      type: Number,
      default: 210
    },
    disabled: {
      type: Boolean,
      default: true
    },
    autoplay: {
      type: Boolean,
      default: false
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
      timer: null
    }
  },
  methods: {
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
      this.$emit('paused', this.audio.paused)
    },
    clickNext () {
      this.lyricIndex += 1
      console.log(this.lyricArr[this.lyricIndex][0])
      this.audio.seek(this.lyricArr[this.lyricIndex][0])
      this.$emit('next')
    },
    clickPrev () {
      this.lyricIndex -= 1
      console.log(this.lyricArr[this.lyricIndex][0])
      this.audio.seek(this.lyricArr[this.lyricIndex][0])
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
      this.lyricIndex = e.mp.detail.current
      this.$emit('changeLyric')
    },
    parseLyric (text) {
      let result = [];
      let lines = text.split('\n'), //切割每一行
        pattern = /\[\d{2}:\d{2}.\d{2}\]/g; //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]

      //去掉不含时间的行
      while (!pattern.test(lines[0])) {
        lines = lines.slice(1);
      };

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
      this.audio.src = 'http://h5player.bytedance.com/video/music/audio.mp3'
      this.audio.autoplay = this.autoplay

      if (this.autoplay) {
        setTimeout(() => {
          this.audio.play()
        }, 1000);
      }

      this.audio.onPlay(() => {
        this.$emit('play')
      })

      this.audio.onEnded(() => {
        this.$emit('ended')
      })

      this.audio.onTimeUpdate(() => {
        this.$emit('timeUpdate')
        if (this.endTime == '00:00') {
          this.endTime = this.timeToFormat(this.audio.duration)
        }
        this.startTime = this.timeToFormat(this.audio.currentTime)
        this.progress = Math.floor((this.audio.currentTime / this.audio.duration) * 100)
        console.log(this.tapSwiper)
        if ((this.proIndex != this.lyricIndex) && !this.tapSwiper) {
          this.lyricIndex = this.proIndex
        }
        if ((this.lyricIndex != this.lyricArr.length - 1) && !this.tapSwiper) {
          var j = 0;
          for (var j = this.lyricIndex; j < this.lyricArr.length; j++) {
            // 当前时间与前一行，后一行时间作比较， j:代表当前行数
            if (this.lyricIndex == this.lyricArr.length - 2) {
              //最后一行只能与前一行时间比较
              if (parseFloat(this.audio.currentTime) > parseFloat(this.lyricArr[this.lyricArr.length - 1][0])) {
                this.lyricIndex = this.lyricArr.length - 1
                this.proIndex = this.lyricArr.length - 1
                return;
              }
            } else {
              if (parseFloat(this.audio.currentTime) > parseFloat(this.lyricArr[j][0]) && parseFloat(this.audio.currentTime) < parseFloat(this.lyricArr[j + 1][0])) {
                this.lyricIndex = j
                this.proIndex = j
                return;
              }
            }
          }
        }
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
  created () {
    this.lyricArr = this.sliceNull(this.parseLyric(this.lyricText))
    this.audio = this.globalData.audio
    this.initAudio()
  },
  destroyed () {
    this.audio.stop()
    console.log('destroyed')
  },
  onHide () {
    this.audio.stop()
    console.log('hide')
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
  color: #4a4a4a;
  transform: translateY(-50%);
  &-text {
    width: 60px;
  }
  &_line {
    margin-left: 13px;
    width: 280px;
    border-top: 1px #4a4a4a dashed;
  }
}
.mask-top {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 21px;
  background: linear-gradient(
    360deg,
    rgba(250, 250, 250, 0) 0%,
    rgba(250, 250, 250, 1) 100%
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
    rgba(250, 250, 250, 0) 0%,
    rgba(250, 250, 250, 1) 100%
  );
  z-index: 9;
}
.play-btn {
  margin: 0 40px;
  width: 48px;
  height: 48px;
  background: rgba(74, 74, 74, 1);
  border-radius: 50%;
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
    color: #4a4a4a;
    background: rgba(240, 240, 240, 1);
    border-radius: 18px;
    border: 1px solid rgba(155, 155, 155, 1);
  }
  &-content {
    @include flex-center;
  }
  &-list {
    margin-left: 24px;
    width: 24px;
    height: 18px;
    background-color: #4a4a4a;
  }
  &-header {
    @include flex-center;
    justify-content: space-between;
    margin-bottom: 31px;
  }

  &-progress {
    flex: 1;
    @include flex-center;
    .start-time,
    .end-time {
      font-size: 12px;
      color: #4a4a4a;
    }
    .end-time {
      color: #9b9b9b;
    }
    .progress {
      flex: 1;
      position: relative;
      margin: 0 8px;
      height: 1px;
      background-color: #979797;
      border-radius: 20px;
      &-bar {
        position: absolute;
        left: 0;
        top: 50%;
        height: 3px;
        background-color: #4a4a4a;
        border-radius: 20px;
        transform: translateY(-50%);
      }
    }
  }
}
.lyric {
  @include flex-column-center;
  margin-top: 32px;
  &-title {
    font-size: 24px;
    margin-bottom: 8px;
  }
  &-subtitle {
    margin-bottom: 32px;
    font-size: 12px;
    color: #4a4a4a;
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
    color: #9b9b9b;
    background-color: #fafafa;
    &.active {
      font-size: 17px;
      font-weight: 500;
      color: #4a4a4a;
    }
  }
}
</style>
