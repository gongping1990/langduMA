<template>
  <div class="ld-ranking">
    <div class="-scroll"
         v-if="isShowHeader">
      <div class="-scroll-bg">佳作推荐</div>
    </div>
    <scroll-view class="ld-ranking-wrap"
                 @scrolltolower="bindLoadItem"
                 scroll-y
                 @scroll="scrollTopFn"
                 scroll-with-animation>
      <div class="ld-ranking-top"
           :class="{'ld-ranking-bg': isShowTop }">
        <div class="-top-title">
          <div class="-top-title-left">上周人气之星</div>
          <div class="-top-title-right"
               @click="toJump">查看本周排行></div>
        </div>
        <div class="-top-content"
             v-if="isShowTop">
          <div class="-one">
            <div class="-one-img">
              <img class="-one-img-header"
                   @click="lookOtherWorks(twoInfo.userId)"
                   :src="twoInfo.headimage">
            </div>
            <div class="-one-name">
              {{twoInfo.nickname}}
            </div>
            <div class="-one-num">
              <img class="-one-num-img"
                   src="https://pub.file.k12.vip/read/wind/icon-good2.png" />
              <span>{{twoInfo.likes}}</span>
            </div>
            <img class="-one-image"
                 src="https://pub.file.k12.vip/read/wind/2.png" />
          </div>
          <div class="-two">
            <div class="-two-img">
              <img class="-two-img-crown"
                   src="https://pub.file.k12.vip/read/rank/icon-head champion.png" />
              <img class="-two-img-header"
                   @click="lookOtherWorks(oneInfo.userId)"
                   :src="oneInfo.headimage">
            </div>
            <div class="-two-name">{{oneInfo.nickname}}</div>
            <div class="-two-num">
              <img class="-two-num-img"
                   src="https://pub.file.k12.vip/read/wind/icon-good1.png" />
              <span>{{oneInfo.likes}}</span>
            </div>
            <img class="-two-image"
                 src="https://pub.file.k12.vip/read/wind/1.png" />
          </div>
          <div class="-one">
            <div class="-one-img">
              <img class="-one-img-header"
                   @click="lookOtherWorks(threeInfo.userId)"
                   :src="threeInfo.headimage" />
            </div>
            <div class="-one-name">{{threeInfo.nickname}}</div>
            <div class="-one-num -three-num">
              <img class="-one-num-img"
                   src="https://pub.file.k12.vip/read/wind/icon-good3.png" />
              <span>{{threeInfo.likes}}</span>
            </div>
            <img class="-one-image -three-image"
                 src="https://pub.file.k12.vip/read/wind/3.png" />
          </div>
        </div>
        <div v-if="!isShowTop">
          <img class="-top-no-bg"
               src="https://pub.file.k12.vip/read/week-rank-bg.png" />
        </div>
      </div>
      <div class="ld-ranking-down">
        <div class="-down-title"
             v-if="!isShowHeader">佳作推荐</div>
        <div class="-down-item"
             v-for="(item,index) of dataList"
             :key="index"
             @click="lookOtherRead(item)">
          <div class="-down-item-tip"
               v-if="item.recommend!=0"
               :class="{'-rq':item.recommend == '2','-tj':item.recommend=='1'}">
            {{tagList[item.recommend-1]}}
          </div>
          <div class="-down-item-left">
            <div class="-left-top">
              <img class="-left-top-img"
                   :src="item.headimgurl" />
              <div class="-left-top-text">
                <div class="-user-name">{{item.nickname}}</div>
                <div class="-book-name">《{{item.course}}》</div>
              </div>
            </div>
            <div class="-left-down">
              <div class="-left-down-text">
                <img class="-left-down-text-img"
                     src="https://pub.file.k12.vip/read/wind/icon-playing.png" />
                {{item.pv}}
              </div>
              <div class="-left-down-text">
                <img class="-left-down-text-img-two"
                     src="https://pub.file.k12.vip/read/rank/icon-good2.png" />
                {{item.likes}}
              </div>
            </div>
          </div>
          <div class="-down-item-right">
            <img class="-right-img"
                 src="https://pub.file.k12.vip/read/lesson/kczy-button-play.png" />
          </div>
        </div>
      </div>
    </scroll-view>
    <div class="card-mask"
         @click="clickCard"></div>
  </div>
