<template>
  <div class="ld-ranking">
    <div class="-scroll" v-if="isShowHeader">
      <div class="-scroll-bg">佳作推荐</div>
    </div>
    <scroll-view class="ld-ranking-wrap"
                 @scrolltolower="bindLoadItem"
                 scroll-y
                 @scroll="scrollTopFn"
                 scroll-with-animation>
      <div class="ld-ranking-top">
        <div class="-top-title">
          <div class="-top-title-left">上周人气之星</div>
          <div class="-top-title-right" @click="toJump">查看本周排行></div>
        </div>
        <div class="-top-content">
          <div class="-one">
            <div class="-one-img">
              <img class="-one-img-header"
                   src="https://wx.qlogo.cn/mmhead/DQUJ1lic9u2tgaIBMEvzETXs9SnwSjpLmXyHFibWDd3Ws/132">
            </div>
            <div class="-one-name">
              良辰美景小林哥aaa
            </div>
            <div class="-one-num">
              <img class="-one-num-img" src="https://pub.file.k12.vip/read/wind/icon-good2.png"/>
              <span>233</span>
            </div>
            <img class="-one-image" src="https://pub.file.k12.vip/read/wind/2.png"/>
          </div>
          <div class="-two">
            <div class="-two-img">
              <img class="-two-img-crown" src="https://pub.file.k12.vip/read/rank/icon-head champion.png"/>
              <img class="-two-img-header"
                   src="https://wx.qlogo.cn/mmhead/DQUJ1lic9u2tgaIBMEvzETXs9SnwSjpLmXyHFibWDd3Ws/132">
            </div>
            <div class="-two-name">heaven小林哥</div>
            <div class="-two-num">
              <img class="-two-num-img" src="https://pub.file.k12.vip/read/wind/icon-good1.png"/>
              <span>1233</span>
            </div>
            <img class="-two-image" src="https://pub.file.k12.vip/read/wind/1.png"/>
          </div>
          <div class="-one">
            <div class="-one-img">
              <img class="-one-img-header"
                   src="https://wx.qlogo.cn/mmhead/DQUJ1lic9u2tgaIBMEvzETXs9SnwSjpLmXyHFibWDd3Ws/132"/>
            </div>
            <div class="-one-name">Yasaman F</div>
            <div class="-one-num -three-num">
              <img class="-one-num-img" src="https://pub.file.k12.vip/read/wind/icon-good3.png"/>
              <span>33</span>
            </div>
            <img class="-one-image -three-image" src="https://pub.file.k12.vip/read/wind/3.png"/>
          </div>
        </div>
      </div>
      <div class="ld-ranking-down">
        <div class="-down-title" v-if="!isShowHeader">佳作推荐</div>
        <div class="-down-item" v-for="(item,index) of 6" :key="index">
          <div class="-down-item-tip" :class="{'-rq':index == '0','-tj':index==1}">{{index== 1 ? "教师推荐": "人气之星"}}</div>
          <div class="-down-item-left">
            <div class="-left-top">
              <div class="-left-top-img"></div>
              <div class="-left-top-text">
                <div class="-user-name">heaven小林哥</div>
                <div class="-book-name">《天地人》</div>
              </div>
            </div>
            <div class="-left-down">
              <div class="-left-down-text">
                <img class="-left-down-text-img" src="https://pub.file.k12.vip/read/wind/icon-playing.png"/>
                123000
              </div>
              <div class="-left-down-text">
                <img class="-left-down-text-img-two" src="https://pub.file.k12.vip/read/rank/icon-good2.png"/>
                2933
              </div>
            </div>
          </div>
          <div class="-down-item-right">
            <img class="-right-img" src="https://pub.file.k12.vip/read/lesson/kczy-button-play.png"/>
          </div>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        page: {
          current: 1,
          size: 20,
          total: ""
        },
        isShowHeader: false,
        isFetching: false,
        dataList: []
      };
    },

    components: {},

    methods: {
      scrollTopFn(e) {
        if (e.mp.detail.scrollTop > 324) {
          this.isShowHeader = true;
        } else {
          this.isShowHeader = false;
        }
        console.log(e.mp.detail.scrollTop);
      },
      bindLoadItem() {
        if (this.page.current < Math.ceil(this.page.total / this.page.size)) {
          this.page.current++;
          this.getList()
        }
      },
      toJump() {
        wx.navigateTo({
          url: `/pages/popularityRank/main?type=1`
        });
      },
      getList() {
        this.isFetching = true;
        api.userAccount.getUserAccountIncomeList({
          current: this.page.current,
          size: this.page.size
        }).then(({ data }) => {
          if (this.page.current > 1) {
            this.dataList = this.dataList.concat(data.resultData.records)
          } else {
            this.dataList = data.resultData.records;
          }
          this.page.total = data.resultData.total
          this.isFetching = false;
        }, () => {
          this.isFetching = false;
        });
      }
    },

    created() {
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
      animation: -scroll .5s;
      font-size: 20px;
      font-weight: 500;
      color: rgba(74, 74, 74, 1);

      &-bg {
        height: 46px;
        line-height: 46px;
        background: url("https://pub.file.k12.vip/read/rank/icon-tittle.png") 0% no-repeat;
        background-size: contain;
      }
    }

    @keyframes -scroll { /*设置内容由显示变为隐藏*/
      0% {
        opacity: 0;
      }

      100% {
        opacity: 1;
      }
    }

    &-top {
      background: url("https://pub.file.k12.vip/read/wind/backgroud.png");
      background-size: cover;
      padding: 0 24px 0 24px;
      height: 351px;

      .-top-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: rgba(255, 255, 255, 1);

        &-left {
          background: url("https://pub.file.k12.vip/read/rank/icon-tittle.png") 10% no-repeat;
          background-size: contain;
          color: rgba(29, 27, 27, 1);
          font-size: 20px;
          font-weight: 500;
          height: 46px;
          line-height: 46px;
        }

        &-right {
          color: #30C0FF;
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
            color: #FEA1BAFF;
            line-height: 17px;
            margin-bottom: 8px;

            &-img {
              margin-right: 4px;
              width: 15px;
              height: 15px;
            }
          }

          .-three-num {
            color: #86ECBCFF;
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
            color: #E2C65CFF;
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
    }

    &-down {
      padding: 0 24px;

      .-down-title {
        background: url("https://pub.file.k12.vip/read/rank/icon-tittle.png") 0% no-repeat;
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
          background: linear-gradient(90deg, rgba(253, 244, 197, 1) 0%, rgba(233, 223, 169, 1) 100%);
          color: #DCB876;
        }
        .-tj {
          background: linear-gradient(90deg, rgba(197, 255, 199, 1) 0%, rgba(161, 240, 203, 1) 100%);
          color: #79D0A7;
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
              background: rgba(216, 216, 216, 1);
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
            justify-content: space-between;
            align-items: center;

            &-text {
              margin-left: 4px;
              font-size: 12px;
              font-weight: 400;
              color: rgba(74, 74, 74, 1);
              line-height: 17px;

              &-img {
                width:14px;
                height:11px;
              }

              &-img-two {
                width:11px;
                height:11px;
              }
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
