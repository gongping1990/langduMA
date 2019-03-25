<template>
  <div class="ld-my-work">
    <scroll-view class="ld-my-work-wrap"
                 @scrolltolower="bindLoadItem"
                 scroll-y
                 @scroll="scrollTopFn"
                 scroll-with-animation>
      <div class="ld-my-work-header">
        <div class="-header-down">《天地人》作品集</div>
        <div class="-header-top">
          <img class="-img" src="https://wx.qlogo.cn/mmhead/DQUJ1lic9u2tgaIBMEvzETXs9SnwSjpLmXyHFibWDd3Ws/132"/>
        </div>
      </div>
      <div class="ld-my-work-footer">
        <wux-swipe-action autoClose useSlots v-for="(item, index) of dataList" :key="index">
          <div slot="right" @click="delItem" class="-footer-action">
            <wux-icon type="ios-add" size="32" />
          </div>
          <div class="-footer-item">
            <div class="-item-tip" v-if="index==0">赞最多</div>
            <img class="-item-img" src="https://pub.file.k12.vip/read/lesson/kczy-button-play.png"/>
            <div class="-item-left">
              <div class="-item-title">
                <span>《天气人》</span>
                <img class="-img" src="https://pub.file.k12.vip/read/lesson/kczy-button-play.png"/>
              </div>
            </div>
            <div class="-item-down">
              <div class="-item-time">日期: 2019-03-22</div>
              <div class="-item-num">
                <img class="-img" src="https://pub.file.k12.vip/read/icon-good.png"/>
                <span>2933</span>
              </div>
            </div>
          </div>
        </wux-swipe-action>

      </div>
    </scroll-view>

  </div>
</template>

<script>
  import api from '../../request/api'
  export default {

    data() {
      return {
        page: {
          current: 1,
          size: 20,
          total: ""
        },
        isFetching: false,
        dataList: []
      };
    },

    components: {},

    mounted () {
      this.getList()
    },

    methods: {
      delItem (e) {
        console.log(e,'001')
      },
      bindLoadItem() {
        if (this.page.current < Math.ceil(this.page.total / this.page.size)) {
          this.page.current++;
          this.getList()
        }
      },
      getList() {
        this.isFetching = true;
        api.work.getSingleList({
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
    }
  };
</script>

<style lang="scss" scoped>
  .ld-my-work {

    background: #ffffff;

    &-wrap {
      height: 100vh;
    }

    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 24px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.12);
      margin-bottom: 21px;

      .-header-top {
        .-img {
          border-radius: 50%;
          width: 32px;
          height: 32px;
        }
      }

      .-header-down {
        height: 28px;
        font-size: 20px;
        font-weight: 500;
        color: rgba(74, 74, 74, 1);
        line-height: 28px;
      }
    }

    &-footer {

      .-footer-action {
        position: relative;
        width: 40px;
        height: 40px;
        top: 40%;
      }

      .-footer-item {
        position: relative;
        padding: 26px 16px 19px;
        margin: 21px 24px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 10px 0px rgba(222, 232, 237, 1);

        .-item-img {
          position: absolute;
          top: -18px;
          left: 0;
          width: 36px;
          height: 36px;
        }

        .-item-tip {
          position: absolute;
          top: 0;
          right: 0;
          width: 44px;
          height: 18px;
          background:linear-gradient(45deg,rgba(255,82,128,1) 0%,rgba(255,102,142,1) 100%);
          border-radius:0px 20px 0px 100px;
          font-size: 10px;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 18px;
          text-align: center;
          padding-left: 4px;
        }

        .-item-left {

          .-item-title {
            display: flex;
            align-items: center;
            font-size: 16px;
            font-weight: 500;
            color: #1D1B1B;
            line-height: 22px;

            .-img {
              display: inline-block;
              margin-left: 4px;
              color: #30C0FF;
              width: 16px;
              height: 16px;
            }
          }
        }

        .-item-down {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 11px;

          .-item-time {
            font-size: 10px;
            font-weight: 300;
            color: #707374;
            line-height: 14px;
          }

          .-item-num {
            font-size: 14px;
            font-weight: 400;
            color: #FF668E;
            line-height: 20px;

            .-img {
              margin-right: 8px;
              width: 15px;
              height: 15px;
            }
          }
        }
      }
    }
  }
</style>
