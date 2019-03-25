<template>
  <div class="ld-popularityRank">
    <div class="ld-popularityRank-header">
      <span :class="{'-active': tabType == '1'}" class="-header-span" @click="changeTab(1)">本周排行</span>
      <span :class="{'-active': tabType == '2'}" @click="changeTab(2)">上周排行</span>
    </div>
    <scroll-view class="ld-popularityRank-content"
                 @scrolltolower="bindLoadItem"
                 scroll-y
                 scroll-with-animation>
      <div class="ld-popularityRank-content-wrap">
        <div class="-content-item-one">
          <div class="-img"></div>
          <div class="-item-one-wrap">
            <div class="-item-one-wrap-text">
              <div class="-name">VikentiyChaykovsky</div>
              <div class="-zan">29</div>
            </div>
            <div class="-item-one-wrap-img"></div>
          </div>
        </div>
        <div class="item-wrap -content-wrap" v-for="(item,index) of 20" :key="index">
          <div class="-item-left">{{index}}</div>
          <div class="-item-center">
            <div class="-item-center-img"></div>
            <div class="-item-center-text">
              <div class="-name">VikentiyChaykovsky</div>
              <div class="-zan">29</div>
            </div>
          </div>
          <div class="-item-right">
            <div class="-item-right-img"></div>
          </div>
        </div>
      </div>
    </scroll-view>

    <div class="ld-popularityRank-footer">
      <div class="-footer-wrap">
        <div class="item-wrap">
          <div class="-item-left">200</div>
          <div class="-item-center">
            <div class="-item-center-img"></div>
            <div class="-item-center-text">
              <div class="-name">VikentiyChaykovsky</div>
              <div class="-zan">29</div>
            </div>
          </div>
          <div class="-item-right" @click="openPopup">集赞冲榜 ></div>
        </div>
      </div>
    </div>

    <wux-popup :visible="!isOpenPopup" position="bottom" @close="openPopup">
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
        tabType: "1"
      };
    },

    components: {},

    onLoad() {
      console.log(222222)
    },

    methods: {
      openMore () {
        this.isOpenMore = !this.isOpenMore
      },
      openPopup () {
        this.isOpenPopup = !this.isOpenPopup
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
    },


  };
</script>

<style lang="scss" scoped>
  .ld-popularityRank {
    height: 100vh;
    background: rgba(74, 74, 74, 1);

    .-active {
      font-size: 20px;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 28px;
    }

    &-header {
      padding: 16px 24px;
      font-size: 16px;
      font-weight: 400;
      color: rgba(155, 155, 155, 1);
      line-height: 22px;

      .-header-span {
        margin-right: 24px;
      }
    }

    &-content {
      height: calc(100vh - 100px - 60px);

      &-wrap {
        position: relative;
        padding: 60px 24px 0;

        .-content-item-one {
          padding: 0 16px 0 24px;
          height: 101px;
          background: rgba(255, 255, 255, 1);
          border-radius: 6px;
          border: 2px solid rgba(0, 0, 0, 1);

          .-img {
            position: absolute;
            top: 36px;
            left: 48px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: rgba(216, 216, 216, 1);
            border: 2px solid rgba(0, 0, 0, 1);
            z-index: 999;
          }

          .-item-one-wrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100%;

            &-img {
              border-radius: 50%;
              width: 32px;
              height: 32px;
              background: rgba(74, 74, 74, 1);
            }

            &-text {
              color: rgba(74, 74, 74, 1);

              .-name {
                font-size: 16px;
                font-weight: 500;
                line-height: 22px;
              }
              .-zan {
                font-size: 12px;
                font-weight: 400;
                line-height: 17px;
              }
            }
          }
        }

        .-content-wrap {
          padding: 0 16px;
        }
      }
    }

    &-footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 100px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.12);

      .-footer-wrap {
        padding: 0 24px;
        height: 100%;
      }
    }

    .-more {
      height: 440px!important;

      .-popup-item {
        margin: 16px!important;
      }
    }

    &-popup-content {
      margin: 0 24px;
      width:327px;
      height:250px;
      background:rgba(255,255,255,1);
      border-radius:16px;

      .-popup-title {
        font-size:20px;
        font-weight:500;
        color:rgba(74,74,74,1);
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
          width:44px;
          height:18px;
          background:rgba(155,155,155,1);
          border-radius:0px 6px 0px 100px;
          font-size:10px;
          font-weight:400;
          color:rgba(255,255,255,1);
          line-height:18px;
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
        font-size:12px;
        font-weight:400;
        color:rgba(0,0,0,1);
      }
    }

    &-popup-btn {
      margin: 12px 24px 34px;
      width:327px;
      height:52px;
      background:rgba(255,255,255,1);
      border-radius:16px;
      font-size:15px;
      font-weight:500;
      color:rgba(74,74,74,1);
      line-height:52px;
    }

    .item-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 76px;
      background: rgba(255, 255, 255, 1);
      border-radius: 6px;
      margin: 16px 0;

      .-item-left {
        font-size: 17px;
        font-weight: 600;
        color: rgba(0, 0, 0, 1);
        line-height: 24px;
      }

      .-item-center {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &-img {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(216, 216, 216, 1);
          margin-right: 12px;
        }

        &-text {
          color: rgba(74, 74, 74, 1);

          .-name {
            font-size: 16px;
            font-weight: 500;
            line-height: 22px;
          }
          .-zan {
            font-size: 12px;
            font-weight: 400;
            line-height: 17px;
          }
        }
      }

      .-item-right {
        font-size: 12px;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
        line-height: 17px;

        &-img {
          border-radius: 50%;
          width: 32px;
          height: 32px;
          background: rgba(74, 74, 74, 1);
        }
      }
    }
  }
</style>
