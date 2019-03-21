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
              activeColor="#ffc900"
              backgroundColor="#f3f3f3"/>
          </div>
          <span class="-end">05:10</span>
        </div>
      </div>
      <div class="-header-right">
        <div class="-header-right-img"></div>
      </div>
    </div>
    <div class="ld-share-content">
      <div class="-content-title">
        <div class="-content-title-img"></div>
        <div class="-content-title-name">李林的宝宝</div>
        <div class="-content-title-text">
          <div class="-text-one">还差<span class="-text-em">2</span>个赞就可以进前<span class="-text-em">100</span>名啦</div>
          <div class="-text-two">请给我点个赞吧</div>
        </div>
      </div>
      <div class="-content-body">
        <div class="-body-img">
          <div class="-body-img-center"></div>
        </div>
      </div>
      <div class="-content-footer">
        <div class="-content-footer-text" @click="toReport">我要举报</div>
      </div>
    </div>
    <div class="ld-share-footer">
      <div class="-footer-btn">名师朗读欣赏</div>
    </div>

    <wux-popup :visible="isOpenReport">
      <div class="ld-share-popup">
        <div class="-popup-title">举报内容</div>
        <div class="-popup-content">
          <wux-textarea
            hasCount
            placeholder="请输入举报原因，不少于5个字~"
            placeholder-class="placeholder-class"
            rows="4"/>
        </div>
        <div class="-popup-btn" @click="toReport">确认</div>
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
        isOpenReport: true,
        isFetching: false,
        dataList: []
      };
    },

    components: {},

    methods: {
      toReport() {
        this.isOpenReport = !this.isOpenReport;
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
          border-radius: 50%;
          width: 36px;
          height: 36px;
          background: rgba(74, 74, 74, 1);
        }
      }
    }

    &-content {
      text-align: center;

      .-content-title {
        &-img {
          margin: 0 auto;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          background: rgba(216, 216, 216, 1);
        }

        &-name {
          margin-top: 4px;
          margin-bottom: 12px;
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
            font-size: 22px;
          }
        }
      }

      .-content-body {
        margin-top: 24px;

        .-body-img {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto;
          width: 150px;
          height: 200px;
          background: rgba(74, 74, 74, 1);
          box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.1);
          border-radius: 6px;

          &-center {
            border-radius: 50%;
            width: 72px;
            height: 72px;
            background: rgba(255, 255, 255, 0.16);
          }
        }
      }

      .-content-footer {
        margin-top: 65px;
        padding: 0 24px;
        text-align: right;

        &-text {
          font-size: 12px;
          font-weight: 400;
          color: rgba(155, 155, 155, 1);
        }
      }
    }

    &-footer {
      padding: 0 24px;
      margin: 24px 0;
      text-align: center;

      .-footer-btn {
        height: 52px;
        background: rgba(240, 240, 240, 1);
        border-radius: 26px;
        border: 1px solid rgba(155, 155, 155, 1);
        font-size: 15px;
        font-weight: 500;
        color: rgba(74, 74, 74, 1);
        line-height: 52px;
      }
    }

    &-popup {
      text-align: center;
      margin: 0 24px;
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
        font-size: 14px;
        margin: 0 32px;
        padding: 10px;
        text-align: left;
        background: rgba(240, 240, 240, 1);
        border-radius: 6px;
        border: 1px solid rgba(155, 155, 155, 1);
      }

      .-popup-btn {
        text-align: center;
        margin: 33px 32px 23px 32px;
        height: 40px;
        background: rgba(74, 74, 74, 1);
        border-radius: 26px;
        font-size: 15px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 40px;
      }
    }

  }
</style>
