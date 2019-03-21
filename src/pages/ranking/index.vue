<template>
  <div class="ld-ranking">
    <scroll-view class="ld-ranking-wrap"
                 @scrolltolower="bindLoadItem"
                 scroll-y
                 scroll-with-animation>
      <div class="ld-ranking-top">
        <div class="-top-title">
          <div class="-top-title-left">上周人气之星</div>
          <div class="-top-title-right" @click="toJump">查看本周排行></div>
        </div>
        <div class="-top-content">
          <div class="-one">
            <div class="-one-img"></div>
            <div class="-one-name">Okazaki Suzuko</div>
            <div class="-one-num">233</div>
          </div>
          <div class="-two">
            <div class="-two-img"></div>
            <div class="-two-name">heaven小林哥</div>
            <div class="-two-num">1233</div>
          </div>
          <div class="-one">
            <div class="-one-img"></div>
            <div class="-one-name">Yasaman F</div>
            <div class="-one-num">33</div>
          </div>
        </div>
      </div>
      <div class="ld-ranking-down">
        <div class="-down-title">
          佳作推荐
        </div>
        <div class="-down-item" v-for="(item,index) of 6" :key="index">
          <div class="-down-item-tip">人气之星</div>
          <div class="-down-item-left">
            <div class="-left-top">
              <div class="-left-top-img"></div>
              <div class="-left-top-text">
                <div class="-user-name">heaven小林哥</div>
                <div class="-book-name">《天地人》</div>
              </div>
            </div>
            <div class="-left-down">
              <div class="-left-down-text">123000</div>
              <div class="-left-down-text">2933</div>
            </div>
          </div>
          <div class="-down-item-right">
            <div class="-right-img"></div>
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
        isFetching: false,
        dataList: []
      };
    },

    components: {},

    methods: {
      bindLoadItem() {
        console.log(111);
        if (this.page.current < Math.ceil(this.page.total / this.page.size)) {
          this.page.current++;
          // this.getList()
        }
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
      // let app = getApp()
    }
  };
</script>

<style lang="scss" scoped>
  .ld-ranking {
    &-wrap {
      height: 100vh;
    }

    &-top {
      padding: 16px 24px 0 24px;
      height: 280px;
      background: rgba(74, 74, 74, 1);

      .-top-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: rgba(255, 255, 255, 1);

        &-left {
          font-size: 20px;
          font-weight: 500;

        }

        &-right {
          font-size: 12px;
          font-weight: 400;
        }
      }

      .-top-content {
        display: flex;
        justify-content: space-around;
        align-items: flex-end;
        margin-top: 86px;
        text-align: center;

        .-one {
          width: 33%;

          &-img {
            margin: 0 auto;
            border-radius: 50%;
            width: 48px;
            height: 48px;
            background: rgba(216, 216, 216, 1);
            border: 2px solid rgba(0, 0, 0, 1);
          }

          &-name {
            height: 18px;
            font-size: 13px;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            line-height: 18px;
            margin: 8px 0 4px 0;
          }

          &-num {
            height: 17px;
            font-size: 12px;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 17px;
          }
        }
        .-two {
          width: 33%;

          &-img {
            margin: 0 auto;
            border-radius: 50%;
            width: 80px;
            height: 80px;
            background: rgba(216, 216, 216, 1);
            border: 2px solid rgba(0, 0, 0, 1);
          }

          &-name {
            height: 18px;
            font-size: 16px;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            line-height: 22px;
            margin: 8px 0 4px 0;
          }

          &-num {
            height: 17px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 20px;
          }
        }
      }
    }

    &-down {
      padding: 0 24px;

      .-down-title {
        margin-top: 32px;
        font-size: 20px;
        font-weight: 500;
        color: rgba(74, 74, 74, 1);
        line-height: 28px;
      }

      .-down-item {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 16px 0;
        height: 102px;
        border-radius: 6px;
        border: 1px solid rgba(236, 236, 236, 1);

        &-tip {
          position: absolute;
          top: 0;
          right: 0;
          width: 60px;
          height: 18px;
          background: rgba(155, 155, 155, 1);
          border-radius: 0 26px 0 100px;
          font-size: 10px;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 14px;
          text-align: center;
        }

        &-left {
          padding: 18px 0 15px 24px;

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
              font-size: 12px;
              font-weight: 400;
              color: rgba(74, 74, 74, 1);
              line-height: 17px;
            }
          }

        }

        &-right {
          padding-right: 24px;
          .-right-img {
            border-radius: 50%;
            width: 32px;
            height: 32px;
            background: rgba(74, 74, 74, 1);
          }
        }
      }

    }

  }
</style>
