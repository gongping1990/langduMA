<template>
  <div class="ld-popularityRank">
    <div class="ld-popularityRank-header">
      <span :class="{'-active': tabType == '1'}" class="-header-span" @click="changeTab(1)">{{queryInfo.type == 1 ? '本周排行' : queryInfo.name}}</span>
      <span :class="{'-active': tabType == '2'}" @click="changeTab(2)" v-if="queryInfo.type == 1">上周排行</span>
    </div>
    <scroll-view class="ld-popularityRank-content"
                 @scrolltolower="bindLoadItem"
                 scroll-y
                 scroll-with-animation>
      <div class="ld-popularityRank-content-wrap">
        <div class="-content-item-one">
          <div class="-img">
            <img class="-img-crown" src="https://pub.file.k12.vip/read/rank/icon-head champion.png"/>
            <img class="-img-header" src="https://wx.qlogo.cn/mmhead/DQUJ1lic9u2tgaIBMEvzETXs9SnwSjpLmXyHFibWDd3Ws/132">
          </div>
          <div class="-item-one-wrap">
            <div class="-item-one-wrap-text">
              <img class="-left" src="https://pub.file.k12.vip/read/rank/icon-1st.png"/>
              <div>
                <div class="-name">VikentiyChaykovsky</div>
                <div class="-zan">
                  <img class="-zan-img" src="https://pub.file.k12.vip/read/rank/icon-good1.png"/>
                  <span>29</span>
                </div>
              </div>
            </div>
            <img class="-item-one-wrap-img" src="https://pub.file.k12.vip/read/rank/kczy-icon-sel1.png"/>
          </div>
        </div>
        <div class="item-wrap -content-wrap" v-for="(item,index) of 20" :key="index"
             :class="{'-two':index==0,'-three':index==1}">
          <img v-if="index==0" class="-item-img" src="https://pub.file.k12.vip/read/rank/icon-2ed.png"/>
          <img v-else-if="index==1" class="-item-img" src="https://pub.file.k12.vip/read/rank/icon-3rd.png"/>
          <div class="-item-left" v-else>{{index+2}}</div>
          <div class="-item-center">
            <img class="-item-center-img"
                 src="https://wx.qlogo.cn/mmhead/DQUJ1lic9u2tgaIBMEvzETXs9SnwSjpLmXyHFibWDd3Ws/132"/>
            <div class="-item-center-text">
              <div class="-name">VikentiyChaykovsky</div>
              <div class="-zan">
                <img class="-zan-img" src="https://pub.file.k12.vip/read/rank/icon-good2.png"/>
                <span>29</span>
              </div>
            </div>
          </div>
          <div class="-item-right">
            <img class="-item-right-img" src="https://pub.file.k12.vip/read/rank/kczy-icon-sel2.png"/>
          </div>
        </div>
      </div>
    </scroll-view>
    <div class="ld-popularityRank-footer">
      <div class="-footer-wrap">
        <div class="item-wrap -footer-item">
          <div class="-item-left -footer-num">200</div>
          <div class="-item-center">
            <img class="-item-center-img"
                 src="https://wx.qlogo.cn/mmhead/DQUJ1lic9u2tgaIBMEvzETXs9SnwSjpLmXyHFibWDd3Ws/132"/>
            <div class="-item-center-text">
              <div class="-name">VikentiyChaykovsky</div>
              <div class="-zan">
                <img class="-zan-img" src="https://pub.file.k12.vip/read/rank/icon-good2.png"/>
                <span>29</span>
              </div>
            </div>
          </div>
          <div class="-item-right -footer-right" @click="openPopup">集赞冲榜</div>
          <img class="-footer-img" src="https://pub.file.k12.vip/read/rank/zp-button-share.png"/>
        </div>
      </div>
    </div>
    <wux-popup :visible="isOpenPopup" position="bottom" @close="openPopup">
      <div class="ld-popularityRank-popup-content" :class="{'-more': isOpenMore}">
        <div class="-popup-title">叫大家来给你的作品点赞吧</div>
        <div class="-popup-item" v-if="!isOpenMore">
          <div class="-item-tip">赞最多</div>
          <div class="-item-left">
            <div class="-item-title">《天气人》</div>
            <div class="-item-title-two">日期: 2019-03-22</div>
            <div class="-item-num">2933</div>
          </div>
          <div class="-item-center"></div>
        </div>
        <scroll-view class="-popup-item-wrap"
                     v-if="isOpenMore"
                     @scrolltolower="bindLoadItem"
                     scroll-y
                     @scroll="scrollTopFn"
                     scroll-with-animation>
          <div class="-popup-item" v-for="(item, index) of 4" :key="index">
            <div class="-item-tip" v-if="index==0">赞最多</div>
            <div class="-item-left">
              <div class="-item-title">《天气人》</div>
              <div class="-item-title-two">日期: 2019-03-22</div>
              <div class="-item-num">2933</div>
            </div>
            <div class="-item-center"></div>
          </div>
        </scroll-view>
        <div class="-popup-more" @click="openMore" v-if="!isOpenMore">选择其他作品 ></div>
      </div>


      <button open-type="share" class="ld-popularityRank-popup-btn">分享到班级群</button>
    </wux-popup>
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
        isFetching: false,
        isOpenPopup: false,
        isOpenMore: false,
        dataList: [],
        queryInfo: '',
        tabType: "1"
      };
    },

    components: {},

    onLoad() {
      this.queryInfo = this.$root.$mp.query
      console.log(this.$root.$mp.query,'090');
    },

    methods: {
      openMore() {
        this.isOpenMore = !this.isOpenMore;
      },
      openPopup() {
        this.isOpenPopup = !this.isOpenPopup;
      },
      changeTab(num) {
        this.tabType = num;
      },
      bindLoadItem() {
        console.log(111);
        if (this.page.current < Math.ceil(this.page.total / this.page.size)) {
          this.page.current++;
          // this.getList()
        }
      },
      getList() {
        this.isFetching = true;
        api.userAccount.getUserAccountIncomeList({
          current: this.page.current,
          size: this.page.size
        }).then(({ data }) => {
          let array = [];
          let arrayStorage = [];

          data.resultData.records.forEach(item => {
            if (item.income) {
              array.push(item);
            }
          });

          if (this.page.current > 1) {
            arrayStorage = arrayStorage.concat(array);
          } else {
            arrayStorage = array;
          }

          this.page.total = data.resultData.total;
          this.isFetching = false;
        }, () => {
          this.isFetching = false;
        });
      }
    },

    created() {
      wx.getSystemInfo({
        success: function(res) {
          var ww = res.windowWidth;
          var hh = res.windowHeight;
          console.log(ww, hh, "009");
        }
      });
    }


  };
