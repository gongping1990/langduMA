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
           :class="[isShowTop ? 'ld-ranking-bg' : 'ld-ranking-no-bg']">
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
                   src="https://pub.file.k12.vip/2019/04/29/1122763456161116162.png" />
              <span>{{twoInfo.likes}}</span>
            </div>
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
                   src="https://pub.file.k12.vip/2019/04/29/1122763456161116162.png" />
              <span>{{oneInfo.likes}}</span>
            </div>
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
                   src="https://pub.file.k12.vip/2019/04/29/1122763456161116162.png" />
              <span>{{threeInfo.likes}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="ld-ranking-down">
        <div class="-down-title"
             v-if="!isShowHeader">佳作推荐</div>
        <div class="-down-item"
             v-for="(item,index) of dataList"
             :key="index"
             @click="lookOtherRead(item)">

          <div class="-down-item-left">
            <div class="-left-img">
              <img class="-img"
                   :src="item.headimgurl" />
            </div>
            <div class="-left-text">
              <div class="-left-top">
                <div class="-left-top-text">
                  <div class="-text-wrap">
                    <div class="-tip" v-if="item.recommend==2">
                     <img src="https://pub.file.k12.vip/read/fengcai/bg3.png"/>
                    </div>
                    <div class="-user-name">{{item.nickname}}</div>
                  </div>
                  <div class="-book-name">{{item.course}}</div>
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
          </div>
          <div class="-down-item-right">
            <img class="-right-img"
                 src="https://pub.file.k12.vip/read/fengcai/msfd-button-play.png" />
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
    position: relative;
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
    background: url('https://pub.file.k12.vip/read/fengcai/bg.png') no-repeat;
    background-size: cover;
    height: 377px;
  }

  &-no-bg {
    background: url('https://pub.file.k12.vip/read/fengcai/bg1.png') no-repeat;
    background-size: cover;
    height: 377px;
  }

  &-top {
    padding: 0 24px 0 24px;

    .-top-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: rgba(255, 255, 255, 1);

      &-left {
        margin-top: 20px;
        font-size: 20px;
        font-weight: 500;
      }

      &-right {
        margin-top: 25px;
        font-size: 12px;
        font-weight: 400;
      }
    }

    .-top-content {
      position: relative;
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      margin-top: 35px;
      text-align: center;
      padding: 0 20px;
      height: 148px;

      .-one {
        width: 33%;

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
          font-size: 10px;
          font-weight: 500;
          line-height: 18px;
          margin: 8px 0 4px 0;
          color: #FFFFFF;
        }

        &-num {
          height: 17px;
          font-size: 12px;
          font-weight: 400;
          color: #ffffff;
          line-height: 17px;
          margin-bottom: 8px;

          &-img {
            margin-right: 4px;
            width: 11px;
            height: 11px;
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
        position: relative;
        top: -30px;
        width: 34%;

        &-img {
          position: relative;
          margin: 0 auto;
          width: 80px;
          height: 80px;

          &-crown {
            position: absolute;
            top: -29px;
            left: 15px;
            width: 53px;
            height: 33px;
          }

          &-header {
            border: 3px solid rgba(226, 198, 92, 1);
            border-radius: 50%;
            width: 70px;
            height: 70px;
          }
        }

        &-name {
          height: 18px;
          font-size: 14px;
          font-weight: 500;
          line-height: 22px;
          margin: 0 0 3px 0;
          color: #FFFFFF;
        }

        &-num {
          height: 17px;
          font-size: 14px;
          font-weight: 400;
          color: #ffffff;
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
    position: absolute;
    top: 363px;
    border-radius:15px 15px 0px 0px;
    padding: 22px 18px 0 24px;
    background: #ffffff;
    width: 100%;
    box-sizing: border-box;

    .-down-title {
      font-size: 20px;
      font-weight: 500;
      color: rgba(74, 74, 74, 1);
    }

    .-down-item {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 25px;

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
        display: flex;
        align-items: center;

        .-left-img {
          margin-right: 10px;

          img {
            border-radius: 50%;
            width: 42px;
            height: 42px;
          }
        }

        .-left-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;


          &-text {

            .-text-wrap {
              display: flex;
            }

            .-user-name {
              font-size: 16px;
              font-weight: bold;
              color: #324062;
              line-height: 22px;
            }

            .-tip {
              margin-right: 8px;

              img {
                width: 64px;
                height: 18px;
              }
            }

            .-book-name {
              font-size: 12px;
              font-weight: 400;
              color: #5E677B;
              line-height: 17px;
              margin-top: 4px;
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
        .-right-img {
          border-radius: 50%;
          width: 40px;
          height: 40px;
        }
      }
    }
  }
}
</style>