</template>

<script>
import api from "../../request/api";

export default {
  data () {
    return {
      page: {
        current: 1,
        size: 10,
        total: ""
      },
      tagList: ["教师推荐", "人气之星"],
      isShowHeader: false,
      isShowTop: false,
      isFetching: false,
      dataList: [],
      oneInfo: [],
      twoInfo: [],
      threeInfo: []
    };
  },

  components: {},

  mounted () {
    this.getRecommendList();
    this.getThreeList();
  },

  methods: {
    clickCard () {
      wx.navigateTo({ url: '/pages/myCard/main' });
    },
    lookOtherRead (data) {
      if (data.myself) {
        wx.navigateTo({
          url: `/pages/listenWork/main?id=${data.workId}`
        });
      } else {
        wx.navigateTo({
          url: `/pages/share/main?id=${data.workId}`
        });
      }
    },
    lookOtherWorks (id) {
      wx.navigateTo({
        url: `/pages/otherUser/main?userId=${id}`
      });
    },
    scrollTopFn (e) {
      if (e.mp.detail.scrollTop > 324) {
        this.isShowHeader = true;
      } else {
        this.isShowHeader = false;
      }

    },
    bindLoadItem () {
      if (this.page.current < Math.ceil(this.page.total / this.page.size)) {
        this.page.current++;
        this.getRecommendList();
      }
    },
    toJump () {

      wx.navigateTo({
        url: `/pages/popularityRank/main?type=1`
      });
    },
    getThreeList () {
      this.isFetching = true;
      api.user.getTopThreeRank()
        .then(({ data }) => {
          this.isShowTop = data.resultData.length != 0;
          if (data.resultData.length) {
            this.oneInfo = data.resultData[0];
            this.twoInfo = data.resultData[1];
            this.threeInfo = data.resultData[2];
          }

          this.isFetching = false;
        }, () => {
          this.isFetching = false;
        });
    },
    getRecommendList () {
      this.isFetching = true;
      api.user.getRecommendRank({
        current: this.page.current,
        size: this.page.size
      }).then(({ data }) => {
        if (this.page.current > 1) {
          this.dataList = this.dataList.concat(data.resultData.records);
        } else {
          this.dataList = data.resultData.records;
        }
        this.page.total = data.resultData.total;
        this.isFetching = false;
      }, () => {
        this.isFetching = false;
      });
    }
  },

  created () {
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
.ld-ranking {
  &-wrap {
    height: 100vh;
  }

  .-scroll {
    position: fixed;
    top: 0;
    width: 100%;
    height: 60px;
    line-height: 60px;
    padding-left: 24px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.03);
    z-index: 999;
    animation: -scroll 0.5s;
    font-size: 20px;
    font-weight: 500;
    color: rgba(74, 74, 74, 1);

    &-bg {
      height: 46px;
      line-height: 46px;
      background: url('https://pub.file.k12.vip/read/rank/icon-tittle.png') 0%
        no-repeat;
      background-size: contain;
    }
  }

  @keyframes -scroll {
    /*设置内容由显示变为隐藏*/
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  &-bg {
    background: url('https://pub.file.k12.vip/read/wind/backgroud.png');
    background-size: cover;
    height: 351px;
  }

  &-top {
    padding: 0 24px 0 24px;

    .-top-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: rgba(255, 255, 255, 1);

      &-left {
        background: url('https://pub.file.k12.vip/read/rank/icon-tittle.png')
          10% no-repeat;
        background-size: contain;
        color: rgba(29, 27, 27, 1);
        font-size: 20px;
        font-weight: 500;
        height: 46px;
        line-height: 46px;
      }

      &-right {
        color: #30c0ff;
        font-size: 12px;
        font-weight: 400;
      }
    }

    .-top-content {
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      margin-top: 62px;
      text-align: center;

      .-one {
        width: 25%;

        &-img {
          margin: 0 auto;

          &-header {
            border-radius: 50%;
            width: 48px;
            height: 48px;
          }
        }

        &-name {
          width: 90px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          height: 18px;
          font-size: 13px;
          font-weight: 500;
          line-height: 18px;
          margin: 8px 0 4px 0;
        }

        &-num {
          height: 17px;
          font-size: 12px;
          font-weight: 400;
          color: #fea1baff;
          line-height: 17px;
          margin-bottom: 8px;

          &-img {
            margin-right: 4px;
            width: 15px;
            height: 15px;
          }
        }

        .-three-num {
          color: #86ecbcff;
        }

        &-image {
          width: 86px;
          height: 69px;
        }

        .-three-image {
          height: 49px;
        }
      }
      .-two {
        width: 50%;

        &-img {
          position: relative;
          margin: 0 auto;
          width: 80px;
          height: 80px;

          &-crown {
            position: absolute;
            top: -29px;
            left: 19px;
            width: 53px;
            height: 33px;
          }

          &-header {
            border: 3px solid rgba(226, 198, 92, 1);
            border-radius: 50%;
            width: 80px;
            height: 80px;
          }
        }

        &-name {
          height: 18px;
          font-size: 16px;
          font-weight: 500;
          line-height: 22px;
          margin: 8px 0 4px 0;
        }

        &-num {
          height: 17px;
          font-size: 14px;
          font-weight: 400;
          color: #e2c65cff;
          line-height: 20px;

          &-img {
            margin-right: 4px;
            width: 15px;
            height: 15px;
          }
        }

        &-image {
          margin-top: 12px;
          width: 128px;
          height: 107px;
        }
      }
    }

    .-top-no-bg {
      margin-top: 24px;
      width: 327px;
      height: 244px;
      border-radius: 16px;
    }
  }

  &-down {
    padding: 0 24px;

    .-down-title {
      background: url('https://pub.file.k12.vip/read/rank/icon-tittle.png') 0%
        no-repeat;
      background-size: contain;
      margin-top: 32px;
      font-size: 20px;
      font-weight: 500;
      color: rgba(74, 74, 74, 1);
      line-height: 46px;
      height: 46px;
    }

    .-down-item {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 16px 0;
      height: 102px;
      border-radius: 16px;
      box-shadow: 0px 2px 10px 0px rgba(222, 232, 237, 1);

      &-tip {
        position: absolute;
        top: 0;
        left: 0;
        width: 64px;
        height: 18px;
        background: rgba(155, 155, 155, 1);
        border-radius: 100px 0 100px 0;
        font-size: 10px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 18px;
        text-align: center;
      }

      .-rq {
        background: linear-gradient(
          90deg,
          rgba(253, 244, 197, 1) 0%,
          rgba(233, 223, 169, 1) 100%
        );
        color: #dcb876;
      }
      .-tj {
        background: linear-gradient(
          90deg,
          rgba(197, 255, 199, 1) 0%,
          rgba(161, 240, 203, 1) 100%
        );
        color: #79d0a7;
      }

      &-left {
        padding: 28px 0 15px 24px;

        .-left-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;

          &-img {
            margin-right: 12px;
            border-radius: 50%;
            width: 36px;
            height: 36px;
          }

          &-text {
            .-user-name {
              font-size: 16px;
              font-weight: bold;
              color: rgba(74, 74, 74, 1);
              line-height: 22px;
            }

            .-book-name {
              font-size: 12px;
              font-weight: 400;
              color: rgba(74, 74, 74, 1);
              line-height: 17px;
            }
          }
        }

        .-left-down {
          display: flex;
          align-items: center;

          &-text {
            margin-left: 4px;
            font-size: 12px;
            font-weight: 400;
            color: rgba(74, 74, 74, 1);
            line-height: 17px;

            &-img {
              width: 14px;
              height: 11px;
            }

            &-img-two {
              width: 11px;
              height: 11px;
            }
          }

          &-text:last-child{
            margin-left: 24px;
          }
        }
      }

      &-right {
        padding-right: 24px;
        .-right-img {
          border-radius: 50%;
          width: 32px;
          height: 32px;
        }
      }
    }
  }
}
</style>