</script>

<style lang="scss" scoped>
  .ld-popularityRank {
    background: rgba(255, 255, 255, 1);
    background: url("https://pub.file.k12.vip/read/hotRank/backgroud.png") no-repeat;
    background-size: cover;
    height: 160px;

    .-active {
      font-size: 20px;
      font-weight: 500;
      color: #1D1B1B;
      line-height: 28px;
    }

    &-header {
      z-index: 2;
      padding: 16px 24px;
      font-size: 16px;
      font-weight: 400;
      color: #707374;
      line-height: 22px;
      background: url("https://pub.file.k12.vip/read/rank/icon-tittle.png") 10% no-repeat ;
      background-size: contain;

      .-header-span {
        z-index: 22;
        margin-right: 24px;
      }
    }

    &-content {
      z-index: 2;
      height: calc(100vh - 100px - 60px);

      &-wrap {
        position: relative;
        padding: 60px 24px 0;

        .-content-item-one {
          height: 101px;
          background: rgba(48, 192, 255, 1);
          box-shadow: 0px 4px 12px 0px rgba(182, 211, 223, 1);
          border-radius: 16px;
          padding: 0 18px 0 18px;

          .-img {
            position: absolute;
            top: 36px;
            left: 48px;
            width:48px;
            height:48px;

            &-crown {
              position: absolute;
              top: -18px;
              left: 12px;
              width:32px;
              height:20px;
            }

            &-header {
              border:3px solid rgba(226, 198, 92, 1);
              border-radius: 50%;
              width:48px;
              height:48px;
            }
          }

          .-item-one-wrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100%;

            &-left {
              width: 17px;
              height: 21px;
            }

            &-img {
              width: 10px;
              height: 17px;
            }

            &-text {
              display: flex;
              align-items: center;
              margin-top: 16px;
              color: #FDF4C5;

              .-left {
                margin-right: 30px;
                width: 17px;
                height: 21px;
              }

              .-name {
                font-size: 16px;
                font-weight: 500;
                line-height: 22px;
              }
              .-zan {
                margin-top: 4px;
                font-size: 12px;
                font-weight: 400;
                line-height: 17px;

                &-img {
                  margin-right: 4px;
                  width: 11px;
                  height: 11px;
                }
              }
            }
          }
        }

        .-content-wrap {
          border-radius: 16px;
          border: 3px solid rgba(245, 245, 245, 1);
          padding: 0 16px;
        }

        .-two {
          border: 3px solid rgba(254, 161, 186, 1);
        }

        .-three {
          border: 3px solid rgba(134, 236, 188, 1)
        }
      }
    }

    &-footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 91px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 1);

      .-footer-wrap {
        padding: 0 24px;
        height: 100%;

        .-footer-item {
          margin: 0 !important;
        }

        .-footer-right {
          font-weight: bold !important;
        }

        .-footer-num {
          color: #30C0FFFF !important;
        }

        .-footer-img {
          position: absolute;
          right: 24px;
          top: -24px;
          width: 48px;
          height: 48px;
        }
      }
    }

    .-more {
      height: 440px !important;

      .-popup-item {
        margin: 16px !important;
      }
    }

    &-popup-content {
      margin: 0 24px;
      width: 327px;
      height: 250px;
      background: rgba(255, 255, 255, 1);
      border-radius: 16px;

      .-popup-title {
        font-size: 20px;
        font-weight: 500;
        color: rgba(74, 74, 74, 1);
        padding: 32px 0 24px 0;
      }

      .-popup-item-wrap {
        height: 360px;
      }

      .-popup-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        padding: 16px 24px;
        margin: 0 16px;
        border-radius: 6px;
        border: 1px solid rgba(236, 236, 236, 1);

        .-item-tip {
          position: absolute;
          top: 0;
          right: 0;
          width: 44px;
          height: 18px;
          background: rgba(155, 155, 155, 1);
          border-radius: 0px 6px 0px 100px;
          font-size: 10px;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 18px;
          text-align: center;
        }

        .-item-left {
          text-align: left;
          width: 60%;

          .-item-title {
            font-size: 16px;
            font-weight: 500;
            color: rgba(74, 74, 74, 1);
            line-height: 22px;
          }

          .-item-title-two {
            margin-top: 4px;
            font-size: 12px;
            font-weight: 300;
            color: rgba(236, 236, 236, 1);
            line-height: 14px;
          }

          .-item-num {
            margin-top: 12px;
            font-size: 12px;
            font-weight: 400;
            color: rgba(74, 74, 74, 1);
            line-height: 17px;
          }
        }

        .-item-center {
          border-radius: 50%;
          width: 32px;
          height: 32px;
          background: rgba(74, 74, 74, 1);
        }
      }

      .-popup-more {
        margin-top: 24px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
      }
    }

    &-popup-btn {
      margin: 12px 24px 34px;
      width: 327px;
      height: 52px;
      background: rgba(255, 255, 255, 1);
      border-radius: 16px;
      font-size: 15px;
      font-weight: 500;
      color: rgba(74, 74, 74, 1);
      line-height: 52px;
    }

    .item-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 76px;
      background: rgba(255, 255, 255, 1);
      margin: 16px 0;

      .-item-img {
        width:17px!important;
        height:21px!important;
      }

      .-item-left {
        font-size: 17px;
        font-weight: 600;
        color: rgba(0, 0, 0, 1);
        /*line-height: 24px;*/
      }

      .-item-center {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &-img {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          margin-right: 12px;
        }

        &-text {

          .-name {
            font-weight: bold;
            font-size: 16px;
            line-height: 22px;
            color: #1D1B1BFF;
          }
          .-zan {
            color: rgba(112, 115, 116, 1);
            margin-top: 4px;
            font-size: 12px;
            font-weight: 400;
            line-height: 17px;

            &-img {
              margin-right: 4px;
              width: 11px;
              height: 11px;
            }
          }
        }
      }

      .-item-right {
        font-size: 12px;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
        line-height: 17px;

        &-img {
          width: 10px;
          height: 17px;
        }
      }
    }
  }
</style>
