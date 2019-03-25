<template>
  <div class="ld-share">
    <div class="ld-share-header">
      <div class="-header-left">
        <div class="-header-left-name">《吃水不忘挖井人》</div>
        <div class="-header-left-time">
          <span class="-start">00:00</span>
          <div class="-progress">
            <wux-progress
              status="normal"
              percent="50"
              strokeWidth="2"
              activeColor="#30C0FF"
              backgroundColor="#f3f3f3"/>
          </div>
          <span class="-end">05:10</span>
        </div>
      </div>
      <div class="-header-right">
        <div class="-header-right-img">
          <img class="-img" src="https://pub.file.k12.vip/read/lesson/kczy-button-play.png"/>
        </div>
      </div>
    </div>
    <div class="ld-share-content">
      <div class="-content-title">
        <div class="-content-title-img">
          <img class="-img" src="https://wx.qlogo.cn/mmhead/DQUJ1lic9u2tgaIBMEvzETXs9SnwSjpLmXyHFibWDd3Ws/132"/>
        </div>
        <div class="-content-title-name">李林的宝宝</div>
        <div class="-content-title-text">
          <div class="-text-one">还差<span class="-text-em">2</span>个赞</div>
          <div class="-text-two">就可以进前100名啦，请给我点个赞吧</div>
        </div>
      </div>
      <div class="-content-body">
        <div class="-body-img"
             style="background: url('https://pub.file.k12.vip/2019/03/25/1110002707316191234.png') no-repeat;background-size: cover;">
          <div class="-body-img-center">
            <img class="-img" src="https://pub.file.k12.vip/read/button-good.png"/>
          </div>
          <div class="-body-img-mask"></div>
        </div>
      </div>
      <div class="-content-footer">
        <div class="-content-footer-text" @click="toReport">
          <div>我要举报</div>
          <img class="-image" src="https://pub.file.k12.vip/read/icon-report.png"/>
        </div>
      </div>
    </div>
    <div class="ld-share-footer">
      <div class="-footer-btn">名师朗读欣赏</div>
    </div>

    <wux-popup :visible="isOpenReport" @close="toReport">
      <div class="ld-share-popup">
        <div class="-popup-title">举报内容</div>
        <textarea class="-popup-content" placeholder="请输入举报原因，不少于5个字~" auto-focus @blur="reportFn" :value="reportInfo"/>
        <div class="-popup-btn" @click="submitReport">确认举报</div>
      </div>
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
        isOpenReport: false,
        isFetching: false,
        dataList: [],
        reportInfo: ''
      };
    },

    components: {},

    methods: {
      reportFn (e) {
       this.reportInfo = e.mp.detail.value
      },
      toReport() {
        this.reportInfo = ''
        this.isOpenReport = !this.isOpenReport;
      },
      submitReport() {

        wx.showToast({
          title: this.reportInfo,
          icon: 'none',
          duration: 2000
        })
      },
      toJump() {
        wx.navigateTo({
          url: "/pages/popularityRank/main"
        });
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
            color: #FF668E;
            font-size: 24px;
          }
        }
      }

      .-content-body {
        position: relative;
        margin-top: 32px;

        .-body-img {
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
            width:150px;
            height:200px;
            background:rgba(48,192,255,0.5);
            border-radius:6px;
            filter:blur(2px);
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
        color: #30C0FF;
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
        background: linear-gradient(90deg, rgba(102, 255, 248, 1) 0%, rgba(48, 192, 255, 1) 100%);
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
